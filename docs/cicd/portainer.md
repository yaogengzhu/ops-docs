---
title: Docker Compose 一键部署 Portainer
description: 浏览器里管理 Docker：看容器、日志、重启。挂载 docker.sock，首次打开要创建管理员账号。
keywords: Docker Compose, Portainer, Docker 可视化
---

# Portainer

Docker 的 Web 控制台：列表、日志、进终端、管 volume。比纯命令友好，适合刚接触容器的人。仓库有 1.24、1.25、2.17、**2.40.0**。

## 什么时候用 / 什么时候别用

**用：** 不想记一长串 `docker logs` / `docker exec`；给同事一个只读或受限的界面（社区版能力有限）。

**别用：** 把 `docker.sock` 暴露给不可信网络——拿到界面约等于拿到宿主机 Docker。公网必须加认证和 HTTPS。

## 仓库里有哪些版本

- `Linux/portainer/1.24.1`
- `Linux/portainer/1.25.0`
- `Linux/portainer/2.17.0`
- `Linux/portainer/2.40.0`（推荐）

源码目录：`Linux/portainer`

## 关键配置拆解（2.40.0）

对照文件：`Linux/portainer/2.40.0/docker-compose.yml`。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/portainer-ce:2.40.0
container_name: portainer
restart: always
volumes:
  - "/var/run/docker.sock:/var/run/docker.sock"
ports:
  - "9000:9000"
```

含义：

- **docker.sock**：Portainer 通过它驱动本机 Docker。这是功能来源，也是最大风险点。
- **9000**：Web 端口。数据卷 `./portainer/data` 在示例里被注释掉了，**重启可能丢管理员配置**；长期用请取消注释并挂上 `/data`。
- 镜像是 CE（社区版），不是商业 BE。

## 启动与访问

```shell
cd docker-compose/Linux/portainer/2.40.0
docker compose -f docker-compose.yml -p portainer up -d
```

打开 `http://<IP>:9000`，**第一次**会要求创建管理员。错过时限要删容器（及 data 卷）重来。

```shell
docker logs -f portainer
```

## 常见坑

1. **Windows / macOS**：sock 路径不同，Linux yml 不能原样用。
2. **连不上本地 Docker**：sock 没挂载，或 SELinux/权限拦住。
3. **忘记管理员密码**：没有「邮箱找回」，只能清数据重建。
4. **和其它 9000 冲突**：MinIO 控制台常用 9001，但有人会把 API 放到 9000，注意错开。
