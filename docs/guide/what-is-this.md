---
title: Ops Docs 是什么
description: Ops Docs 用中文说明每个 Docker Compose 编排的用途、场景和注意点。
keywords: Ops Docs, Docker Compose, 中间件手册
---

# Ops Docs 是什么

配套的 Compose 编排仓库把常见中间件做成可一键启动的目录。每个服务目录里通常有 `docker-compose.yml`（或带服务名的 yml）和 `run.md`。

`run.md` 解决「怎么启动」。**Ops Docs 解决「这个编排是干什么的」。**

适合：

- 需要在 Linux 上快速搭开发 / 测试环境
- 想先搞清 MySQL、Redis、Nacos 等目录该不该开
- 对照源码改端口、密码和数据卷

不适合：

- 把默认账号密码直接用于公网生产
- 替代各软件官方文档里的集群与安全设计

标了「详解」的页面有完整模板（用途、版本、配置拆解、启动、常见坑）。其余服务先提供一句话用途和本地目录，后续按同一模板补齐。
