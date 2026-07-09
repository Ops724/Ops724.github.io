# 本地私有内容工作流

这个项目现在采用“公开基座 + 本地私有内容层”的方式。

目标是：

- `main` 分支只保存博客框架、主题、脚本和公开文档
- 你的真实文章、About 内容、头像与个性化配置只保存在本地
- 发布时把本地私有内容合并进去，再生成并推送到 `gh-pages`

如果你已经决定把个人内容留在本地，那么你之后最常用的命令通常就是：

```bash
npm run server:private
npm run deploy:private
```

## 核心规则

会被 Git 忽略：

- `_config.local.yml`
- `source-local/`
- `var/`

因此这些内容不会进入 `main` 分支。

## 你需要使用的目录

### 1. 本地私有配置

复制：

```bash
cp _config.private-template.yml _config.local.yml
```

然后在 `_config.local.yml` 里写你自己的配置覆盖项。

例如：

```yml
title: OPS724 Blog
description: 我的个人博客
author: Ops724
```

### 2. 本地私有内容目录

复制模板目录：

```bash
cp -R source-local.example source-local
```

以后你真正的个人内容都写在：

- `source-local/_posts/`
- `source-local/about/`
- `source-local/en/about/`
- `source-local/_data/profile.yml`
- `source-local/images/`

## 构建命令

### 公开基座构建

只构建项目本身的公开框架：

```bash
npm run build
```

### 本地私有构建

将 `source/` 和 `source-local/` 合并后再构建：

```bash
npm run build:private
```

### 本地私有预览

```bash
npm run server:private
```

### 本地私有发布

```bash
npm run deploy:private
```

这会在临时工作区中：

1. 复制项目骨架
2. 合并 `source-local/`
3. 合并 `_config.local.yml`
4. 构建站点
5. 发布到 `gh-pages`

## 推荐使用方式

日常开发框架或主题：

```bash
npm run build
```

日常写你自己的内容：

```bash
npm run server:private
```

正式上线你的个人内容：

```bash
npm run deploy:private
```

更完整的发布说明见 [DEPLOY.md](/Users/chen/code/ops724blog/DEPLOY.md)。

## 示例内容说明

项目中 `source/` 目录下保留的内容仍然是“框架示例内容”，用于：

- 保证公开仓库开箱可运行
- 演示双语结构
- 演示主题样式

你的真实内容不应该直接写到这些示例文件里，而应写入 `source-local/`。
