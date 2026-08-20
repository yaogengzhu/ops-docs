---
title: 消息队列 Docker Compose 清单
description: 异步解耦、削峰填谷与流式处理。按服务查看用途和编排目录。
keywords: Docker Compose, 消息队列, 一键部署
---

# 消息队列

异步解耦、削峰填谷与流式处理。标了「详解」的页面有完整讲解，其余先给用途和本地目录。

- [RabbitMQ](/mq/rabbitmq/)（详解）：启动带管理台的 RabbitMQ，讲清 5672/15672 端口、默认账号、延时插件，以及重装前为什么要清数据目录。
- [Kafka](/mq/kafka/)：用编排拉起 Kafka，适合日志收集和高吞吐消息。本地开发也要准备好 ZooKeeper 或 KRaft 相关依赖。
- [RocketMQ](/mq/rocketmq/)：阿里系消息中间件，NameServer + Broker 组合。适合顺序消息、事务消息等国内业务场景的本地试验。
- [ActiveMQ](/mq/activemq/)：经典 JMS 消息代理。维护老 Java 系统或需要 STOMP/OpenWire 时再用，新项目更常选 RabbitMQ 或 Kafka。
- [Pulsar](/mq/pulsar/)：Pulsar 把计算和存储分离，能当队列也能当日志。组件比 Kafka 多，本机先跑单机体验即可。
