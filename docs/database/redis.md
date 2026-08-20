---
title: Docker Compose 一键部署 Redis
description: 对照 redis6 / redis7 的单机、主从、哨兵和分片编排，说明密码、持久化、数据目录，以及什么时候不该开集群。
keywords: Docker Compose, Redis 7, Redis 哨兵, Redis 集群, 一键部署
---

# Redis

内存数据库，做缓存、会话、分布式锁、简单队列。仓库里 **6.0.8、7.0.5** 都有，7.0.5 还拆了单机 / 主从 / 哨兵 / 分片。另有 `redis-manager` 做 Web 管理。

## 什么时候用 / 什么时候别用

**用：** 热点数据、限流计数、验证码 TTL、消息缓冲；开发机不想装原生 Redis。

**别用：** 把它当唯一可靠数据库（进程被杀、没开持久化就会丢）；一上来就上分片集群——单机够用时更简单。

## 仓库里有哪些版本

| 目录 | 用途 |
| --- | --- |
| `Linux/redis/redis6.0.8` | 老客户端兼容 |
| `Linux/redis/redis7.0.5/01-单机` | 日常开发默认 |
| `Linux/redis/redis7.0.5/02-主从` | 读写分离试验 |
| `Linux/redis/redis7.0.5/03-哨兵集群` | 故障转移试验 |
| `Linux/redis/redis7.0.5/04-分片集群` | Cluster 协议试验 |
| `Linux/redis/redis-manager` | 图形界面管实例 |

源码：[Gitee Linux/redis](https://gitee.com/yaogengzhu/docker-compose/tree/master/Linux/redis)

## 关键配置拆解（7.0.5 单机）

原文件：[01-单机/docker-compose-redis.yml](https://gitee.com/yaogengzhu/docker-compose/blob/master/Linux/redis/redis7.0.5/01-%E5%8D%95%E6%9C%BA/docker-compose-redis.yml)。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5
container_name: redis
command: redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no
ports:
  - "6379:6379"
volumes:
  - "./redis/data:/data"
  - "./redis/config/redis.conf:/etc/redis/redis.conf"
```

含义：

- **requirepass 123456**：所有客户端都要密码。生产务必改。
- **appendonly no**：没开 AOF。注释里有 `--appendonly yes` 的备选，缓存可关、要少丢数据再开。
- **6379**：和官方默认一致，本机已有 Redis 时改左边端口。
- **run.md 要求 chmod 777**：配置文件和 data 目录权限不够会起不来。

## 启动与访问

```shell
cd docker-compose/Linux/redis/redis7.0.5/01-单机
chmod -R 777 ./redis
docker compose -f docker-compose-redis.yml -p redis up -d
docker exec -it redis redis-cli -a 123456
```

应用连接：`redis://:123456@<宿主机>:6379/0`。

## 常见坑

1. **NOAUTH Authentication required**：忘了密码，或 Spring 配置没写 `password`。
2. **主从 / 哨兵连错地址**：容器之间用服务名，应用在宿主机则用映射端口。
3. **清空 data 当重启**：RDB/AOF 都在 `./redis/data`，删了等于丢库。
4. **分片集群端口**：除 6379 外还有集群总线端口，防火墙和映射都要一起改。
