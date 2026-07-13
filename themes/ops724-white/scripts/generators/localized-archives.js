'use strict';

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh-CN';
}

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return [];
}

function filterPostsByLang(collection, lang) {
  const normalizedLang = normalizeLang(lang);

  return toArray(collection)
    .filter(post => normalizeLang(post.lang) === normalizedLang)
    .sort((left, right) => right.date.valueOf() - left.date.valueOf());
}

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

  return ['zh-CN', 'en'].map(lang => ({
    path: `${buildArchivePath(config, lang)}/`,
    layout: ['archives', 'page', 'archive', 'index'],
    data: {
      title: buildArchiveTitle(lang),
      content: buildArchiveIntro(lang),
      lang,
      posts: filterPostsByLang(locals.posts, lang)
    }
  }));
});
