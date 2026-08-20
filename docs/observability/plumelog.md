---
title: Docker Compose 部署 PlumeLog
description: 面向 Java 应用的链路日志系统，把 traceId 串起来看调用。不是通用 ELK 替代品。
keywords: Docker Compose, PlumeLog, 链路日志
---

# PlumeLog

面向 Java 应用的链路日志系统，把 traceId 串起来看调用。不是通用 ELK 替代品。

## 什么时候用

本地或测试环境需要快速拉起 **PlumeLog** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入编排仓库的 `Linux/plumelog` 目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p plumelog up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 目录

编排文件在 `Linux/plumelog`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
