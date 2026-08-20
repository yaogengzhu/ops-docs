---
title: Docker Compose 部署 ActiveMQ
description: 经典 JMS 消息代理。维护老 Java 系统或需要 STOMP/OpenWire 时再用，新项目更常选 RabbitMQ 或 Kafka。
keywords: Docker Compose, ActiveMQ, JMS
---

# ActiveMQ

经典 JMS 消息代理。维护老 Java 系统或需要 STOMP/OpenWire 时再用，新项目更常选 RabbitMQ 或 Kafka。

## 什么时候用

本地或测试环境需要快速拉起 **ActiveMQ** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- 见源码目录中的版本子文件夹

## 启动

进入 Gitee 对应目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p activemq up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 源码

- [Gitee：Linux/activemq](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/activemq)

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
