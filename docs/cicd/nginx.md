---
title: Docker Compose 一键部署 Nginx
description: 反向代理和静态站点。配置、html、日志都挂到宿主机，改完配置在容器里 nginx -s reload。
keywords: Docker Compose, Nginx, 反向代理
---

# Nginx

反向代理、静态资源、简单 HTTPS 终止。仓库提供 **1.21.1、1.27.0**，结构相同：conf、html、log 全部挂载。

## 什么时候用 / 什么时候别用

**用：** 把多个后端（管理台、API、H5）收到 80/443；本地验 `proxy_pass` 和缓存头。

**别用：** 只想临时看一个 HTML（`python -m http.server` 更快）；已经在用 Caddy/Traefik 且不想多一层。

## 仓库里有哪些版本

- `Linux/nginx/1.21.1`
- `Linux/nginx/1.27.0`（推荐）

源码目录：`Linux/nginx`

## 关键配置拆解（1.27.0）

对照文件：`Linux/nginx/1.27.0/docker-compose-nginx.yml`。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/nginx:1.27.0
container_name: nginx
ports:
  - "80:80"
volumes:
  - "./nginx/conf/nginx.conf:/etc/nginx/nginx.conf"
  - "./nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf"
  - "./nginx/html:/usr/share/nginx/html"
  - "./nginx/log:/var/log/nginx"
```

含义：

- **80:80**：和系统 nginx、IIS、其它 Web 抢端口时，改左边，例如 `8080:80`。
- **html**：静态文件丢这里，浏览器访问 `/`。
- **default.conf**：虚拟主机、反向代理写这里，不要只改容器内文件（一重建就没了）。
- **log**：access/error 在宿主机看，方便排查 502。

反向代理其它 compose 服务时，`proxy_pass` 用 **容器网络里的名字和内部端口**，例如 `http://mysql8:3306` 不可行（那是 MySQL 协议），HTTP 服务才是 `http://jenkins:8080`。从 Nginx 容器访问宿主机上的端口，Linux 可用 `http://172.17.0.1:端口` 或 `host.docker.internal`（视环境而定）。

## 启动与访问

```shell
cd docker-compose/Linux/nginx/1.27.0
docker compose -f docker-compose-nginx.yml -p nginx up -d
docker exec -it nginx nginx -s reload
```

浏览器：`http://<IP>/`（映射 80 时）。

## 常见坑

1. **改 conf 不生效**：要 `nginx -s reload`；语法错会 reload 失败，先 `nginx -t`。
2. **502 Bad Gateway**：upstream 地址写了 `127.0.0.1`，那是 Nginx 容器自己。
3. **权限**：html 目录要让 nginx 用户能读。
4. **没映射 443**：要 HTTPS 时自行加 443 和证书卷。
