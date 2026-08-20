---
title: 数据库 Docker Compose 清单
description: 关系库、缓存、分库分表与数据同步。对照 ops-docs 与 yaogengzhu/docker-compose，按服务查看用途和源码目录。
keywords: Docker Compose, 数据库, 一键部署
---

# 数据库

关系库、缓存、分库分表与数据同步。标了「详解」的页面有完整讲解，其余先给用途和源码入口。

- [MySQL](/database/mysql/)（详解）：用仓库里的 mysql5.7 / mysql8.0 / 主从编排在本地快速拉起 MySQL，讲清端口映射、root 密码、数据卷和常见启动失败原因。
- [Redis](/database/redis/)（详解）：对照 redis6 / redis7 的单机、主从、哨兵和分片编排，说明密码、持久化、数据目录，以及什么时候不该开集群。
- [MongoDB](/database/mongodb/)：用 Compose 启动文档数据库 MongoDB，适合本地开发存 JSON 文档、做副本集试验，而不是直接当生产集群。
- [PostgreSQL](/database/postgresql/)：一键拉起 PostgreSQL，适合需要窗口函数、JSON 和更严格 SQL 的开发环境，替代本机安装。
- [Oracle 18c](/database/oracle18c/)：在 Linux 上用编排跑 Oracle 18c 开发库。镜像大、内存占用高，只建议兼容老系统时使用。
- [Couchbase](/database/couchbase/)：启动 Couchbase 文档与缓存一体的数据库，用于体验 N1QL 和桶管理，不适合当作默认业务库。
- [MyCat](/database/mycat/)：MyCat 是 MySQL 前的中间件，用来做分库分表和读写分离。先有 MySQL，再跑这个编排才有意义。
- [Canal](/database/canal/)：Canal 模拟 MySQL slave 解析 binlog，把增量变更投递给下游。用来做缓存刷新、异构同步，不是业务数据库。
- [Seata](/database/seata/)：Seata 提供分布式事务协调。微服务拆库后需要跨服务一致性时再用，单库应用不必上。
- [Yearning](/database/yearning/)：Yearning 是 SQL 审核与工单平台，给 DBA 和开发走变更流程，不是给应用连接的业务库。
