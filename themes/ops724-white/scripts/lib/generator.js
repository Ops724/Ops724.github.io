'use strict';

const pagination = require('hexo-pagination');
const { toArray } = require('./content');

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

function createPaginatedRoutes({
  collection,
  filterPosts,
  basePath,
  layout,
  perPage,
  paginationDir,
  data
}) {
  const posts = filterPosts(collection);

  if (!posts.length) {
    return createEmptyPage(basePath, layout, data);
  }

  return pagination(basePath, posts, {
    perPage,
    layout,
    format: `${paginationDir}/%d/`,
    data
  });
}

function createRoutesFromCollection(collection, routeFactory) {
  return toArray(collection).flatMap(routeFactory);
}

module.exports = {
  createEmptyPage,
  createPaginatedRoutes,
  createRoutesFromCollection
};
