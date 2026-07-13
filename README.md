# OPS724 Blog

一个基于 Hexo 的双语静态博客项目。

当前这套仓库结构面向“公开框架 + 本地私有内容”工作流：

- `main`：保存博客框架、主题、公开示例内容和项目文档
- `gh-pages`：保存生成后的静态站点，用于 GitHub Pages 发布
- `source-local/`：本地私有内容目录，不进入版本库
- `_config.local.yml`：本地私有配置，不进入版本库

## 当前特性

- 极简白底主题
- 中英双语结构
- 技术、生活、关于、分类、标签导航
- 适合生活分享与技术文章
- 支持代码高亮
- 文章图片默认居中并占满正文宽度

## 快速开始

安装依赖：

```bash
npm install
```

预览公开框架内容：

```bash
npm run server
```

构建公开框架内容：

```bash
npm run build
```

## 私有内容工作流

如果你希望真实个人内容不提交到 `main`，请使用本地私有内容层。

初始化一次本地私有文件：

```bash
cp _config.private-template.yml _config.local.yml
cp -R source-local.example source-local
```

预览你的真实站点内容：

```bash
npm run server:private
```

写文章时建议在 front-matter 中显式指定一级频道：

```yml
section: tech
```

或：

```yml
section: life
```

发布你的真实站点内容：

```bash
npm run deploy:private
```

## 发布说明

当前项目按 GitHub 用户主页仓库模式配置：

- 仓库名：`Ops724.github.io`
- 线上地址：`https://Ops724.github.io`
- 发布分支：`gh-pages`

如果你只是发布公开示例内容，可以使用：

```bash
npm run deploy
```

如果你要发布本地私有内容，请使用：

```bash
npm run deploy:private
```

## 目录说明

- `source/`：公开示例内容
- `source-local.example/`：本地私有内容模板
- `themes/ops724-white/`：当前自定义主题
- `tools/private-build.mjs`：私有内容构建与发布脚本

## 文档入口

- [DEPLOY.md](./DEPLOY.md)：发布流程说明
- [PRIVATE_CONTENT.md](./PRIVATE_CONTENT.md)：本地私有内容工作流
- [PLAN.md](./PLAN.md)：项目实现蓝图
