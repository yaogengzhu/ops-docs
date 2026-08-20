---
title: 用 Docker Compose 仓库准备环境
description: 克隆 yaogengzhu/docker-compose，安装 Docker 后按每个服务目录的 run.md 启动。本文说明目录约定和常用命令。
keywords: Docker Compose, 环境准备, git clone, docker compose up
---

# 环境准备

## 1. 安装 Docker

Linux 上需要 Docker Engine，以及 Compose 插件（`docker compose`）或独立的 `docker-compose`。本手册命令两种写法都可能出现，以你机器上能运行为准。

确认：

```shell
docker version
docker compose version
```

## 2. 克隆编排仓库

```shell
git clone https://gitee.com/yaogengzhu/docker-compose.git
cd docker-compose/Linux
```

服务都在 `Linux/<服务名>/` 下。部分还有版本子目录，例如 `Linux/mysql/mysql8.0/`。

## 3. 启动某个服务

进入对应目录，先读 `run.md`，再执行。典型形式：

```shell
docker compose -f docker-compose.yml -p mysql8 up -d
```

- `-f`：指定编排文件。有的叫 `docker-compose-nginx.yml`，不要凭猜测。
- `-p`：项目名，用来区分容器和网络，避免和别的 compose 项目撞名。
- `-d`：后台运行。

## 4. 常用运维命令

```shell
docker compose -p mysql8 ps
docker compose -p mysql8 logs -f
docker compose -p mysql8 down
```

`down` 默认不删宿主机挂载的数据目录。真要重来，还要手动删 `./mysql/data` 这类文件夹（先确认没有要保留的数据）。

## 5. 镜像从哪拉

很多 yml 使用阿里云镜像 `registry.cn-hangzhou.aliyuncs.com/zhengqing/...`，注释里会写原官方镜像名。拉不下来时，把 `image` 改成官方名，或换成你自己的镜像加速。
