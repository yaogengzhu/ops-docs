---
title: Docker Compose 一键部署 MinIO
description: 兼容 S3 的对象存储，本地替代 OSS/COS。控制台 9001，API 9002，默认账号务必上线前改掉。
keywords: Docker Compose, MinIO, S3, 对象存储
---

# MinIO

S3 兼容对象存储：上传文件、图片、备份。本地开发用来代替阿里云 OSS、腾讯云 COS，SDK 几乎不用改。

## 什么时候用 / 什么时候别用

**用：** 应用要走对象存储协议；需要预签名 URL、分桶权限；不想把文件塞进业务库。

**别用：** 只要网盘同步给同事（看 [Nextcloud](/storage/nextcloud/)）；生产单节点无纠删码就当高可用。

## 仓库里有哪些版本

- `Linux/minio/latest`（滚动标签，行为可能变）
- `Linux/minio/RELEASE.2023-01-02T09-40-09Z`（钉死日期更稳）

源码目录：`Linux/minio`

## 关键配置拆解（latest）

对照文件：`Linux/minio/latest/docker-compose-minio.yml`。

```yaml
image: minio/minio:latest
command: server /data --console-address ":9001"
environment:
  MINIO_ACCESS_KEY: "root"
  MINIO_SECRET_KEY: "password"
ports:
  - "9002:9000"
  - "9001:9001"
volumes:
  - "./minio/data:/data"
```

含义：

- **9000（容器内）**：S3 API。映射成宿主机 **9002**，避免和 Portainer 9000 打架。
- **9001**：控制台。新版控制台路径不一定是 `/minio`，打不开时试 `http://<IP>:9001`。
- **ACCESS_KEY / SECRET_KEY**：S3 的 AK/SK。新版 MinIO 更推荐 `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`，若启动报变量过时，按镜像文档改名。
- **./minio/data**：对象实体。这才是「文件盘」。

SDK 端点写 `http://<宿主机>:9002`，path-style 或 virtual-host 按客户端配置；本地 HTTP 不要开 SSL 校验。

## 启动与访问

```shell
cd docker-compose/Linux/minio/latest
docker compose -f docker-compose-minio.yml -p minio up -d
```

控制台：`http://<IP>:9001`，账号 `root` / `password`。

## 常见坑

1. **控制台 9001、API 9002 用反**：浏览器走控制台，程序走 API 端口。
2. **latest 突然起不来**：镜像改了环境变量名或默认控制台地址，改钉版本目录更稳。
3. **桶策略全公开**：开发图省事，生产必须改密钥并关匿名下载。
4. **磁盘满**：对象不会进 MySQL，只吃 data 目录所在盘。
