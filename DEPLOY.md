# 发布说明

当前项目采用这套简单分支模型：

- `main`：博客框架、主题、公开示例内容、文档
- `gh-pages`：Hexo 生成后的静态站点

你现在的推荐工作方式是：

- 框架迭代提交到 `main`
- 真实个人内容只保存在本地 `source-local/` 和 `_config.local.yml`
- 真正上线时，把“公开框架 + 本地私有内容”一起发布到 `gh-pages`

## 先看结论

如果你平时主要在写自己的博客内容，而不是改框架，那么最常用的其实只有两个命令：

```bash
npm run server:private
npm run deploy:private
```

普通的：

```bash
npm run deploy
```

只适合发布公开仓库里那套示例内容。

## 当前项目配置

相关文件：

- [package.json](./package.json)
- [_config.yml](./_config.yml)
- [PRIVATE_CONTENT.md](./PRIVATE_CONTENT.md)

当前站点按 GitHub 用户主页仓库模式配置：

```yml
url: https://Ops724.github.io
root: /
```

因此远程仓库名应为：

```text
Ops724.github.io
```

发布目标配置为：

```yml
deploy:
  type: git
  repo: git@github.com:Ops724/Ops724.github.io.git
  branch: gh-pages
```

## 命令区别

### 1. 公开框架预览

```bash
npm run server
```

只预览仓库里的公开示例内容。

### 2. 私有内容预览

```bash
npm run server:private
```

会把 `source-local/` 和 `_config.local.yml` 一起合并进去，更接近你的真实线上站点。

### 3. 公开框架发布

```bash
npm run deploy
```

会把公开仓库里的示例内容发布到 `gh-pages`。

### 4. 私有内容发布

```bash
npm run deploy:private
```

这是你当前更应该使用的发布命令。  
它会在临时工作区中合并：

- `source/`
- `source-local/`
- `_config.local.yml`

然后再生成并推送到 `gh-pages`。

## 首次发布前确认

1. 远程仓库名是 `Ops724.github.io`
2. `main` 已正常推送到 GitHub
3. `_config.yml` 中的 `deploy.repo` 指向正确远程
4. 如果要发布真实个人内容，先准备好本地的 `source-local/` 和 `_config.local.yml`

## GitHub Pages 设置

在仓库的 Pages 设置里，将发布来源指向：

- Branch: `gh-pages`
- Folder: `/ (root)`

`gh-pages` 分支通常不需要手动创建，首次执行发布命令时会自动生成。

## 日常最小流程

### 只改框架

```bash
npm run server
git add .
git commit -m "..."
git push
```

### 写自己的真实内容

```bash
npm run server:private
```

满意后发布：

```bash
npm run deploy:private
```

## 说明

- 不要手动编辑 `gh-pages`
- `public/`、`db.json`、`source-local/`、`_config.local.yml` 都不应该进入 `main`
- 如果以后从“用户主页仓库”切换到“项目仓库”，才需要把 `root` 改成 `/<仓库名>/`
