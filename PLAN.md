# Hexo 博客实现蓝图

这份文档保留为项目的设计蓝图与实现基线说明。

它主要回答“这个博客为什么这样设计、当前结构大体如何组织”，不承担日常使用说明职责。日常操作请优先参考 `README.md`、`DEPLOY.md` 与 `PRIVATE_CONTENT.md`。

## 目标

构建一个基于 Hexo 的双语个人博客，满足以下核心特征：

- 纯白背景
- 居中排版，并保留充足留白
- 方形头像，不做圆角
- 支持中英文双语
- 包含首页、关于、分类、标签页面
- 同时支持生活类写作和技术类写作
- 文章内具备良好的代码渲染与图片展示能力

## 产品方向

这个博客应该呈现出安静、极简、以作者为中心的气质。它不是一个门户型站点，而是一个长期写作与整理内容的个人空间。

关键词：

- 简洁
- 克制
- 个人化
- 轻量

## 信息架构

顶部导航：

- Home
- About
- Categories
- Tags
- 语言切换：`中 / EN`

建议路由：

- `/` 中文技术首页
- `/life/` 中文生活频道
- `/about/` 中文关于
- `/categories/` 中文分类
- `/tags/` 中文标签
- `/posts/:slug/` 中文文章
- `/en/` 英文技术首页
- `/en/life/` 英文生活频道
- `/en/about/` 英文关于
- `/en/categories/` 英文分类
- `/en/tags/` 英文标签
- `/en/posts/:slug/` 英文文章

## 内容模型

博客需要支持两层语言：

1. 界面语言
2. 内容语言

界面语言包括：

- 导航文字
- 分页文字
- 页面标题
- 空状态提示

内容语言包括：

- About 页面
- 文章
- 分类页与标签页内容

文章方向：

- Life
- Tech

这两类内容共用同一套文章模板，但通过 `section: life | tech` 作为一级频道区分；分类和标签负责补充归档与检索。

## 推荐目录结构

```text
ops724blog/
├── README.md
├── DEPLOY.md
├── _config.yml
├── _config.private-template.yml
├── package.json
├── PLAN.md
├── PRIVATE_CONTENT.md
├── scaffolds/
│   ├── post.md
│   └── page.md
├── source-local.example/
│   ├── _data/
│   │   └── profile.yml
│   ├── _posts/
│   │   ├── zh/
│   │   └── en/
│   ├── about/
│   │   └── index.md
│   ├── en/
│   │   └── about/index.md
│   └── images/
├── source/
│   ├── _data/
│   │   ├── navigation.yml
│   │   ├── profile.yml
│   │   └── social.yml
│   ├── _posts/
│   │   ├── zh/
│   │   └── en/
│   ├── about/
│   │   └── index.md
│   ├── categories/
│   │   └── index.md
│   ├── tags/
│   │   └── index.md
│   ├── en/
│   │   ├── index.md
│   │   ├── about/index.md
│   │   ├── categories/index.md
│   │   └── tags/index.md
│   └── images/
│       ├── avatar-placeholder.svg
│       └── avatar-square.svg
├── themes/
    └── ops724-white/
        ├── _config.yml
        ├── languages/
        │   ├── zh-CN.yml
        │   └── en.yml
        ├── layout/
        │   ├── layout.ejs
        │   ├── index.ejs
        │   ├── post.ejs
        │   ├── page.ejs
        │   ├── archive.ejs
        │   ├── category.ejs
        │   ├── tag.ejs
        │   └── partials/
        │       ├── head.ejs
        │       ├── header.ejs
        │       ├── footer.ejs
        │       ├── language-switcher.ejs
        │       ├── profile-card.ejs
        │       ├── post-list.ejs
        │       ├── post-meta.ejs
        │       └── pagination.ejs
        ├── scripts/
        │   ├── helpers/
        │   │   ├── localized-url.js
        │   │   └── nav-label.js
        │   └── filters/
        │       └── normalize-lang.js
        └── source/
            ├── css/
            │   ├── tokens.css
            │   ├── base.css
            │   ├── layout.css
            │   ├── components.css
            │   └── content.css
└── tools/
    └── private-build.mjs
```

补充说明：

- `source/` 中保留的是公开框架示例内容
- `source-local/` 与 `_config.local.yml` 是本地私有层，不进入版本库
- `source-local.example/` 只提供私有内容模板
- `tools/private-build.mjs` 负责把公开框架与本地私有内容合并后再构建或发布

## 双语策略

### 站点配置

建议的全局设置：

- `language: [zh-CN, en]`
- 默认语言为中文
- 英文内容放在 `/en/`

### 主题 i18n

界面文案统一放在主题的 `languages/` 目录中，仅用于界面级文本。

例如：

- 导航名称
- `Read more`
- `Previous`
- `Next`
- `Categories`
- `Tags`

### 静态页面内容

中英文页面分别维护独立文件：

- `source/about/index.md`
- `source/en/about/index.md`
- `source/categories/index.md`
- `source/en/categories/index.md`
- `source/tags/index.md`
- `source/en/tags/index.md`

### 文章内容

文章按语言目录拆分：

- `source/_posts/zh/`
- `source/_posts/en/`

中文文章建议 front-matter：

```yaml
title: 示例标题
date: 2026-07-09
lang: zh-CN
permalink: /posts/example/
translation_key: example
section: tech
categories:
  - Tech
tags:
  - Hexo
  - Blog
```

英文文章建议 front-matter：

```yaml
title: Example Title
date: 2026-07-09
lang: en
permalink: /en/posts/example/
translation_key: example
section: tech
categories:
  - Tech
tags:
  - Hexo
  - Blog
```

### 中英文配对

使用 `translation_key` 来绑定中文与英文版本的同一篇文章。

相比按文件名猜测，这种方式更适合长期维护，因为它：

- 更明确
- 更容易维护
- 标题或 slug 变化时更安全

## 主题模块拆分

### 核心布局

- `layout.ejs`：全局 HTML 骨架
- `index.ejs`：首页
- `post.ejs`：文章页
- `page.ejs`：普通页面
- `archive.ejs`：归档或列表页
- `category.ejs`：分类页
- `tag.ejs`：标签页

### 局部组件

- `head.ejs`：页面元信息、标题、样式引入
- `header.ejs`：站点导航、头像、站点标题与语言切换
- `footer.ejs`：页脚
- `language-switcher.ejs`：中英文切换
- `profile-card.ejs`：预留的作者信息组件草稿，当前主布局未启用
- `post-list.ejs`：文章列表
- `post-meta.ejs`：日期、分类、标签
- `pagination.ejs`：上一篇/下一篇

### 脚本

Helpers：

- `localized-url.js`：生成语言感知路由
- `nav-label.js`：提供按语言过滤文章与摘要生成逻辑

Filters：

- `normalize-lang.js`：统一 `lang` 字段格式，减少录入误差

## 设计规则

### 全局视觉

- 背景保持纯白
- 桌面端内容始终居中
- 左右保留清晰留白
- 不使用侧边栏主布局
- 整体气质应安静、克制、可长期使用

### 头像规则

- 方形
- 不做圆角
- 不加厚重阴影
- 在首页与关于页中作为作者识别核心

### 字体方向

中英文需要同时具备良好可读性。最终字体可以在实现中继续微调，但整体应偏阅读体验，而不是产品化网页风格。

### 文章内容规则

- 图片默认居中
- 图片应撑满正文宽度
- 图片说明文字居中
- 代码块必须优先保障可读性
- 长代码行允许横向滚动
- 标题、段落、图片、引用、代码块之间保持足够呼吸感

### 代码展示规则

因为博客包含技术内容，代码展示属于一级重点。

要求：

- 支持语法高亮
- 行高舒适
- 字号略小于正文
- 浅灰背景
- 合理内边距
- 支持横向滚动

## 页面预期

### 首页

应包含：

- 方形头像
- 站点标题
- 简短介绍
- 最新技术文章列表

### 生活频道页

应包含：

- 频道标题
- 简短说明
- 当前语言下的生活文章列表

应避免：

- 密集卡片
- 各类侧边栏小组件
- 大型横幅式 hero 区

### 关于页

应该更像作者介绍，而不是简历堆砌。

建议内容：

- 个人简介
- 兴趣
- 写作方向
- 联系方式

### 分类页

应简洁、结构清晰。

建议的初始分类：

- 虚拟化
- 网络
- 工具
- 随记
- 日常

### 标签页

应轻量、可读。

第一版不建议做拥挤的标签云。

### 文章页

优先保障阅读体验。

应包含：

- 标题
- 日期
- 分类
- 标签
- 可切换到对应译文的链接（如果存在）
- 上一篇/下一篇导航

## 数据文件规划

### `source/_data/profile.yml`

存放：

- 站点标题
- 副标题
- 头像路径
- 所在地
- 邮箱或联系方式

当前已实际用于：

- 站点标题
- 副标题
- 头像路径

其中 `location` 与 `email` 目前仍属于预留字段。

### `source/_data/navigation.yml`

存放：

- 主导航项
- 主题用到的标签键
- 页面路径

### `source/_data/social.yml`

存放：

- GitHub
- 邮箱
- 其他可选社交链接

当前版本中该文件已保留，但主题尚未消费这部分数据。

## Scaffold 规划

### `scaffolds/post.md`

默认字段：

- `title`
- `date`
- `lang`
- `permalink`
- `translation_key`
- `categories`
- `tags`

### `scaffolds/page.md`

默认字段：

- `title`
- `date`
- `lang`
- `permalink`

## 已定实现决策

以下决定可作为 V1 基线：

- 使用自定义轻主题，而不是重量级第三方主题
- 中英文内容物理拆分
- 用 `translation_key` 绑定译文
- 文章图片默认居中且撑满正文宽度
- 文章页同时兼顾生活写作与技术写作
- V1 不引入侧边栏
- 导航保持少量且稳定
- 公开仓库存放框架与示例内容，真实个人内容保留在本地私有层
- `main` 保存源码与文档，`gh-pages` 只保存生成后的静态站点

## 实施状态

以下阶段已基本完成，可视为当前项目的落地记录。

### 阶段 1：项目初始化

- 已完成 Hexo 项目初始化
- 已完成基础依赖安装
- 已完成自定义主题骨架
- 已完成双语基础配置

### 阶段 2：主题基础

- 已建立整体布局骨架
- 已加入页头和页脚
- 已将头像、站点标题和导航整合进页头
- 已完成主题级 i18n
- 已建立基础留白和排版系统

### 阶段 3：核心页面

- 已实现首页
- 已实现 About 页
- 已实现分类页
- 已实现标签页
- 已实现文章页

### 阶段 4：内容体验

- 已接入语法高亮
- 已优化代码块样式
- 已实现文章图片默认居中且全宽
- 已完善基础 Markdown 内容样式
- 已增加前后文章导航

### 阶段 5：双语逻辑

- 已增加语言切换
- 已使用 `translation_key` 配对文章
- 已保证每种语言只展示对应内容
- 已验证主要路由一致性

### 阶段 6：初始化内容

- 已增加中英文 About 示例页
- 已增加中英文示例文章
- 已增加头像资源和基础 profile 数据
- 已明确区分“公开示例内容”与“本地私有真实内容”

### 阶段 7：发布与私有内容层

- 已建立 `main -> gh-pages` 发布链路
- 已增加 `deploy:private`、`server:private`、`build:private`
- 已建立 `source-local/` 与 `_config.local.yml` 的本地私有工作流
- 已补齐 README、发布说明和私有内容说明文档

## 验收清单

- 所有页面背景保持纯白
- 头像为方形且无圆角
- 首页、关于、分类、标签页面中英文都存在
- 技术与生活频道页面中英文都存在
- 中英文路由稳定可预期
- 文章支持语法高亮代码块
- 图片在文章中默认撑满正文宽度
- 技术首页只展示当前语言下的技术文章
- 生活频道页只展示当前语言下的生活文章
- 语言切换对静态页面和成对文章都可用
- 主题结构清晰、便于后续扩展

## 后续可能演进

如果后续继续迭代，这份项目更适合考虑这些方向：

1. 将 `social.yml` 真正接入主题展示
2. 补充更贴近真实写作习惯的文章 scaffold
3. 为中英文配对文章增加更明确的译文入口提示
4. 按你的真实内容继续细化分类与标签策略
