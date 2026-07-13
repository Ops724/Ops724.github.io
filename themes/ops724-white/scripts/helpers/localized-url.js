'use strict';

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function getPageLang(page) {
  const lang = page && page.lang ? page.lang : '';
  if (lang === 'en') return 'en';

  const path = page && page.path ? page.path : '';
  if (path.startsWith('en/')) return 'en';

  return 'zh-CN';
}

function fallbackPath(lang) {
  return lang === 'en' ? '/en/' : '/';
}

function stripIndex(pathname) {
  return pathname.replace(/index\.html$/, '');
}

function normalizePath(pathname) {
  return stripIndex(pathname).replace(/^\/+/, '');
}

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

function localizedPath(pathname, lang) {
  const path = normalizePath(pathname);

  if (!path) return '';

  if (lang === 'en') {
    return path.startsWith('en/') ? path : `en/${path}`;
  }

  return path.replace(/^en\//, '');
}

function stripPagination(pathname) {
  const path = normalizePath(pathname);
  const paginationDir = hexo.config.pagination_dir || 'page';
  const pattern = new RegExp(`/${paginationDir}/\\d+/?$`);

  return path.replace(pattern, '');
}

function finalizeUrl(pathname, lang) {
  const directPath = localizedPath(pathname, lang);

  if (!directPath) {
    return fallbackPath(lang);
  }

  if (routeExists(directPath)) {
    return `/${directPath}`;
  }

  const basePath = stripPagination(directPath);

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
  const path = normalizePath(taxonomyPath || '');

  if (!path) {
    return fallbackPath(lang);
  }

  if (lang === 'en') {
    return `/${path.startsWith('en/') ? path : `en/${path}`}`;
  }

  return `/${path.replace(/^en\//, '')}`;
});
