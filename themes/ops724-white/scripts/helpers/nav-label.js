'use strict';

hexo.extend.helper.register('posts_by_lang', function postsByLang(lang) {
  const normalized = lang === 'en' ? 'en' : 'zh-CN';
  const posts = hexo.locals.get('posts').toArray();

  return posts.filter(post => {
    const postLang = post.lang === 'en' ? 'en' : 'zh-CN';
    return postLang === normalized;
  }).sort((left, right) => right.date.valueOf() - left.date.valueOf());
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

  const lang = page.lang === 'en' ? 'en' : 'zh-CN';
  const posts = hexo.locals.get('posts').toArray()
    .filter(post => (post.lang === 'en' ? 'en' : 'zh-CN') === lang)
    .sort((left, right) => right.date.valueOf() - left.date.valueOf());

  const index = posts.findIndex(post => post.path === page.path);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null
  };
});
