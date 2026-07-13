'use strict';

const pagination = require('hexo-pagination');

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

function normalizeTaxonomyPath(pathname) {
  return String(pathname || '').replace(/^\/+|\/+$/g, '');
}

function filterPostsByLang(collection, lang) {
  const normalizedLang = normalizeLang(lang);

  return toArray(collection)
    .filter(post => normalizeLang(post.lang) === normalizedLang)
    .sort((left, right) => right.date.valueOf() - left.date.valueOf());
}

function createEmptyPage(basePath, layout, data) {
  const base = basePath ? `${basePath}/` : '';

  return [{
    path: base,
    layout,
    data: {
      base,
      total: 1,
      current: 1,
      current_url: base,
      posts: [],
      prev: 0,
      prev_link: '',
      next: 0,
      next_link: '',
      ...data
    }
  }];
}

function createPaginatedRoutes(collection, layoutName, dataKey, lang, config, pathResolver) {
  const generatorConfig = config[`${dataKey}_generator`] || {};
  const perPage = generatorConfig.per_page || config.per_page || 10;
  const paginationDir = config.pagination_dir || 'page';

  return toArray(collection).flatMap(item => {
    const posts = filterPostsByLang(item.posts, lang);
    const basePath = pathResolver(item, lang);
    const layout = [layoutName, 'archive', 'index'];
    const data = {
      title: item.name,
      lang,
      [dataKey]: item
    };

    if (!posts.length) {
      return createEmptyPage(basePath, layout, data);
    }

    return pagination(basePath, posts, {
      perPage,
      layout,
      format: `${paginationDir}/%d/`,
      data
    });
  });
}

function categoryPathResolver(category, lang) {
  const basePath = normalizeTaxonomyPath(category.path);
  return lang === 'en' ? `en/${basePath}` : basePath;
}

function tagPathResolver(tag, lang) {
  const basePath = normalizeTaxonomyPath(tag.path);
  return lang === 'en' ? `en/${basePath}` : basePath;
}

hexo.extend.generator.register('category', function localizedCategories(locals) {
  const config = this.config;

  return [
    ...createPaginatedRoutes(locals.categories, 'category', 'category', 'zh-CN', config, categoryPathResolver),
    ...createPaginatedRoutes(locals.categories, 'category', 'category', 'en', config, categoryPathResolver)
  ];
});

hexo.extend.generator.register('tag', function localizedTags(locals) {
  const config = this.config;

  return [
    ...createPaginatedRoutes(locals.tags, 'tag', 'tag', 'zh-CN', config, tagPathResolver),
    ...createPaginatedRoutes(locals.tags, 'tag', 'tag', 'en', config, tagPathResolver)
  ];
});
