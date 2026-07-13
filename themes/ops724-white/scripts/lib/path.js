'use strict';

const { normalizeLang } = require('./content');

function getPageLang(page) {
  const lang = page && page.lang ? page.lang : '';
  if (lang === 'en') return 'en';

  const path = page && page.path ? page.path : '';
  if (path.startsWith('en/')) return 'en';

  return 'zh-CN';
}

function fallbackPath(lang) {
  return normalizeLang(lang) === 'en' ? '/en/' : '/';
}

function stripIndex(pathname) {
  return String(pathname || '').replace(/index\.html$/, '');
}

function normalizePath(pathname) {
  return stripIndex(pathname).replace(/^\/+/, '');
}

function normalizeTaxonomyPath(pathname) {
  return String(pathname || '').replace(/^\/+|\/+$/g, '');
}

function localizedPath(pathname, lang) {
  const path = normalizePath(pathname);

  if (!path) return '';

  if (normalizeLang(lang) === 'en') {
    return path.startsWith('en/') ? path : `en/${path}`;
  }

  return path.replace(/^en\//, '');
}

function stripPagination(pathname, paginationDir) {
  const path = normalizePath(pathname);
  const pattern = new RegExp(`/${paginationDir || 'page'}/\\d+/?$`);

  return path.replace(pattern, '');
}

module.exports = {
  fallbackPath,
  getPageLang,
  localizedPath,
  normalizePath,
  normalizeTaxonomyPath,
  stripIndex,
  stripPagination
};
