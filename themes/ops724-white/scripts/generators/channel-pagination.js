'use strict';

const pagination = require('hexo-pagination');

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function normalizeSection(value) {
  return value === 'life' ? 'life' : 'tech';
}

function toPostArray(collection) {
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
  const normalizedSection = normalizeSection(section);

  return sortPosts(
    toPostArray(collection)
      .filter(post => normalizeLang(post.lang) === normalizedLang)
      .filter(post => normalizeSection(post.section) === normalizedSection)
  );
}

function buildIntro(lang, section) {
  if (section !== 'life') return '';

  if (lang === 'en') {
    return '<p>This space holds everyday notes, slower observations, and writing that does not need to solve a problem.</p>';
  }

  return '<p>这里收纳生活记录、日常观察和一些不急着给出答案的片段。</p>';
}

function buildTitle(lang, section) {
  if (section !== 'life') return undefined;
  return lang === 'en' ? 'Life' : '生活';
}

function buildBasePath(config, lang, section) {
  const techPath = config.index_generator.path || '';

  if (section === 'life') {
    return lang === 'en' ? 'en/life' : 'life';
  }

  if (lang === 'en') {
    return techPath ? `en/${String(techPath).replace(/^\/+|\/+$/g, '')}` : 'en';
  }

  return techPath;
}

function createChannelPagination(locals, config, lang, section, layout) {
  const posts = filterPosts(locals.posts, lang, section);
  const paginationDir = config.index_generator.pagination_dir || config.pagination_dir || 'page';
  const perPage = config.index_generator.per_page;
  const basePath = buildBasePath(config, lang, section);
  const sharedData = {
    __channel_pagination: true,
    lang: normalizeLang(lang),
    section: normalizeSection(section),
    title: buildTitle(lang, section),
    content: buildIntro(lang, section)
  };

  if (!posts.length) {
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
        ...sharedData
      }
    }];
  }

  return pagination(basePath, posts, {
    perPage,
    layout,
    format: `${paginationDir}/%d/`,
    data: sharedData
  });
}

hexo.extend.generator.register('index', function channelPaginationIndex(locals) {
  const config = this.config;

  return [
    ...createChannelPagination(locals, config, 'zh-CN', 'tech', ['index', 'archive']),
    ...createChannelPagination(locals, config, 'en', 'tech', ['index', 'archive']),
    ...createChannelPagination(locals, config, 'zh-CN', 'life', ['section', 'archive']),
    ...createChannelPagination(locals, config, 'en', 'life', ['section', 'archive'])
  ];
});
