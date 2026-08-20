---
title: Docker Compose 常见坑
description: 端口占用、数据卷权限、默认密码、时区和镜像源是用该仓库时最常见的问题，启动前先看这一页。
keywords: Docker Compose, 端口冲突, 数据卷, 权限, 默认密码
---

# 常见坑

## 端口已经被占用

编排会把容器端口映射到宿主机，例如 MySQL 8 常用 `3308:3306`、Nginx `80:80`。报 `address already in use` 时，改 yml 左边的宿主机端口，或停掉占用进程。

```shell
# Linux 查看端口
ss -lntp | grep 3308
```

## 数据写进了可写层

几乎每个服务都把数据目录挂到当前文件夹，例如 `./mysql/data`。不要删这些目录当「清缓存」，那是库文件。换机器时把挂载目录一并带走才能保留数据。

## 权限不足

Redis、RabbitMQ、Jenkins 的 `run.md` 常要求：

```shell
chmod -R 777 ./redis
```

这是图省事的开发机做法。生产应用指定 uid/gid，而不是 777。

## 默认密码能进公网

仓库面向「先跑起来」：MySQL `root/root`、Redis `123456`、MinIO `root/password`、Nacos `nacos/nacos`。本机可以，映射到公网 IP 前必须改。

## 时区不是上海

多数容器设了 `TZ: Asia/Shanghai`。Jenkins 还需要 `JAVA_OPTS` 里的 `-Duser.timezone=Asia/Shanghai`，否则构建时间会偏。

## 依赖没就绪

Nacos 2.x 单机要先有 MySQL，并导入 `nacos-mysql.sql`；Canal 要先有开了 binlog 的 MySQL。只 `up` 当前目录、下游连不上时，先看环境变量里的 IP——**不能写 `127.0.0.1`**，那是容器自己，应写宿主机局域网 IP 或 compose 服务名。

## 重装却沿用了旧数据

RabbitMQ 等会把节点身份写进 data 目录。换配置重装前，停容器并删掉映射的 data（确认可丢），同时清浏览器对管理台的缓存。
