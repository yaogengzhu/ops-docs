---
title: 日志与可观测 Docker Compose 清单
description: 采集、检索、监控告警与链路追踪。对照 ops-docs 与 yaogengzhu/docker-compose，按服务查看用途和源码目录。
keywords: Docker Compose, 日志与可观测, 一键部署
---

# 日志与可观测

采集、检索、监控告警与链路追踪。标了「详解」的页面有完整讲解，其余先给用途和源码入口。

- [Elasticsearch](/observability/elasticsearch/)：单独启动 ES，做全文检索或给 ELK 打底。注意内存、vm.max_map_count，以及不要把数据写进容器可写层。
- [ELK](/observability/elk/)：Elasticsearch + Logstash + Kibana 一套日志检索。机器要够内存，小团队可先看 Loki 方案。
- [EFK](/observability/efk/)：用 Fluentd 替代 Logstash 的采集栈，同样落到 Elasticsearch。适合已经在用 Fluentd 的环境。
- [ELKF](/observability/elkf/)：在 ELK 基础上再加 Filebeat，把采集、解析、检索拆开。目录里组件多，按 run.md 顺序启动。
- [Filebeat](/observability/filebeat/)：轻量日志采集器，把文件或容器日志推到 ES / Logstash / Kafka。它不是存储，必须搭配下游。
- [Graylog](/observability/graylog/)：带 Web 界面的日志管理，底层仍依赖 Elasticsearch 和 MongoDB。想少写 Kibana 查询时可以试。
- [Grafana Loki](/observability/grafana-loki/)：Promtail 采集 + Loki 存储 + Grafana 查看，比 ELK 更省资源，适合先把容器日志看起来。
- [PlumeLog](/observability/plumelog/)：面向 Java 应用的链路日志系统，把 traceId 串起来看调用。不是通用 ELK 替代品。
- [Zipkin](/observability/zipkin/)：分布式链路追踪的经典实现，用来看一次请求经过了哪些服务、耗时在哪。需要应用埋点上报。
- [Prometheus](/observability/prometheus/)：拉模型监控与告警基础。先确定要刮哪些 exporter，再改配置，不要当成日志系统。
- [Grafana](/observability/grafana/)：监控与日志的可视化面板，数据源可以是 Prometheus、Loki、ES。单独启动后要先配数据源。
- [SkyWalking](/observability/skywalking/)：Apache 可观测平台，指标、日志、链路一体，对 Java Agent 友好。比 Zipkin 更重，内存要留足。
