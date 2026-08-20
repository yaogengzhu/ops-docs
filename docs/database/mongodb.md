---
title: Docker Compose 部署 MongoDB
description: 用 Compose 启动文档数据库 MongoDB，适合本地开发存 JSON 文档、做副本集试验，而不是直接当生产集群。
keywords: Docker Compose, MongoDB, 文档数据库
---

# MongoDB

用 Compose 启动文档数据库 MongoDB，适合本地开发存 JSON 文档、做副本集试验，而不是直接当生产集群。

## 什么时候用

本地或测试环境需要快速拉起 **MongoDB** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入编排仓库的 `Linux/mongodb` 目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p mongodb up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 目录

编排文件在 `Linux/mongodb`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
