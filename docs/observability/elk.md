---
title: Docker Compose 部署 ELK 日志栈
description: Elasticsearch + Logstash + Kibana 一套日志检索。机器要够内存，小团队可先看 Loki 方案。
keywords: Docker Compose, ELK, Kibana, Logstash
---

# ELK

Elasticsearch + Logstash + Kibana 一套日志检索。机器要够内存，小团队可先看 Loki 方案。

## 什么时候用

本地或测试环境需要快速拉起 **ELK** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入 Gitee 对应目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p elk up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 源码

- [Gitee：Linux/elk](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/elk)

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
