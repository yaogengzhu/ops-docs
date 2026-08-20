---
title: Docker Compose 一键部署 MySQL
description: 用仓库里的 mysql5.7 / mysql8.0 / 主从编排在本地快速拉起 MySQL，讲清端口映射、root 密码、数据卷和常见启动失败原因。
keywords: Docker Compose, MySQL 8, MySQL 5.7, 主从复制, 一键部署
---

# MySQL

用 Docker Compose 在本机或测试机跑 MySQL，免去安装包和初始化向导。仓库提供 **5.7、8.0、主从** 三套，日常开发优先 8.0 单机。

## 什么时候用 / 什么时候别用

**用：** 应用需要关系库；想和线上接近的 SQL 模式；需要把数据落在磁盘、重启不丢。

**别用：** 只要键值缓存（用 [Redis](/database/redis/)）；生产要高可用却只复制了单机 yml；把 `root/root` 暴露到公网。

## 仓库里有哪些版本

| 目录 | 用途 |
| --- | --- |
| `Linux/mysql/mysql5.7` | 兼容老应用、老驱动 |
| `Linux/mysql/mysql8.0` | 默认推荐 |
| `Linux/mysql/mysql-master-slave` | 练主从复制，不是生产方案 |

源码目录：`Linux/mysql`

## 关键配置拆解（mysql8.0）

对照文件：`Linux/mysql/mysql8.0/docker-compose.yml`。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:8.0
container_name: mysql8
restart: unless-stopped
environment:
  TZ: Asia/Shanghai
  MYSQL_ROOT_PASSWORD: root
  MYSQL_DATABASE: demo
ports:
  - "3308:3306"
volumes:
  - "./mysql/my.cnf:/etc/mysql/my.cnf"
  - "./mysql/data:/var/lib/mysql"
```

含义：

- **镜像**：阿里云上的 `mysql:8.0` 转储。拉不下来可改成 Docker Hub 的 `mysql:8.0`。
- **3308:3306**：宿主机 3308，容器内仍是 3306。本机已有 3306 时这样可并存。
- **MYSQL_ROOT_PASSWORD**：首次初始化 root 密码。目录里一旦有了 `data`，再改环境变量**不会**改已有密码。
- **MYSQL_DATABASE**：第一次启动创建 `demo` 库。
- **./mysql/data**：真正的数据。删容器不等于删库。
- **my.cnf**：字符集、sql_mode 等放这里，改完要重启容器。

## 启动与访问

```shell
cd docker-compose/Linux/mysql/mysql8.0
docker compose -f docker-compose.yml -p mysql8 up -d
```

连接：

- 地址：宿主机 IP，端口 **3308**
- 账号：`root` / `root`（请尽快改）
- 库名：`demo`

```shell
docker exec -it mysql8 mysql -uroot -proot
```

## 常见坑

1. **改了密码却登不上**：`./mysql/data` 已初始化。要么用旧密码，要么停掉后删 data 再 `up`（数据会没）。
2. **应用连 3306**：编排映射的是 3308，JDBC 要写 `jdbc:mysql://<宿主机>:3308/demo`。
3. **容器内连 MySQL 的其它容器**：应连 `mysql8:3306` 或 compose 服务名，不要连 `127.0.0.1:3308`。
4. **主从目录**：需要改 `master_host` 等，不能把示例域名原样留下。
