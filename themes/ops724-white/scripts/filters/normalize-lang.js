'use strict';

const { normalizeLang, normalizeSection } = require('../lib/content');

hexo.extend.filter.register('before_post_render', function normalizePostLang(data) {
  data.lang = normalizeLang(data.lang === 'zh' ? 'zh-CN' : data.lang);
  data.section = normalizeSection(data.section);

  return data;
});
