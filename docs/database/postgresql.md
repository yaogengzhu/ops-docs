---
title: Docker Compose 部署 PostgreSQL
description: 一键拉起 PostgreSQL，适合需要窗口函数、JSON 和更严格 SQL 的开发环境，替代本机安装。
keywords: Docker Compose, PostgreSQL, Postgres
---

# PostgreSQL

一键拉起 PostgreSQL，适合需要窗口函数、JSON 和更严格 SQL 的开发环境，替代本机安装。

## 什么时候用

本地或测试环境需要快速拉起 **PostgreSQL** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入 Gitee 对应目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p postgresql up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 源码

- [Gitee：Linux/postgresql](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/postgresql)

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
