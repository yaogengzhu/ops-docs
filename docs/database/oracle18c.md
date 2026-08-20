---
title: Docker Compose 部署 Oracle 18c
description: 在 Linux 上用编排跑 Oracle 18c 开发库。镜像大、内存占用高，只建议兼容老系统时使用。
keywords: Docker Compose, Oracle 18c, 数据库
---

# Oracle 18c

在 Linux 上用编排跑 Oracle 18c 开发库。镜像大、内存占用高，只建议兼容老系统时使用。

## 什么时候用

本地或测试环境需要快速拉起 **Oracle 18c** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入 Gitee 对应目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p oracle18c up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 源码

- [Gitee：Linux/oracle18c](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/oracle18c)

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
