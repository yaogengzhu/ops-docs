---
title: 其它中间件 Docker Compose 清单
description: 注册配置、任务调度、工作流与协作。对照 ops-docs 与 yaogengzhu/docker-compose，按服务查看用途和源码目录。
keywords: Docker Compose, 其它中间件, 一键部署
---

# 其它中间件

注册配置、任务调度、工作流与协作。标了「详解」的页面有完整讲解，其余先给用途和源码入口。

- [Nacos](/middleware/nacos/)（详解）：注册中心与配置中心。2.2.0 单机依赖外部 MySQL，启动前要改连接信息并导入 nacos-mysql.sql。
- [XXL-JOB](/middleware/xxl-job/)：分布式任务调度，带管理台。适合定时任务、分片执行，需要配合执行器和数据库。
- [PowerJob](/middleware/powerjob/)：另一套分布式调度，支持 MapReduce 和工作流。和 XXL-JOB 二选一即可，不要两套一起上生产。
- [Sentinel](/middleware/sentinel/)：流量防护：限流、熔断、降级。控制台单独部署，规则要落到持久化，否则重启丢失。
- [ZooKeeper](/middleware/zookeeper/)：分布式协调：选主、配置、Kafka/Dubbo 老版本依赖。新栈能不用 ZK 就不用。
- [YApi](/middleware/yapi/)：接口文档与 Mock 平台，依赖 MongoDB。适合前后端约定 API，不是网关。
- [Flowable](/middleware/flowable/)：BPMN 工作流引擎，用来跑审批流。需要数据库，业务里真有流程再部署。
- [JumpServer](/middleware/jumpserver/)：堡垒机：人到服务器的审计与授权。组件多，请按官方硬件建议准备，不要和业务容器混部。
- [NPS](/middleware/nps/)：轻量内网穿透，把内网服务映射出去。仅用于受控环境，注意鉴权和端口暴露。
- [Tomcat](/middleware/tomcat/)：经典 Java Servlet 容器。把 war 挂进去就能访问，适合跑老应用，新项目多用内嵌 Tomcat。
- [JRebel](/middleware/jrebel/)：配合 Java 热加载的辅助服务。只在开发机使用，不要放到生产网络。
- [OpenSumi Web](/middleware/opensumi-web/)：浏览器里的 IDE 框架演示。用来体验云端编辑，不是运维必备中间件。
- [Walle](/middleware/walle/)：Web 发布平台，把代码发到目标机。小团队可用，大型流水线更常见 Jenkins / GitLab CI。
- [JPom](/middleware/jpom/)：简朴的项目运维与发布面板，能管脚本、构建和进程。适合小团队不想上 Jenkins 的场景。
- [Confluence](/middleware/confluence/)：团队知识库。镜像和许可都要自行处理，个人笔记不必上这么重的套件。
- [Jira](/middleware/jira/)：缺陷与迭代跟踪。同样偏重，试用前看内存和许可证；小团队可用更轻的看板。
- [Dubbo Admin](/middleware/dubbo-admin/)：Dubbo 服务治理控制台，用来看提供者和消费者。没有 Dubbo 集群就不必启动。
- [Azkaban](/middleware/azkaban/)：LinkedIn 开源的工作流调度，偏大数据任务依赖。常规 Spring 定时任务用 XXL-JOB 更简单。
