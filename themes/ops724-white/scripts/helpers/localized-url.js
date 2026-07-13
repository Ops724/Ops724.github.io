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
