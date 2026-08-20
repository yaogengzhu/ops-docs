---
layout: home
title: Ops Docs
titleTemplate: Docker Compose 中间件手册
description: Docker Compose 中间件手册。对照 yaogengzhu/docker-compose，讲清每个编排做什么、何时用、怎么跑、关键配置怎么改。
keywords: Docker Compose, 一键部署, 中间件手册, MySQL, Redis, Nacos, Ops Docs
hero:
  name: Ops Docs
  text: Docker Compose 中间件手册
  tagline: 仓库里的 run.md 多半只有一行 up -d。这里补上每个 compose 的作用、适用场景和关键配置。
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/getting-started
    - theme: alt
      text: 浏览全部服务
      link: /guide/catalog
features:
  - title: 按分类查找
    details: 数据库、消息队列、可观测、CI/CD、存储和其它中间件，和源码仓库目录对应。
  - title: 先讲用途
    details: 每个服务先回答「干什么、何时用」，再给启动命令，避免盲目 docker compose up。
  - title: 面向检索
    details: 每页独立标题和摘要，可被搜索引擎收录；站内也支持中文搜索。
---

<ServiceCatalog />
