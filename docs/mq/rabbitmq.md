---
title: Docker Compose 一键部署 RabbitMQ
description: 启动带管理台的 RabbitMQ，讲清 5672/15672 端口、默认账号、延时插件，以及重装前为什么要清数据目录。
keywords: Docker Compose, RabbitMQ, AMQP, 延时队列
---

# RabbitMQ

AMQP 消息队列，路由灵活（direct / topic / fanout），适合订单、通知、削峰。仓库提供带 **management 插件** 的 3.7 / 3.9，以及集群、HAProxy 方案。开发用 **3.9.1-management 单机** 即可。

## 什么时候用 / 什么时候别用

**用：** 需要应答、重试、死信；协议多样（AMQP、STOMP）；想要现成 Web 管理台。

**别用：** 日志/指标这种超高吞吐流（更常看 [Kafka](/mq/kafka/)）；只想要 Redis `List` 级缓冲。

## 仓库里有哪些版本

- `Linux/rabbitmq/3.7.8-management`
- `Linux/rabbitmq/3.9.1-management`（推荐）
- `Linux/rabbitmq/3.9.1-management-cluster`
- `Linux/rabbitmq/3.9.1-management-cluster-haproxy`

源码目录：`Linux/rabbitmq`

## 关键配置拆解（3.9.1-management）

对照文件：`Linux/rabbitmq/3.9.1-management/docker-compose-rabbitmq.yml`。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management
hostname: my-rabbit
ports:
  - "5672:5672"
  - "15672:15672"
volumes:
  - "./rabbitmq/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf"
  - "./rabbitmq/data:/var/lib/rabbitmq"
  - "./rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/..."
```

含义：

- **management 镜像**：自带 Web UI，不必再装插件。
- **5672**：应用 AMQP 端口；**15672**：浏览器管理台。
- **hostname**：集群/cookie 会用到，随便改主机名后旧 data 可能对不上。
- **延时插件 ez 文件**：镜像里挂了 delayed message 插件，启动后还要 `rabbitmq-plugins enable`。
- 账号密码在 `rabbitmq.conf` / `10-default-guest-user.conf`，run.md 写的是 **admin/admin**（guest 默认仅本机）。

## 启动与访问

```shell
cd docker-compose/Linux/rabbitmq/3.9.1-management
chmod -R 777 ./rabbitmq
docker compose -f docker-compose-rabbitmq.yml -p rabbitmq up -d
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

管理台：`http://<IP>:15672`，`admin` / `admin`。

## 常见坑

1. **重装后管理台异常**：run.md 写明要删 data 目录并清浏览器缓存，节点身份留在 data 里。
2. **应用连 15672**：15672 是 HTTP，Java 客户端应连 **5672**。
3. **延时消息不生效**：插件文件挂上了但没 enable，用 `rabbitmq-plugins list` 确认。
4. **权限 777**：开发机权宜之计，生产用 rabbitmq 用户对应的 uid。
