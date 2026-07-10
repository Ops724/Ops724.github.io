'use strict';

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function toPostArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

function filterPostsByLang(collection, lang) {
  const normalized = normalizeLang(lang);

  return toPostArray(collection)
    .filter(post => normalizeLang(post.lang) === normalized)
    .sort((left, right) => right.date.valueOf() - left.date.valueOf());
}

hexo.extend.helper.register('posts_by_lang', function postsByLang(lang) {
  return filterPostsByLang(hexo.locals.get('posts'), lang);
});

hexo.extend.helper.register('collection_by_lang', function collectionByLang(collection, lang) {
  return filterPostsByLang(collection, lang);
});

hexo.extend.helper.register('taxonomy_count_by_lang', function taxonomyCountByLang(taxonomy, lang) {
  const posts = taxonomy && taxonomy.posts ? taxonomy.posts : taxonomy;
  return filterPostsByLang(posts, lang).length;
});

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
  const posts = filterPostsByLang(hexo.locals.get('posts'), lang);

  const index = posts.findIndex(post => post.path === page.path);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null
  };
});
