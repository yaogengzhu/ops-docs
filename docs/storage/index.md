---
title: 文件存储 Docker Compose 清单
description: 对象存储、分布式文件与网盘。对照 ops-docs 与 yaogengzhu/docker-compose，按服务查看用途和源码目录。
keywords: Docker Compose, 文件存储, 一键部署
---

# 文件存储

对象存储、分布式文件与网盘。标了「详解」的页面有完整讲解，其余先给用途和源码入口。

- [MinIO](/storage/minio/)（详解）：兼容 S3 的对象存储，本地替代 OSS/COS。控制台 9001，API 9002，默认账号务必上线前改掉。
- [FastDFS](/storage/fastdfs/)：国内常用的分布式文件存储，Tracker + Storage 组合。新项目更常直接用 MinIO / S3。
- [Nextcloud](/storage/nextcloud/)：自建网盘与协作，适合团队文件同步。不是给业务程序当对象存储用的。
- [百度网盘 Web](/storage/baidupcs-web/)：给百度网盘加一层 Web 管理，方便离线下载和文件浏览。依赖你的网盘账号，不是通用对象存储。
