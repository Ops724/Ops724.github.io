'use strict';

const { filterPosts } = require('../lib/content');
const { createPaginatedRoutes, createRoutesFromCollection } = require('../lib/generator');
const { normalizeTaxonomyPath } = require('../lib/path');

function createLocalizedTaxonomyRoutes(collection, layoutName, dataKey, lang, config, pathResolver) {
  const generatorConfig = config[`${dataKey}_generator`] || {};
  const perPage = generatorConfig.per_page || config.per_page || 10;
  const paginationDir = config.pagination_dir || 'page';

  return createRoutesFromCollection(collection, item => {
    const basePath = pathResolver(item, lang);
    const layout = [layoutName, 'archive', 'index'];
    const data = {
      title: item.name,
      lang,
      [dataKey]: item
    };

    return createPaginatedRoutes({
      collection: item.posts,
      filterPosts: posts => filterPosts(posts, lang),
      basePath,
      layout,
      perPage,
      paginationDir,
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
    ...createLocalizedTaxonomyRoutes(locals.categories, 'category', 'category', 'zh-CN', config, categoryPathResolver),
    ...createLocalizedTaxonomyRoutes(locals.categories, 'category', 'category', 'en', config, categoryPathResolver)
  ];
});

hexo.extend.generator.register('tag', function localizedTags(locals) {
  const config = this.config;

  return [
    ...createLocalizedTaxonomyRoutes(locals.tags, 'tag', 'tag', 'zh-CN', config, tagPathResolver),
    ...createLocalizedTaxonomyRoutes(locals.tags, 'tag', 'tag', 'en', config, tagPathResolver)
  ];
});
