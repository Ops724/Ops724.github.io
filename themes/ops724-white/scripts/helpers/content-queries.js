'use strict';

const { filterPosts, normalizeSection } = require('../lib/content');

hexo.extend.helper.register('posts_by_lang', function postsByLang(lang, section) {
  return filterPosts(hexo.locals.get('posts'), lang, section);
});

hexo.extend.helper.register('collection_by_lang', function collectionByLang(collection, lang, section) {
  return filterPosts(collection, lang, section);
});

hexo.extend.helper.register('taxonomy_count_by_lang', function taxonomyCountByLang(taxonomy, lang) {
  const posts = taxonomy && taxonomy.posts ? taxonomy.posts : taxonomy;
  return filterPosts(posts, lang).length;
});

hexo.extend.helper.register('section_name', function sectionName(section) {
  return normalizeSection(section);
});
