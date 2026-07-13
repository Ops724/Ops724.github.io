'use strict';

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function normalizeSection(value) {
  return value === 'life' ? 'life' : 'tech';
}

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

function sortPosts(posts) {
  return posts.sort((left, right) => {
    const stickyDiff = (right.sticky || 0) - (left.sticky || 0);
    if (stickyDiff) return stickyDiff;

    return right.date.valueOf() - left.date.valueOf();
  });
}

function filterPosts(collection, lang, section) {
  const normalizedLang = normalizeLang(lang);
  const normalizedSection = typeof section === 'string' ? normalizeSection(section) : null;

  return sortPosts(
    toArray(collection)
      .filter(post => normalizeLang(post.lang) === normalizedLang)
      .filter(post => !normalizedSection || normalizeSection(post.section) === normalizedSection)
  );
}

module.exports = {
  filterPosts,
  normalizeLang,
  normalizeSection,
  sortPosts,
  toArray
};
