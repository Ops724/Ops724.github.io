'use strict';

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

hexo.extend.helper.register('archive_groups', function archiveGroups(collection) {
  const posts = toArray(collection);
  const groups = [];
  const index = new Map();

  posts.forEach(post => {
    const year = this.date(post.date, 'YYYY');
    const month = this.date(post.date, 'MM');
    const key = `${year}-${month}`;

    if (!index.has(key)) {
      const group = { key, year, month, posts: [] };
      index.set(key, group);
      groups.push(group);
    }

    index.get(key).posts.push(post);
  });

  return groups;
});
