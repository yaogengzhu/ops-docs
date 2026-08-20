---
title: Docker Compose 部署 Rancher
description: Kubernetes 多集群管理界面。本机 Compose 版只适合体验，不要当成生产 K8s 发行版。
keywords: Docker Compose, Rancher, Kubernetes
---

# Rancher

Kubernetes 多集群管理界面。本机 Compose 版只适合体验，不要当成生产 K8s 发行版。

## 什么时候用

本地或测试环境需要快速拉起 **Rancher** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入 Gitee 对应目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p rancher up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 源码

- [Gitee：Linux/rancher](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/rancher)

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
