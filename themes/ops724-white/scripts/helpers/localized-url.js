'use strict';
const { normalizeLang } = require('../lib/content');
const {
  fallbackPath,
  getPageLang,
  localizedPath,
  normalizePath,
  stripPagination
} = require('../lib/path');

function routeExists(pathname) {
  const normalizedPath = normalizePath(pathname);

  if (!normalizedPath) {
    return Boolean(hexo.route.get('index.html'));
  }

  return Boolean(
    hexo.route.get(normalizedPath) ||
    hexo.route.get(`${normalizedPath}/index.html`) ||
    hexo.route.get(`${normalizedPath}.html`)
  );
}

function finalizeUrl(pathname, lang) {
  const directPath = localizedPath(pathname, lang);

  if (!directPath) {
    return fallbackPath(lang);
  }

  if (routeExists(directPath)) {
    return `/${directPath}`;
  }

  const basePath = stripPagination(directPath, hexo.config.pagination_dir);

  if (basePath && routeExists(basePath)) {
    return `/${basePath}`;
  }

  return fallbackPath(lang);
}

function isPathWithin(currentPath, targetPath) {
  if (!targetPath) return false;
  if (currentPath === targetPath) return true;
  return currentPath.startsWith(`${targetPath}/`);
}

hexo.extend.helper.register('page_lang', function pageLang(page) {
  return getPageLang(page);
});

hexo.extend.helper.register('localized_page_url', function localizedPageUrl(page, targetLang) {
  const lang = normalizeLang(targetLang);
  const currentLang = getPageLang(page);
  const posts = hexo.locals.get('posts').toArray();

  if (page && page.translation_key) {
    const sibling = posts.find(post => {
      return post.translation_key === page.translation_key && normalizeLang(post.lang) === lang;
    });

    if (sibling) {
      return `/${normalizePath(sibling.path)}`;
    }
  }

  const path = page && page.path ? normalizePath(page.path) : '';

  if (!path || path === '/') {
    return fallbackPath(lang);
  }

  if (currentLang === lang) {
    return `/${path}`;
  }

  return finalizeUrl(path, lang);
});

hexo.extend.helper.register('localized_taxonomy_url', function localizedTaxonomyUrl(taxonomyPath, targetLang) {
  const lang = normalizeLang(targetLang);
  const path = localizedPath(taxonomyPath || '', lang);

  return path ? `/${path}` : fallbackPath(lang);
});

hexo.extend.helper.register('is_nav_active', function isNavActive(page, targetPath) {
  const lang = getPageLang(page);
  const currentPath = stripPagination(normalizePath(page && page.path ? page.path : ''), hexo.config.pagination_dir);
  const target = normalizePath(targetPath || '');

  if (target === '' || target === 'en') {
    return page && page.section === 'tech' && (
      currentPath === target ||
      page.layout === 'post'
    );
  }

  if (target === 'life' || target === 'en/life') {
    return page && page.section === 'life';
  }

  if (target === 'categories' || target === 'en/categories') {
    return isPathWithin(currentPath, target);
  }

  if (target === 'tags' || target === 'en/tags') {
    return isPathWithin(currentPath, target);
  }

  if (target === 'archives' || target === 'en/archives') {
    return isPathWithin(currentPath, target);
  }

  if (target === 'about' || target === 'en/about') {
    return currentPath === target;
  }

  return currentPath === target;
});
