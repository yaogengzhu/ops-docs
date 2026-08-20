---
title: Docker Compose 部署 Walle 发布系统
description: Web 发布平台，把代码发到目标机。小团队可用，大型流水线更常见 Jenkins / GitLab CI。
keywords: Docker Compose, Walle, 发布系统
---

# Walle

Web 发布平台，把代码发到目标机。小团队可用，大型流水线更常见 Jenkins / GitLab CI。

## 什么时候用

本地或测试环境需要快速拉起 **Walle** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入编排仓库的 `Linux/walle` 目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p walle up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 目录

编排文件在 `Linux/walle`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
