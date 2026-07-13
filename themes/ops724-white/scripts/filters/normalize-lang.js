'use strict';

hexo.extend.filter.register('before_post_render', function normalizePostLang(data) {
  if (!data.lang) {
    data.lang = 'zh-CN';
  } else if (data.lang === 'zh') {
    data.lang = 'zh-CN';
  }

  if (!data.section) {
    data.section = 'tech';
  } else if (data.section !== 'life') {
    data.section = 'tech';
  }

  return data;
});
