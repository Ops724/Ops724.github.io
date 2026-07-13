'use strict';

const { filterPosts, normalizeLang, normalizeSection } = require('../lib/content');

hexo.extend.helper.register('post_summary', function postSummary(post) {
  const source = post.excerpt || post.more || post.content || '';
  const plain = source
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return '';
  if (plain.length <= 140) return plain;

  return `${plain.slice(0, 140).trim()}...`;
});

hexo.extend.helper.register('post_neighbors', function postNeighbors(page) {
  if (!page || !page.path) {
    return { prev: null, next: null };
  }

  const lang = normalizeLang(page.lang);
  const section = normalizeSection(page.section);
  const posts = filterPosts(hexo.locals.get('posts'), lang, section);

  const index = posts.findIndex(post => post.path === page.path);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null
  };
});
