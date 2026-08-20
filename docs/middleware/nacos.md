---
title: Docker Compose 一键部署 Nacos
description: 注册中心与配置中心。2.2.0 单机依赖外部 MySQL，启动前要改连接信息并导入 nacos-mysql.sql。
keywords: Docker Compose, Nacos, 注册中心, 配置中心
---

# Nacos

阿里开源的 **服务发现 + 配置中心**。Spring Cloud Alibaba 项目几乎都会用到。仓库提供 1.4.1、2.0.3、2.2.0、latest；下文以 **2.2.0 单机 + MySQL** 为例。

## 什么时候用 / 什么时候别用

**用：** 多个服务要互相发现；配置要集中改、支持灰度；本地想模拟线上 Nacos。

**别用：** 单进程玩具项目（写死地址即可）；还没准备 MySQL 就硬拉 2.x 这个 yml（它默认连外部库，不是 Derby 嵌入式）。

## 仓库里有哪些版本

- `Linux/nacos/nacos-1.4.1`
- `Linux/nacos/nacos-2.0.3`
- `Linux/nacos/nacos-2.2.0`（推荐对照）
- `Linux/nacos/nacos-latest`

源码：[Gitee Linux/nacos](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/nacos)

## 关键配置拆解（2.2.0）

原文件：[nacos-2.2.0/docker-compose.yml](https://gitee.com/yaogengzhu/docker-compose/blob/master/Linux/nacos/nacos-2.2.0/docker-compose.yml)。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.2.0
container_name: nacos_server
environment:
  - MODE=standalone
  - SPRING_DATASOURCE_PLATFORM=mysql
  - MYSQL_SERVICE_HOST=172.16.16.88
  - MYSQL_SERVICE_DB_NAME=nacos_config
  - MYSQL_SERVICE_PORT=3306
  - MYSQL_SERVICE_USER=root
  - MYSQL_SERVICE_PASSWORD=root
ports:
  - "8848:8848"
```

必须先改：

1. **MYSQL_SERVICE_HOST**：示例 `172.16.16.88` 是作者机器 IP。写成 `127.0.0.1` / `localhost` **无效**（那是 Nacos 容器自己）。应写宿主机局域网 IP，或把 MySQL 放进同一 compose 网络后写服务名。
2. **导入 SQL**：`nacos/nacos-mysql.sql` 导入到 `nacos_config` 库，否则表不存在，控制台起不来。
3. **JVM_XMS / XMX**：示例压到 128m 方便笔记本；配置一多再加大。
4. **gRPC 端口**：Nacos 2.x 客户端除 8848 外还用 **9848/9849**，只映射 8848 时，宿主机上的 2.x 客户端可能连不上，需要按官方补端口。

## 启动与访问

```shell
# 1. 准备 MySQL，创建库并导入 nacos-mysql.sql
# 2. 修改 MYSQL_SERVICE_* 
cd docker-compose/Linux/nacos/nacos-2.2.0
docker compose -f docker-compose.yml -p nacos up -d
```

- 控制台：`http://<IP>:8848/nacos`
- 默认账号：`nacos` / `nacos`

Spring 里同时配 discovery / config 的用户名密码，与控制台一致。

## 常见坑

1. **一直重启**：十有八九是 MySQL 连不上或没导表，看 `docker logs nacos_server`。
2. **客户端能打开网页但注册失败**：2.x gRPC 端口没通，或客户端版本与服务器差一个大版本。
3. **配置重启后消失**：连的是空库或仍在用内存模式，核对 `SPRING_DATASOURCE_PLATFORM`。
