---
title: Docker Compose 部署 Grafana Loki
description: Promtail 采集 + Loki 存储 + Grafana 查看，比 ELK 更省资源，适合先把容器日志看起来。
keywords: Docker Compose, Loki, Promtail, Grafana
---

# Grafana Loki

Promtail 采集 + Loki 存储 + Grafana 查看，比 ELK 更省资源，适合先把容器日志看起来。

## 什么时候用

本地或测试环境需要快速拉起 **Grafana Loki** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

- `grafana_promtail_loki`
- `grafana-promtail-loki-nginx-demo`

## 启动

进入编排仓库的 `Linux/grafana_promtail_loki` 目录，阅读其中的 `run.md`，一般是：

```shell
docker compose -f docker-compose.yml -p grafana-loki up -d
```

部分目录的编排文件名不是 `docker-compose.yml`，以该目录实际文件为准。

## 目录

编排文件在 `Linux/grafana_promtail_loki`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
