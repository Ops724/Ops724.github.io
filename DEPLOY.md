# 本地发布说明

本项目采用一种简单的本地发布方式：

- `main` 分支：存放源码、主题、内容与配置
- `gh-pages` 分支：存放生成后的静态站点

当前不引入 CI。

## 当前配置

项目已经接入 Hexo 的 Git 发布器。

相关文件：

- [package.json](/Users/chen/code/ops724blog/package.json)
- [_config.yml](/Users/chen/code/ops724blog/_config.yml)

发布命令为：

```bash
npm run deploy
```

它实际执行的是：

```bash
hexo clean && hexo generate && hexo deploy
```

## 首次使用前的一次性配置

在第一次发布前，请确认 [_config.yml](/Users/chen/code/ops724blog/_config.yml) 中的关键值正确。

### 1. 站点地址

本项目当前配置的是用户主页仓库模式：

```yml
url: https://Ops724.github.io
root: /
```

由于这是用户主页模式，仓库名应为：

```text
Ops724.github.io
```

### 2. 发布仓库地址

在 [_config.yml](/Users/chen/code/ops724blog/_config.yml) 中，发布配置应为：

```yml
deploy:
  type: git
  repo: git@github.com:Ops724/Ops724.github.io.git
  branch: gh-pages
```

如果你更习惯 HTTPS，也可以写成：

```yml
repo: https://github.com/Ops724/Ops724.github.io.git
```

但从长期使用来看，SSH 会更省心。

### 3. 远程仓库必须已存在

如果远程仓库还不存在，请先在 GitHub 上创建 `Ops724.github.io`。

`gh-pages` 分支不需要提前创建，Hexo 首次发布时可以自动生成。

## 日常工作流

### 在 `main` 上开发

所有代码与内容改动都放在 `main` 分支。

常用命令：

```bash
npm run server
```

或者：

```bash
npm run build
```

如果你正在使用本地私有内容层，请优先阅读 [PRIVATE_CONTENT.md](/Users/chen/code/ops724blog/PRIVATE_CONTENT.md)。

这时：

- 公开框架依旧在 `main` 中维护
- 你的真实个人内容写在本地的 `source-local/`
- 你的私有配置写在 `_config.local.yml`

### 发布到 `gh-pages`

准备发布时执行：

```bash
npm run deploy
```

这条命令会做三件事：

1. 清理旧的生成文件
2. 重新构建站点
3. 将生成结果推送到 `gh-pages`

如果你要发布的是“本地私有内容 + 公开框架”的组合版本，请使用：

```bash
npm run deploy:private
```

而不是普通的：

```bash
npm run deploy
```

## 推荐分支模型

- `main`：全部源码
- `gh-pages`：仅生成后的静态站点

不要手动编辑 `gh-pages` 分支内容。

应将它视为纯输出分支。

## 重要说明

### `public/` 应继续忽略

当前 [.gitignore](/Users/chen/code/ops724blog/.gitignore) 已经忽略了生成产物目录，这符合当前发布方式。

### `db.json` 是生成缓存

它属于本地缓存文件，不应作为源码管理。

### 当前项目使用的是用户主页模式

因此：

```yml
root: /
```

如果以后改成项目仓库模式，才需要把 `root` 调整为 `/<仓库名>/`。

## 首次发布检查清单

1. 将源码推送到 `main`
2. 确认 GitHub 仓库名为 `Ops724.github.io`
3. 执行 `npm run deploy`
4. 在 GitHub Pages 设置中，选择 `gh-pages` 分支作为发布来源

## 后续日常使用

完成初始配置后，后续发布基本只需要：

```bash
npm run deploy
```

如果你采用本地私有内容层作为主要写作方式，则更常用的是：

```bash
npm run server:private
```

和：

```bash
npm run deploy:private
```
