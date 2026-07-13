'use strict';

const { filterPosts } = require('../lib/content');
const { createRoutesFromCollection } = require('../lib/generator');

function buildArchivePath(config, lang) {
  const archiveDir = String(config.archive_dir || 'archives').replace(/^\/+|\/+$/g, '');

  return lang === 'en' ? `en/${archiveDir}` : archiveDir;
}

function buildArchiveTitle(lang) {
  return lang === 'en' ? 'Archives' : '归档';
}

function buildArchiveIntro(lang) {
  if (lang === 'en') {
    return '<p>A time-ordered index for both technical notes and life writing.</p>';
  }

  return '<p>按时间整理技术分享与生活记录，方便集中回看。</p>';
}

hexo.extend.generator.register('archive', function localizedArchives(locals) {
  const config = this.config;

  return createRoutesFromCollection(['zh-CN', 'en'], lang => ({
    path: `${buildArchivePath(config, lang)}/`,
    layout: ['archives', 'page', 'list', 'index'],
    data: {
      title: buildArchiveTitle(lang),
      content: buildArchiveIntro(lang),
      lang,
      posts: filterPosts(locals.posts, lang)
    }
  }));
});
