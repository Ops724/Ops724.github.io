'use strict';

const { filterPosts, normalizeLang, normalizeSection } = require('../lib/content');
const { createPaginatedRoutes } = require('../lib/generator');

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

  return createPaginatedRoutes({
    collection: locals.posts,
    filterPosts: posts => filterPosts(posts, lang, section),
    basePath,
    layout,
    perPage,
    paginationDir,
    data: sharedData
  });
}

hexo.extend.generator.register('index', function channelPaginationIndex(locals) {
  const config = this.config;

  return [
    ...createChannelPagination(locals, config, 'zh-CN', 'tech', ['index', 'list']),
    ...createChannelPagination(locals, config, 'en', 'tech', ['index', 'list']),
    ...createChannelPagination(locals, config, 'zh-CN', 'life', ['section', 'list']),
    ...createChannelPagination(locals, config, 'en', 'life', ['section', 'list'])
  ];
});
