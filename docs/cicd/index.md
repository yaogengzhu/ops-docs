---
title: CI/CD 与网关 Docker Compose 清单
description: 流水线、容器管理和反向代理。按服务查看用途和编排目录。
keywords: Docker Compose, CI/CD 与网关, 一键部署
---

# CI/CD 与网关

流水线、容器管理和反向代理。标了「详解」的页面有完整讲解，其余先给用途和本地目录。

- [Portainer](/cicd/portainer/)（详解）：浏览器里管理 Docker：看容器、日志、重启。挂载 docker.sock，首次打开要创建管理员账号。
- [Jenkins](/cicd/jenkins/)（详解）：在容器里跑 Jenkins 做 CI。说明 10000 端口、初始密码位置、时区，以及挂载 docker.sock 在容器内构建镜像。
- [Nginx](/cicd/nginx/)（详解）：反向代理和静态站点。配置、html、日志都挂到宿主机，改完配置在容器里 nginx -s reload。
- [GitLab](/cicd/gitlab/)：自建 Git 与 CI。镜像大、内存高，笔记本请慎用；小团队可先看 Gogs。
- [Gogs](/cicd/gogs/)：轻量自建 Git 服务，资源占用远小于 GitLab，适合个人或小团队托管代码。
- [Rancher](/cicd/rancher/)：Kubernetes 多集群管理界面。本机 Compose 版只适合体验，不要当成生产 K8s 发行版。
- [SonarQube](/cicd/sonarqube/)：代码质量与安全扫描平台，通常和 CI 流水线一起用。需要配套数据库，启动较慢。
