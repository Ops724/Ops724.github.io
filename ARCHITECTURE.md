# 项目架构说明

这份文档只回答一件事：当前项目是怎么组织起来的。

如果你要日常使用它：

- 操作流程看 `README.md`
- 发布流程看 `DEPLOY.md`
- 私有内容工作流看 `PRIVATE_CONTENT.md`

## 总体结构

项目采用“公开基座 + 本地私有内容层 + 发布分支”的三层结构：

- `main`：保存博客框架、主题、自定义脚本、公开示例内容和项目文档
- `source-local/`：保存你的真实个人内容，仅存在本地，不进入版本库
- `gh-pages`：保存最终生成的静态站点，用于 GitHub Pages 发布

也就是说：

- 框架迭代在 `main`
- 真实文章和个人信息平时写在 `source-local/`
- 发布时把 `source/` 与 `source-local/` 合并，再生成站点并推送到 `gh-pages`

## 目录职责

### 公开层

- `source/`：公开示例内容
- `source/_data/`：公开站点资料，如导航、头像配置
- `source/_posts/`：公开示例文章

### 私有层

- `source-local/`：你的真实内容
- `source-local/_data/profile.yml`：私有站点资料
- `source-local/_posts/zh/`：中文文章
- `source-local/_posts/en/`：英文文章
- `_config.local.yml`：本地配置覆盖

### 主题层

- `themes/ops724-white/layout/`：页面模板
- `themes/ops724-white/source/css/`：主题样式
- `themes/ops724-white/languages/`：界面文案中英翻译
- `themes/ops724-white/scripts/`：Hexo 自定义脚本

### 工具层

- `tools/private-build.mjs`：私有构建、预览、发布入口

## 路由结构

当前项目的核心路由分成四类。

### 频道页

- `/`：中文技术频道
- `/en/`：英文技术频道
- `/life/`：中文生活频道
- `/en/life/`：英文生活频道

### 静态页

- `/about/`
- `/en/about/`
- `/categories/`
- `/en/categories/`
- `/tags/`
- `/en/tags/`
- `/archives/`
- `/en/archives/`

### 文章页

- `/posts/:slug/`
- `/en/posts/:slug/`

### 分类与标签详情页

- `/categories/:name/`
- `/en/categories/:name/`
- `/tags/:name/`
- `/en/tags/:name/`

以上列表页和详情页都支持当前项目自己的本地化分页逻辑。

## 内容模型

每篇文章当前依赖这些关键字段：

- `lang`：`zh-CN` 或 `en`
- `section`：`tech` 或 `life`
- `translation_key`：中英文章互相对应时使用
- `categories`
- `tags`

其中：

- `lang` 决定内容归属到中文还是英文
- `section` 决定它进入技术频道还是生活频道
- `translation_key` 决定文章页语言切换能否正确跳转到另一语言版本

## 主题脚本分层

当前主题脚本已经按职责分成 4 层。

### 1. filters

- `scripts/filters/normalize-lang.js`

作用：

- 在文章渲染前规范 `lang`
- 为缺省文章补默认 `section`

### 2. generators

- `scripts/generators/channel-pagination.js`
- `scripts/generators/localized-taxonomies.js`
- `scripts/generators/localized-archives.js`

作用：

- 生成频道分页
- 生成分类/标签详情页及其分页
- 生成双语归档页

### 3. helpers

- `scripts/helpers/content-queries.js`
- `scripts/helpers/post-view.js`
- `scripts/helpers/localized-url.js`
- `scripts/helpers/archive-groups.js`

作用：

- 给模板提供文章筛选、摘要、上一篇/下一篇、语言切换、归档分组等能力

### 4. lib

- `scripts/lib/content.js`
- `scripts/lib/path.js`
- `scripts/lib/generator.js`

作用：

- 放共享基础逻辑，避免 generator/helper 各自复制一套实现

## 模板层约定

当前模板命名里有两个容易混淆但已经分开的概念：

- `layout/list.ejs`：通用文章列表页
- `layout/archives.ejs`：时间归档页

也就是说：

- 分类详情
- 标签详情
- 技术频道
- 生活频道

都复用 `list.ejs`

而真正按年月分组展示的归档页使用 `archives.ejs`。

## 私有构建链路

执行：

```bash
npm run build:private
```

或：

```bash
npm run server:private
npm run deploy:private
```

时，项目会走这条链路：

1. 创建临时工作区 `var/private-build/`
2. 复制项目骨架
3. 复制公开 `source/`
4. 用 `source-local/` 覆盖合并到工作区 `source/`
5. 如存在可用的 `_config.local.yml`，再叠加本地配置
6. 在工作区中执行 Hexo 的 `clean / generate / server / deploy`

这保证了：

- 真实内容不会进入 `main`
- 但发布结果可以完整包含真实内容

## 当前维护原则

后续继续迭代时，优先遵守这几条：

- 不把真实个人内容直接写进 `source/`
- 不手动修改 `gh-pages`
- 主题功能优先通过 `themes/ops724-white/scripts/` 扩展
- 新增逻辑优先复用 `scripts/lib/`
- 页面效果调整尽量放在主题内完成，不污染私有内容层
