'use strict';

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

function normalizeTaxonomyPath(pathname) {
  return String(pathname || '').replace(/^\/+/, '');
}

function createLocalizedRoutes(collection, layoutName, prefix) {
  return toArray(collection).map(item => {
    const basePath = normalizeTaxonomyPath(item.path);
    const localizedPath = `en/${basePath}`;

    return {
      path: localizedPath,
      data: {
        title: item.name,
        lang: 'en',
        posts: item.posts,
        path: localizedPath,
        [prefix]: item
      },
      layout: [layoutName, 'archive', 'index']
    };
  });
}

hexo.extend.generator.register('localized_taxonomies', function localizedTaxonomies(locals) {
  return [
    ...createLocalizedRoutes(locals.categories, 'category', 'category'),
    ...createLocalizedRoutes(locals.tags, 'tag', 'tag')
  ];
});
