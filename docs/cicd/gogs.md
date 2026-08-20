---
title: Docker Compose 部署 Gogs
description: 轻量自建 Git 服务，资源占用远小于 GitLab，适合个人或小团队托管代码。
keywords: Docker Compose, Gogs, Git
---

# Gogs

轻量自建 Git 服务，资源占用远小于 GitLab，适合个人或小团队托管代码。

## 什么时候用

本地或测试环境需要快速拉起 **Gogs** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入编排仓库的 `Linux/gogs` 目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p gogs up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 目录

编排文件在 `Linux/gogs`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
