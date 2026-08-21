---
title: 每份 Compose 的配置清单
description: 逐文件整理配套仓库中每份 Docker Compose 的镜像、端口、环境变量、挂载、服务依赖和高权限设置，便于启动前逐项核对。
keywords: Docker Compose, 配置清单, 环境变量, 端口, 数据卷
---

# 每份 Compose 的配置清单

本页从上游 Compose YAML 静态生成。它回答“启动这份编排要核对什么”，不把示例密码当成生产建议。相对路径均以该 Compose 文件所在目录为基准。

## 怎么判断必填

- `${VAR}` 或 `${VAR?提示}`：必须通过 shell 或 `.env` 提供。`${VAR:-default}` 有默认值，可按环境覆盖。
- `./宿主机路径:/容器路径`：确认宿主机路径存在、文件类型正确且容器用户可读写。首次启动会自动创建目录，但把缺失的配置文件误建成目录会导致启动失败。
- 明文密码是上游示例值；对外开放或长期运行前必须修改。已有数据卷初始化后，单纯修改环境变量通常不会重置数据库密码。
- `depends_on` 只控制启动次序；未配健康检查时，不代表依赖服务已经可用。

## 数据库

### MySQL

#### `Linux/mysql/mysql-master-slave/docker-compose.yml`

**mysql-master**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3306:3306`
- 数据与配置挂载：`./mysql/master/my.cnf:/etc/mysql/my.cnf`；`./mysql/master/data:/var/lib/mysql`；`./mysql/master/log/mysql/error.log:/var/log/mysql/error.log`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=demo`

**mysql-slave**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3307:3306`
- 数据与配置挂载：`./mysql/slave/my.cnf:/etc/mysql/my.cnf`；`./mysql/slave/data:/var/lib/mysql`；`./mysql/slave/log/mysql/error.log:/var/log/mysql/error.log`
- 依赖服务：`mysql-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=demo`

- 顶层网络：`mysql={"driver":"bridge"}`

#### `Linux/mysql/mysql5.7/docker-compose.yml`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3306:3306`
- 数据与配置挂载：`./mysql/my.cnf:/etc/mysql/my.cnf`；`./mysql/init-file.sql:/etc/mysql/init-file.sql`；`./mysql/data:/var/lib/mysql`；`./mysql/log/mysql/error.log:/var/log/mysql/error.log`；`./mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=demo`

#### `Linux/mysql/mysql8.0/docker-compose.yml`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:8.0`
- 端口：`3308:3306`
- 数据与配置挂载：`./mysql/my.cnf:/etc/mysql/my.cnf`；`./mysql/data:/var/lib/mysql`；`./mysql/mysql-files:/var/lib/mysql-files`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=demo`
- 权限与网络：启用了 privileged；以 root 运行

### Redis

#### `Linux/redis/redis-manager/docker-compose-redis-manager.yml`

**redis**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis-manager`
- 端口：`8182:8182`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`DATASOURCE_DATABASE=redis_manager`；`DATASOURCE_URL=jdbc:mysql://www.zhengqingya.com:3306/redis_manager?useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2b8`；`DATASOURCE_USERNAME=root`；`DATASOURCE_PASSWORD=root（示例凭据，部署前修改）`

#### `Linux/redis/redis6.0.8/docker-compose-redis-cluster.yml`

**redis-6381**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6381:6381`
- 数据与配置挂载：`./redis-cluster/redis-6381/data:/data`；`./redis-cluster/redis-6381/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6381 --requirepass 123456 --appendonly no`

**redis-6382**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6382:6382`
- 数据与配置挂载：`./redis-cluster/redis-6382/data:/data`；`./redis-cluster/redis-6382/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6382 --requirepass 123456 --appendonly no`

**redis-6383**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6383:6383`
- 数据与配置挂载：`./redis-cluster/redis-6383/data:/data`；`./redis-cluster/redis-6383/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6383 --requirepass 123456 --appendonly no`

**redis-6384**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6384:6384`
- 数据与配置挂载：`./redis-cluster/redis-6384/data:/data`；`./redis-cluster/redis-6384/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6384 --requirepass 123456 --appendonly no`

**redis-6385**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6385:6385`
- 数据与配置挂载：`./redis-cluster/redis-6385/data:/data`；`./redis-cluster/redis-6385/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6385 --requirepass 123456 --appendonly no`

**redis-6386**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6386:6386`
- 数据与配置挂载：`./redis-cluster/redis-6386/data:/data`；`./redis-cluster/redis-6386/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6386 --requirepass 123456 --appendonly no`

- 顶层网络：`redis={"ipam":{"driver":"default","config":[{"subnet":"172.22.0.0/24"}]}}`

#### `Linux/redis/redis6.0.8/docker-compose-redis-master-slave-sentinel.yml`

**redis-master**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6380:6380`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/master/data:/data`；`./redis-master-slave-sentinel/redis/master/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6380 --requirepass 123456 --masterauth 123456 --appendonly no`

**redis-slave-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6381:6381`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/slave-1/data:/data`；`./redis-master-slave-sentinel/redis/slave-1/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6381 --requirepass 123456 --appendonly no --slaveof redis-master 6380 --masterauth 123456`

**redis-slave-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6382:6382`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/slave-2/data:/data`；`./redis-master-slave-sentinel/redis/slave-2/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6382 --requirepass 123456 --appendonly no --slaveof redis-master 6380 --masterauth 123456`

**redis-sentinel-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`26379:26379`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/redis-sentinel-1.conf:/etc/redis/sentinel.conf`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

**redis-sentinel-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`26380:26380`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/redis-sentinel-2.conf:/etc/redis/sentinel.conf`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`；`redis-sentinel-1`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

**redis-sentinel-3**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`26381:26381`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/redis-sentinel-3.conf:/etc/redis/sentinel.conf`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`；`redis-sentinel-1`；`redis-sentinel-2`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

- 顶层网络：`redis=（空）`

#### `Linux/redis/redis6.0.8/docker-compose-redis-master-slave.yml`

**master**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6380:6379`
- 数据与配置挂载：`./redis-master-slave/master/data:/data`；`./redis-master-slave/master/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no`

**slave1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6381:6379`
- 数据与配置挂载：`./redis-master-slave/slave-1/data:/data`；`./redis-master-slave/slave-1/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no --slaveof www.zhengqingya.com 6380 --masterauth 123456`

**slave2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6382:6379`
- 数据与配置挂载：`./redis-master-slave/slave-2/data:/data`；`./redis-master-slave/slave-2/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no --slaveof www.zhengqingya.com 6380 --masterauth 123456`

- 顶层网络：`redis=（空）`

#### `Linux/redis/redis6.0.8/docker-compose-redis.yml`

**redis**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:6.0.8`
- 端口：`6379:6379`
- 数据与配置挂载：`./redis/data:/data`；`./redis/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no`

#### `Linux/redis/redis7.0.5/01-单机/docker-compose-redis.yml`

**redis**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6379:6379`
- 数据与配置挂载：`./redis/data:/data`；`./redis/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no`

#### `Linux/redis/redis7.0.5/02-主从/docker-compose-redis-master-slave.yml`

**redis-master**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6380:6380`
- 数据与配置挂载：`./redis-master-slave/master/data:/data`；`./redis-master-slave/master/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6380 --requirepass 123456 --appendonly no`

**redis-slave1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6381:6381`
- 数据与配置挂载：`./redis-master-slave/slave-1/data:/data`；`./redis-master-slave/slave-1/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6381 --requirepass 123456 --appendonly no --slaveof redis-master 6380 --masterauth 123456`

**redis-slave2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6382:6382`
- 数据与配置挂载：`./redis-master-slave/slave-2/data:/data`；`./redis-master-slave/slave-2/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6382 --requirepass 123456 --appendonly no --slaveof redis-master 6380 --masterauth 123456`

- 顶层网络：`redis=（空）`

#### `Linux/redis/redis7.0.5/03-哨兵集群/docker-compose-redis-master-slave-sentinel.yml`

**redis-master**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6380:6380`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/master/data:/data`；`./redis-master-slave-sentinel/redis/master/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6380 --slave-announce-ip 172.16.16.88 --slave-announce-port 6380 --requirepass 123456 --masterauth 123456 --appendonly no`

**redis-slave-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6381:6381`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/slave-1/data:/data`；`./redis-master-slave-sentinel/redis/slave-1/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6381 --slave-announce-ip 172.16.16.88 --slave-announce-port 6381 --requirepass 123456 --appendonly no --slaveof 172.26.0.11 6380 --masterauth 123456`

**redis-slave-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6382:6382`
- 数据与配置挂载：`./redis-master-slave-sentinel/redis/slave-2/data:/data`；`./redis-master-slave-sentinel/redis/slave-2/config/redis.conf:/etc/redis/redis.conf`
- 依赖服务：`redis-master`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6382 --slave-announce-ip 172.16.16.88 --slave-announce-port 6382 --requirepass 123456 --appendonly no --slaveof 172.26.0.11 6380 --masterauth 123456`

**redis-sentinel-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`26379:26379`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/01:/etc/redis`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

**redis-sentinel-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`26380:26380`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/02:/etc/redis`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`；`redis-sentinel-1`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

**redis-sentinel-3**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`26381:26381`
- 数据与配置挂载：`./redis-master-slave-sentinel/sentinel/03:/etc/redis`
- 依赖服务：`redis-master`；`redis-slave-1`；`redis-slave-2`；`redis-sentinel-1`；`redis-sentinel-2`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-sentinel /etc/redis/sentinel.conf`

- 顶层网络：`redis={"ipam":{"driver":"default","config":[{"subnet":"172.26.0.0/24"}]}}`

#### `Linux/redis/redis7.0.5/04-分片集群/docker-compose-redis-cluster.yml`

**redis-6381**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6381:6381`
- 数据与配置挂载：`./redis-cluster/redis-6381/data:/data`；`./redis-cluster/redis-6381/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6381 --slave-announce-ip 172.16.16.88 --slave-announce-port 6381 --requirepass 123456 --appendonly no`

**redis-6382**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6382:6382`
- 数据与配置挂载：`./redis-cluster/redis-6382/data:/data`；`./redis-cluster/redis-6382/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6382 --slave-announce-ip 172.16.16.88 --slave-announce-port 6382 --requirepass 123456 --appendonly no`

**redis-6383**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6383:6383`
- 数据与配置挂载：`./redis-cluster/redis-6383/data:/data`；`./redis-cluster/redis-6383/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6383 --slave-announce-ip 172.16.16.88 --slave-announce-port 6383 --requirepass 123456 --appendonly no`

**redis-6384**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6384:6384`
- 数据与配置挂载：`./redis-cluster/redis-6384/data:/data`；`./redis-cluster/redis-6384/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6384 --slave-announce-ip 172.16.16.88 --slave-announce-port 6384 --requirepass 123456 --appendonly no`

**redis-6385**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6385:6385`
- 数据与配置挂载：`./redis-cluster/redis-6385/data:/data`；`./redis-cluster/redis-6385/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6385 --slave-announce-ip 172.16.16.88 --slave-announce-port 6385 --requirepass 123456 --appendonly no`

**redis-6386**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6386:6386`
- 数据与配置挂载：`./redis-cluster/redis-6386/data:/data`；`./redis-cluster/redis-6386/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6386 --slave-announce-ip 172.16.16.88 --slave-announce-port 6386 --requirepass 123456 --appendonly no`

**redis-6388**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6388:6388`
- 数据与配置挂载：`./redis-cluster/redis-6388/data:/data`；`./redis-cluster/redis-6388/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --port 6388 --slave-announce-ip 172.16.16.88 --slave-announce-port 6388 --requirepass 123456 --appendonly no`

- 顶层网络：`redis={"ipam":{"driver":"default","config":[{"subnet":"172.28.0.0/24"}]}}`

### MongoDB

#### `Linux/mongodb/4.4.6/docker-compose-mongodb.yml`

**mongodb**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mongo:4.4.6`
- 端口：`27017:27017`
- 数据与配置挂载：`./mongodb/db:/data/db`；`./mongodb/log:/data/log`
- 环境变量：`MONGO_INITDB_ROOT_USERNAME=admin`；`MONGO_INITDB_ROOT_PASSWORD=123456（示例凭据，部署前修改）`；`MONGO_DATA_DIR=/data/db`；`MONGO_LOG_DIR=/data/logs`

**adminmongo**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/adminmongo`
- 端口：`1234:1234`
- 依赖服务：`mongodb`
- 环境变量：`HOST=0.0.0.0`

- 顶层网络：`mongo=（空）`

#### `Linux/mongodb/7.0/docker-compose-mongodb.yml`

**mongodb**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mongo:7.0`
- 端口：`27017:27017`
- 数据与配置挂载：`./mongodb/db:/data/db`；`./mongodb/log:/data/log`
- 环境变量：`MONGO_INITDB_ROOT_USERNAME=admin`；`MONGO_INITDB_ROOT_PASSWORD=123456（示例凭据，部署前修改）`；`MONGO_DATA_DIR=/data/db`；`MONGO_LOG_DIR=/data/logs`

- 顶层网络：`mongo=（空）`

### PostgreSQL

#### `Linux/postgresql/docker-compose.yml`

**postgresql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/postgres:14.5`
- 端口：`5432:5432`
- 数据与配置挂载：`./postgresql/data:/var/lib/postgresql/data`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`POSTGRES_DB=postgres`；`POSTGRES_USER=postgres`；`POSTGRES_PASSWORD=123456（示例凭据，部署前修改）`；`ALLOW_IP_RANGE=0.0.0.0/0`

### Oracle 18c

#### `Linux/oracle18c/docker-compose-oracle18c.yml`

**oracle18c**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/oracle18c`
- 端口：`1521:1521`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Couchbase

#### `Linux/couchbase/docker-compose-couchbase.yml`

**couchbase**
- 镜像：`couchbase/server-sandbox:6.5.0`
- 端口：`8091-8094:8091-8094`；`11210:11210`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### MyCat

#### `Linux/mycat/docker-compose-mycat-web.yml`

**mycat-web**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mycat-web`
- 端口：`8082:8082`

- 顶层网络：`mycat-web={"driver":"bridge"}`

#### `Linux/mycat/docker-compose-mycat.yml`

**mycat**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mycat`
- 端口：`8066:8066`；`9066:9066`
- 数据与配置挂载：`./mycat/conf/schema.xml:/usr/local/mycat/conf/schema.xml`；`./mycat/conf/server.xml:/usr/local/mycat/conf/server.xml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

- 顶层网络：`mycat={"driver":"bridge"}`

### Canal

#### `Linux/canal/docker-compose-canal.yml`

**canal_admin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/canal-admin:v1.1.5`
- 端口：`8089:8089`
- 数据与配置挂载：`./canal/canal-admin/logs:/home/admin/canal-admin/logs`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`canal.adminUser=admin`；`canal.adminPasswd=123456（示例凭据，部署前修改）`；`spring.datasource.address=www.zhengqingya.com:3306`；`spring.datasource.database=canal_manager`；`spring.datasource.username=root`；`spring.datasource.password=root（示例凭据，部署前修改）`

**canal_server**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/canal-server:v1.1.5`
- 端口：`11110:11110`；`11111:11111`；`11112:11112`
- 数据与配置挂载：`./canal/canal-server/logs:/home/admin/canal-server/logs`
- 依赖服务：`canal_admin`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`canal.register.ip=www.zhengqingya.com`；`canal.admin.manager=canal_admin:8089`；`canal.admin.port=11110`；`canal.admin.user=admin`；`canal.admin.passwd=6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9（示例凭据，部署前修改）`

- 顶层网络：`canal=（空）`

### Seata

#### `Linux/seata/1.4.2/docker-compose-seata.yml`

**seata**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/seata-server:1.4.2`
- 端口：`8091:8091`
- 数据与配置挂载：`./seata/config:/root/seata-config`；`./seata/logs:/root/logs`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`SEATA_IP=www.zhengqingya.com`；`SEATA_PORT=8091`；`SEATA_CONFIG_NAME=file:/root/seata-config/registry`

- 顶层网络：`seata={"driver":"bridge"}`

#### `Linux/seata/1.5.2/docker-compose-seata.yml`

**seata**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/seata-server:1.5.2`
- 端口：`7091:7091`；`8091:8091`
- 数据与配置挂载：`./seata-server/resources/application.yml:/seata-server/resources/application.yml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`SEATA_IP=www.zhengqingya.com`；`SEATA_PORT=8091`

- 顶层网络：`seata={"driver":"bridge"}`

### Yearning

#### `Linux/yearning/docker-compose-yearning.yml`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3307:3306`
- 数据与配置挂载：`./yearning/mysql/my.cnf:/etc/mysql/my.cnf`；`./yearning/mysql/data:/var/lib/mysql`；`./yearning/mysql/conf.d:/etc/mysql/conf.d`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=Yearning`

**yearning**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/yearning`
- 端口：`8000:8000`
- 依赖服务：`mysql`
- 环境变量：`MYSQL_ADDR=www.zhengqingya.com:3307`；`MYSQL_USER=root`；`MYSQL_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DB=Yearning`

## 消息队列

### RabbitMQ

#### `Linux/rabbitmq/3.7.8-management/docker-compose-rabbitmq-3.7.8-management.yml`

**rabbitmq**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.7.8-management`
- 端口：`5672:5672`；`15672:15672`
- 数据与配置挂载：`./rabbitmq/data:/var/lib/rabbitmq`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`RABBITMQ_DEFAULT_VHOST=my_vhost`；`RABBITMQ_DEFAULT_USER=admin`；`RABBITMQ_DEFAULT_PASS=admin`

#### `Linux/rabbitmq/3.9.1-management-cluster-haproxy/docker-compose.yml`

**rabbitmq-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management`
- 端口：`5672:5672`；`15672:15672`
- 数据与配置挂载：`./rabbitmq-cluster/rabbitmq-1/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf`；`./rabbitmq-cluster/rabbitmq-1/data:/var/lib/rabbitmq`；`./rabbitmq-cluster/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez`；`./rabbitmq-cluster/.erlang.cookie:/var/lib/rabbitmq/.erlang.cookie`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

**rabbitmq-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management`
- 端口：`5673:5672`；`15673:15672`
- 数据与配置挂载：`./rabbitmq-cluster/rabbitmq-2/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf`；`./rabbitmq-cluster/rabbitmq-2/data:/var/lib/rabbitmq`；`./rabbitmq-cluster/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez`；`./rabbitmq-cluster/.erlang.cookie:/var/lib/rabbitmq/.erlang.cookie`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

**haproxy**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/haproxy:2.7.8`
- 端口：`8100:8100`；`5682:5672`；`15682:15672`
- 数据与配置挂载：`./haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg`
- 依赖服务：`rabbitmq-1`；`rabbitmq-2`
- 额外主机映射：`rabbitmq1:172.24.0.81`；`rabbitmq2:172.24.0.82`
- 环境变量：`TZ=Asia/Shanghai`

- 顶层网络：`rabbitmq={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/rabbitmq/3.9.1-management-cluster/docker-compose-rabbitmq-cluster.yml`

**rabbitmq-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management`
- 端口：`5672:5672`；`15672:15672`
- 数据与配置挂载：`./rabbitmq-cluster/rabbitmq-1/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf`；`./rabbitmq-cluster/rabbitmq-1/data:/var/lib/rabbitmq`；`./rabbitmq-cluster/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez`；`./rabbitmq-cluster/.erlang.cookie:/var/lib/rabbitmq/.erlang.cookie`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

**rabbitmq-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management`
- 端口：`5673:5672`
- 数据与配置挂载：`./rabbitmq-cluster/rabbitmq-2/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf`；`./rabbitmq-cluster/rabbitmq-2/data:/var/lib/rabbitmq`；`./rabbitmq-cluster/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez`；`./rabbitmq-cluster/.erlang.cookie:/var/lib/rabbitmq/.erlang.cookie`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

- 顶层网络：`rabbitmq={"driver":"bridge"}`

#### `Linux/rabbitmq/3.9.1-management/docker-compose-rabbitmq.yml`

**rabbitmq**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rabbitmq:3.9.1-management`
- 端口：`5672:5672`；`15672:15672`
- 数据与配置挂载：`./rabbitmq/config/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf`；`./rabbitmq/config/10-default-guest-user.conf:/etc/rabbitmq/conf.d/10-default-guest-user.conf`；`./rabbitmq/data:/var/lib/rabbitmq`；`./rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez:/opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-3.9.0.ez`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Kafka

#### `Linux/kafka/2.8.1/docker-compose-kafka.yml`

**zookepper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper`
- 端口：`2181:2181`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`

**kafka**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:2.13-2.8.1`
- 端口：`9092:9092`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 依赖服务：`zookepper`
- 环境变量：`KAFKA_ADVERTISED_HOST_NAME=www.zhengqingya.com`；`KAFKA_ADVERTISED_PORT=9092`；`KAFKA_BROKER_ID=0`；`KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://www.zhengqingya.com:9092`；`KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092`；`KAFKA_ZOOKEEPER_CONNECT=www.zhengqingya.com:2181`；`KAFKA_CREATE_TOPICS=hello_world`

**kafka-manager**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-manager`
- 端口：`9006:9000`
- 依赖服务：`kafka`
- 环境变量：`ZK_HOSTS=www.zhengqingya.com:2181`；`APPLICATION_SECRET=zhengqing（示例凭据，部署前修改）`；`KAFKA_MANAGER_AUTH_ENABLED=true`；`KAFKA_MANAGER_USERNAME=admin`；`KAFKA_MANAGER_PASSWORD=123456（示例凭据，部署前修改）`

#### `Linux/kafka/3.4.1-cluster-zookepper/docker-compose.yml`

**zookepper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper:latest`
- 端口：`2181:2181`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/zookeeper:/bitnami/zookeeper`
- 环境变量：`ALLOW_ANONYMOUS_LOGIN=true`

**kafka-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.4.1`
- 端口：`9093:9093`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-1:/bitnami/kafka`
- 依赖服务：`zookepper`
- 环境变量：`KAFKA_ENABLE_KRAFT=false`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_ZOOKEEPER_CONNECT=zookepper:2181`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT`；`KAFKA_CFG_BROKER_ID=1`；`KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://0.0.0.0:9093`；`KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-1:9092,EXTERNAL://host.docker.internal:9093`

**kafka-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.4.1`
- 端口：`9094:9094`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-2:/bitnami/kafka`
- 依赖服务：`zookepper`
- 环境变量：`KAFKA_ENABLE_KRAFT=false`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_ZOOKEEPER_CONNECT=zookepper:2181`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT`；`KAFKA_CFG_BROKER_ID=2`；`KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://0.0.0.0:9094`；`KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-2:9092,EXTERNAL://host.docker.internal:9094`

**kafka-map**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-map`
- 端口：`9006:8080`
- 数据与配置挂载：`./kafka/kafka-map/data:/usr/local/kafka-map/data`
- 依赖服务：`kafka-1`；`kafka-2`
- 环境变量：`DEFAULT_USERNAME=admin`；`DEFAULT_PASSWORD=123456（示例凭据，部署前修改）`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.22.6.0/24"}]}}`

#### `Linux/kafka/3.4.1/docker-compose-kafka.yml`

**zookepper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper:latest`
- 端口：`2181:2181`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 环境变量：`ALLOW_ANONYMOUS_LOGIN=true`

**kafka**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.4.1`
- 端口：`9092:9092`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 依赖服务：`zookepper`
- 环境变量：`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_ZOOKEEPER_CONNECT=zookepper:2181`；`KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://host.docker.internal:9092`

**kafka-map**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-map`
- 端口：`9006:8080`
- 数据与配置挂载：`./kafka/kafka-map/data:/usr/local/kafka-map/data`
- 依赖服务：`kafka`
- 环境变量：`DEFAULT_USERNAME=admin`；`DEFAULT_PASSWORD=123456（示例凭据，部署前修改）`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.22.6.0/24"}]}}`

#### `Linux/kafka/3.5.0-cluster-kraft/docker-compose.yml`

**kafka-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9092:9092`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-1:/bitnami/kafka`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx1g -Xms1g`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_PROCESS_ROLES=broker,controller`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=BROKER`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=BROKER:PLAINTEXT,CONTROLLER:PLAINTEXT`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9091,2@kafka-2:9091,3@kafka-3:9091`；`KAFKA_CFG_NODE_ID=1`；`KAFKA_CFG_BROKER_ID=1`；`KAFKA_CFG_LISTENERS=CONTROLLER://:9091,BROKER://0.0.0.0:9092`；`KAFKA_CFG_ADVERTISED_LISTENERS=BROKER://host.docker.internal:9092`

**kafka-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9093:9093`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-2:/bitnami/kafka`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx1g -Xms1g`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_PROCESS_ROLES=broker,controller`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=BROKER`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=BROKER:PLAINTEXT,CONTROLLER:PLAINTEXT`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9091,2@kafka-2:9091,3@kafka-3:9091`；`KAFKA_CFG_NODE_ID=2`；`KAFKA_CFG_BROKER_ID=2`；`KAFKA_CFG_LISTENERS=CONTROLLER://:9091,BROKER://0.0.0.0:9093`；`KAFKA_CFG_ADVERTISED_LISTENERS=BROKER://host.docker.internal:9093`

**kafka-3**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9094:9094`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-3:/bitnami/kafka`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx1g -Xms1g`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_PROCESS_ROLES=broker,controller`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=BROKER`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=BROKER:PLAINTEXT,CONTROLLER:PLAINTEXT`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9091,2@kafka-2:9091,3@kafka-3:9091`；`KAFKA_CFG_NODE_ID=3`；`KAFKA_CFG_BROKER_ID=3`；`KAFKA_CFG_LISTENERS=CONTROLLER://:9091,BROKER://0.0.0.0:9094`；`KAFKA_CFG_ADVERTISED_LISTENERS=BROKER://host.docker.internal:9094`

**kafka-broker**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9095:9095`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/kafka-broker:/bitnami/kafka`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx1g -Xms1g`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_PROCESS_ROLES=broker`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=BROKER`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=BROKER:PLAINTEXT,CONTROLLER:PLAINTEXT`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9091,2@kafka-2:9091,3@kafka-3:9091`；`KAFKA_CFG_NODE_ID=4`；`KAFKA_CFG_BROKER_ID=4`；`KAFKA_CFG_LISTENERS=BROKER://:9095`；`KAFKA_CFG_ADVERTISED_LISTENERS=BROKER://host.docker.internal:9095`

**kafka-map**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-map`
- 端口：`9006:8080`
- 数据与配置挂载：`./kafka/kafka-map/data:/usr/local/kafka-map/data`
- 依赖服务：`kafka-1`；`kafka-2`；`kafka-3`；`kafka-broker`
- 环境变量：`DEFAULT_USERNAME=admin`；`DEFAULT_PASSWORD=123456（示例凭据，部署前修改）`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.22.6.0/24"}]}}`

#### `Linux/kafka/3.5.0-cluster-zookepper/docker-compose.yml`

**zookeeper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper:latest`
- 端口：`2181:2181`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./config/zookeeper_jaas.conf:/opt/bitnami/zookeeper/conf/zookeeper_jaas.conf`
- 环境变量：`ALLOW_ANONYMOUS_LOGIN=false`；`ZOO_SERVER_USERS=admin`；`ZOO_SERVER_PASSWORDS=admin-secret（示例凭据，部署前修改）`；`ZOO_ENABLE_AUTH=yes`；`ZOO_AUTH_PROVIDER_1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider`；`JVMFLAGS=-Djava.security.auth.login.config=/opt/bitnami/zookeeper/conf/zookeeper_jaas.conf -Dzookeeper.authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider`

**kafka-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9093:9093`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./config/kafka_jaas.conf:/opt/bitnami/kafka/config/kafka_jaas.conf`；`./config/producer-admin.properties:/opt/bitnami/kafka/config/producer-admin.properties`；`./config/consumer-admin.properties:/opt/bitnami/kafka/config/consumer-admin.properties`；`./config/consumer-test.properties:/opt/bitnami/kafka/config/consumer-test.properties`
- 依赖服务：`zookeeper`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx512m -Xms512m`；`KAFKA_ENABLE_KRAFT=no`；`KAFKA_CFG_PROCESS_ROLES=`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181`；`KAFKA_ZOOKEEPER_PROTOCOL=SASL`；`KAFKA_ZOOKEEPER_USER=admin`；`KAFKA_ZOOKEEPER_PASSWORD=admin-secret（示例凭据，部署前修改）`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:SASL_PLAINTEXT`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL`；`KAFKA_CFG_ALLOW_EVERYONE_IF_NO_ACL_FOUND=true`；`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=false`；`KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=2`；`KAFKA_CFG_ALLOW_AUTO_CREATE_TOPICS=false`；`KAFKA_CFG_GROUP_INITIAL_REBALANCE_DELAY_MS=5000`；`KAFKA_CFG_AUTHORIZER_CLASS_NAME=kafka.security.authorizer.AclAuthorizer`；`KAFKA_CFG_SUPER_USERS=User:admin`；`KAFKA_CFG_SASL_ENABLED_MECHANISMS=SCRAM-SHA-256`；`KAFKA_CLIENT_USERS=admin`；`KAFKA_CLIENT_PASSWORDS=admin-secret（示例凭据，部署前修改）`；`KAFKA_CFG_LISTENER_NAME_EXTERNAL_SASL_ENABLED_MECHANISMS=SCRAM-SHA-256`；`KAFKA_CFG_LISTENER_NAME_INTERNAL_SASL_ENABLED_MECHANISMS=`；`KAFKA_OPTS=-Djava.security.auth.login.config=/opt/bitnami/kafka/config/kafka_jaas.conf`；`KAFKA_CFG_BROKER_ID=1`；`KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://0.0.0.0:9093`；`KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-1:9092,EXTERNAL://host.docker.internal:9093`

**kafka-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9094:9094`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./config/kafka_jaas.conf:/opt/bitnami/kafka/config/kafka_jaas.conf`；`./config/producer-admin.properties:/opt/bitnami/kafka/config/producer-admin.properties`；`./config/consumer-admin.properties:/opt/bitnami/kafka/config/consumer-admin.properties`；`./config/consumer-test.properties:/opt/bitnami/kafka/config/consumer-test.properties`
- 依赖服务：`zookeeper`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx512m -Xms512m`；`KAFKA_ENABLE_KRAFT=no`；`KAFKA_CFG_PROCESS_ROLES=`；`ALLOW_PLAINTEXT_LISTENER=true`；`KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181`；`KAFKA_ZOOKEEPER_PROTOCOL=SASL`；`KAFKA_ZOOKEEPER_USER=admin`；`KAFKA_ZOOKEEPER_PASSWORD=admin-secret（示例凭据，部署前修改）`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:SASL_PLAINTEXT`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL`；`KAFKA_CFG_ALLOW_EVERYONE_IF_NO_ACL_FOUND=true`；`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=false`；`KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=2`；`KAFKA_CFG_ALLOW_AUTO_CREATE_TOPICS=false`；`KAFKA_CFG_GROUP_INITIAL_REBALANCE_DELAY_MS=5000`；`KAFKA_CFG_AUTHORIZER_CLASS_NAME=kafka.security.authorizer.AclAuthorizer`；`KAFKA_CFG_SUPER_USERS=User:admin`；`KAFKA_CFG_SASL_ENABLED_MECHANISMS=SCRAM-SHA-256`；`KAFKA_CLIENT_USERS=admin`；`KAFKA_CLIENT_PASSWORDS=admin-secret（示例凭据，部署前修改）`；`KAFKA_CFG_LISTENER_NAME_EXTERNAL_SASL_ENABLED_MECHANISMS=SCRAM-SHA-256`；`KAFKA_CFG_LISTENER_NAME_INTERNAL_SASL_ENABLED_MECHANISMS=`；`KAFKA_OPTS=-Djava.security.auth.login.config=/opt/bitnami/kafka/config/kafka_jaas.conf`；`KAFKA_CFG_BROKER_ID=2`；`KAFKA_CFG_LISTENERS=INTERNAL://:9092,EXTERNAL://0.0.0.0:9094`；`KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-2:9092,EXTERNAL://host.docker.internal:9094`

**kafka-map**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-map`
- 端口：`9006:8080`
- 数据与配置挂载：`./config/kafka_client.properties:/kafka_client.properties`；`./kafka/kafka-map/data:/usr/local/kafka-map/data`
- 依赖服务：`kafka-1`；`kafka-2`
- 环境变量：`DEFAULT_USERNAME=admin`；`DEFAULT_PASSWORD=123456（示例凭据，部署前修改）`

**kafka-console-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-console-ui`
- 端口：`7766:7766`
- 数据与配置挂载：`./kafka-console-ui/data:/app/data`；`./kafka-console-ui/log:/app/log`
- 依赖服务：`kafka-1`；`kafka-2`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.12.6.0/24"}]}}`

#### `Linux/kafka/3.5.0-kraft/docker-compose.yml`

**kafka**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:3.5.0`
- 端口：`9092:9092`；`9093:9093`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 环境变量：`KAFKA_HEAP_OPTS=-Xmx1g -Xms1g`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_CFG_NODE_ID=1`；`KAFKA_CFG_PROCESS_ROLES=broker,controller`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT`；`KAFKA_CFG_LISTENERS=CONTROLLER://:9093,EXTERNAL://0.0.0.0:9092`；`KAFKA_CFG_ADVERTISED_LISTENERS=EXTERNAL://host.docker.internal:9092`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=EXTERNAL`；`ALLOW_PLAINTEXT_LISTENER=yes`；`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true`

**kafka-console-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-console-ui`
- 端口：`7766:7766`
- 数据与配置挂载：`./kafka-console-ui/data:/app/data`
- 依赖服务：`kafka`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.12.6.0/24"}]}}`

#### `Linux/kafka/4.0.0-kraft-sasl-scram/docker-compose.yml`

**kafka**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:4.0.0`
- 端口：`9092:9092`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`；`./kafka/config/kafka_jaas.conf:/opt/bitnami/kafka/config/kafka_jaas.conf`；`./kafka/config/admin.properties:/opt/bitnami/kafka/config/admin.properties`
- 环境变量：`TZ=Asia/Shanghai`；`KAFKA_HEAP_OPTS=-Xmx512m -Xms512m`；`KAFKA_OPTS= -Djava.security.auth.login.config=/opt/bitnami/kafka/config/kafka_jaas.conf`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_CFG_NODE_ID=0`；`KAFKA_CFG_PROCESS_ROLES=broker,controller`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`KAFKA_CFG_LISTENERS=SASL_PLAINTEXT://:9092,CONTROLLER://:9093`；`KAFKA_CFG_ADVERTISED_LISTENERS=SASL_PLAINTEXT://host.docker.internal:9092`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:SASL_PLAINTEXT,SASL_PLAINTEXT:SASL_PLAINTEXT`；`KAFKA_CFG_SASL_ENABLED_MECHANISMS=SCRAM-SHA-256`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_SASL_MECHANISM_CONTROLLER_PROTOCOL=SCRAM-SHA-256`；`KAFKA_CONTROLLER_USER=admin`；`KAFKA_CONTROLLER_PASSWORD=123456（示例凭据，部署前修改）`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=SASL_PLAINTEXT`；`KAFKA_CFG_SASL_MECHANISM_INTER_BROKER_PROTOCOL=SCRAM-SHA-256`；`KAFKA_INTER_BROKER_USER=admin`；`KAFKA_INTER_BROKER_PASSWORD=123456（示例凭据，部署前修改）`；`KAFKA_CLIENT_USERS=test,test2`；`KAFKA_CLIENT_PASSWORDS=123456,123456（示例凭据，部署前修改）`；`KAFKA_CFG_SSL_ENDPOINT_IDENTIFICATION_ALGORITHM=`；`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true`；`KAFKA_CFG_AUTHORIZER_CLASS_NAME=org.apache.kafka.metadata.authorizer.StandardAuthorizer`；`KAFKA_CFG_ALLOW_EVERYONE_IF_NO_ACL_FOUND=false`；`KAFKA_CFG_SUPER_USERS=User:admin`

**kafka-console-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-console-ui`
- 端口：`7766:7766`
- 数据与配置挂载：`./kafka-console-ui/data:/app/data`
- 依赖服务：`kafka`
- 环境变量：`TZ=Asia/Shanghai`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.12.6.0/24"}]}}`

#### `Linux/kafka/4.0.0-kraft-sasl/docker-compose.yml`

**kafka**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka:4.0.0`
- 端口：`9092:9092`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 环境变量：`TZ=Asia/Shanghai`；`KAFKA_HEAP_OPTS=-Xmx512m -Xms512m`；`KAFKA_ENABLE_KRAFT=true`；`KAFKA_CFG_NODE_ID=0`；`KAFKA_CFG_PROCESS_ROLES=controller,broker`；`KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093`；`KAFKA_KRAFT_CLUSTER_ID=abcdefghijklmnopqrstuv`；`KAFKA_CFG_LISTENERS=SASL_PLAINTEXT://:9092,CONTROLLER://:9093`；`KAFKA_CFG_ADVERTISED_LISTENERS=SASL_PLAINTEXT://host.docker.internal:9092`；`KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,SASL_PLAINTEXT:SASL_PLAINTEXT`；`KAFKA_CFG_SASL_ENABLED_MECHANISMS=PLAIN`；`KAFKA_CFG_LISTENER_NAME_EXTERNAL_SASL_ENABLED_MECHANISMS=PLAIN`；`KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER`；`KAFKA_CFG_SASL_MECHANISM_CONTROLLER_PROTOCOL=PLAIN`；`KAFKA_CONTROLLER_USER=admin`；`KAFKA_CONTROLLER_PASSWORD=123456（示例凭据，部署前修改）`；`KAFKA_CFG_INTER_BROKER_LISTENER_NAME=SASL_PLAINTEXT`；`KAFKA_CFG_SASL_MECHANISM_INTER_BROKER_PROTOCOL=PLAIN`；`KAFKA_INTER_BROKER_USER=admin`；`KAFKA_INTER_BROKER_PASSWORD=123456（示例凭据，部署前修改）`；`KAFKA_CLIENT_USERS=test`；`KAFKA_CLIENT_PASSWORDS=123456（示例凭据，部署前修改）`；`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true`

**kafka-console-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-console-ui`
- 端口：`7766:7766`
- 数据与配置挂载：`./kafka-console-ui/data:/app/data`
- 依赖服务：`kafka`
- 环境变量：`TZ=Asia/Shanghai`

- 顶层网络：`kafka={"ipam":{"driver":"default","config":[{"subnet":"172.12.6.0/24"}]}}`

#### `Linux/kafka/kafka-eagle/docker-compose.yml`

**efak**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kafka-efak:3.0.1`
- 端口：`8048:8048`
- 数据与配置挂载：`/etc/localtime:/etc/localtime`
- 环境变量：`EFAK_CLUSTER_ZK_LIST=172.16.16.88:2181`

### RocketMQ

#### `Linux/rocketmq/4.5.2/docker-compose-rocketmq.yml`

**rocketmq_server**
- 镜像：`foxiswho/rocketmq:server`
- 端口：`9876:9876`
- 数据与配置挂载：`./rocketmq/rocketmq_server/logs:/opt/logs`；`./rocketmq/rocketmq_server/store:/opt/store`

**rocketmq_broker**
- 镜像：`foxiswho/rocketmq:broker`
- 端口：`10909:10909`；`10911:10911`
- 数据与配置挂载：`./rocketmq/rocketmq_broker/logs:/opt/logs`；`./rocketmq/rocketmq_broker/store:/opt/store`；`./rocketmq/rocketmq_broker/conf/broker.conf:/etc/rocketmq/broker.conf`
- 依赖服务：`rocketmq_server`
- 环境变量：`NAMESRV_ADDR=rocketmq_server:9876`；`JAVA_OPTS= -Duser.home=/opt`；`JAVA_OPT_EXT=-server -Xms128m -Xmx128m -Xmn128m`
- 启动参数：`mqbroker -c /etc/rocketmq/broker.conf`

**rocketmq_console_ng**
- 镜像：`styletang/rocketmq-console-ng`
- 端口：`9002:8080`
- 依赖服务：`rocketmq_server`
- 环境变量：`JAVA_OPTS=-Drocketmq.namesrv.addr=rocketmq_server:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false`

- 顶层网络：`rocketmq={"name":"rocketmq","driver":"bridge"}`

#### `Linux/rocketmq/5.1.3/docker-compose.yml`

**rocketmq_server**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rocketmq:5.1.3`
- 端口：`9876:9876`
- 数据与配置挂载：`./rocketmq/rocketmq_server/logs:/home/rocketmq/logs`
- 环境变量：`JAVA_OPT_EXT=-Duser.home=/home/rocketmq -Xms256M -Xmx256M -Xmn128m`
- 启动参数：`["sh","mqnamesrv"]`

**rocketmq_broker**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rocketmq:5.1.3`
- 端口：`10909:10909`；`10911:10911`
- 数据与配置挂载：`./rocketmq/rocketmq_broker/logs:/home/logs`；`./rocketmq/rocketmq_broker/store:/home/store`；`./rocketmq/rocketmq_broker/conf/broker.conf:/home/rocketmq/broker.conf`
- 依赖服务：`rocketmq_server`
- 环境变量：`NAMESRV_ADDR=rocketmq_server:9876`；`JAVA_OPT_EXT=-Duser.home=/home/rocketmq -server -Xms128m -Xmx128m -Xmn128m`
- 启动参数：`["sh","mqbroker","-c","/home/rocketmq/broker.conf","autoCreateTopicEnable=true"]`

**rocketmq_dashboard**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rocketmq-dashboard:1.0.0`
- 端口：`9002:8080`
- 依赖服务：`rocketmq_server`
- 环境变量：`JAVA_OPTS=-Drocketmq.namesrv.addr=rocketmq_server:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false`

- 顶层网络：`rocketmq={"ipam":{"driver":"default","config":[{"subnet":"172.23.0.0/24"}]}}`

### ActiveMQ

#### `Linux/activemq/docker-compose-activemq.yml`

**activemq**
- 镜像：`webcenter/activemq`
- 端口：`61613:61613`；`61616:61616`；`8161:8161`
- 数据与配置挂载：`/etc/localtime:/etc/localtime:ro`；`./activemq/data/activemq:/data/activemq`；`./activemq/var/log/activemq:/var/log/activemq`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`ACTIVEMQ_ADMIN_LOGIN=admin`；`ACTIVEMQ_ADMIN_PASSWORD=admin（示例凭据，部署前修改）`；`ACTIVEMQ_CONFIG_MINMEMORY=512`；`ACTIVEMQ_CONFIG_MAXMEMORY=2048`

### Pulsar

#### `Linux/pulsar/3.1.2/docker-compose.yml`

**pulsar**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/pulsar:3.1.2`
- 端口：`6650:6650`；`8080:8080`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`BOOKIE_MEM=-Xms512m -Xmx512m -XX:MaxDirectMemorySize=256m`
- 启动参数：`/bin/bash -c  "bin/apply-config-from-env.py conf/standalone.conf && exec bin/pulsar standalone --advertised-address 172.16.20.188" `

**dashboard**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/pulsar-dashboard`
- 端口：`81:80`
- 依赖服务：`pulsar`
- 环境变量：`SERVICE_URL=http://pulsar-standalone:8080`

**pulsar-manager**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/pulsar-manager:v0.2.0`
- 端口：`9527:9527`；`7750:7750`
- 依赖服务：`pulsar`
- 环境变量：`SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties`

- 顶层网络：`pulsar={"ipam":{"driver":"default","config":[{"subnet":"172.31.0.0/24"}]}}`

## 日志与可观测

### Elasticsearch

#### `Linux/elasticsearch/7.14.0/docker-compose-elasticsearch.yml`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.0`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/data:/usr/share/elasticsearch/data`；`./elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**kibana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kibana:7.14.0`
- 端口：`5601:5601`
- 数据与配置挂载：`./elasticsearch/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml`
- 依赖服务：`elasticsearch`

- 顶层网络：`es=（空）`

#### `Linux/elasticsearch/7.14.1/docker-compose-elasticsearch.yml`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/data:/usr/share/elasticsearch/data`；`./elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**kibana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kibana:7.14.1`
- 端口：`5601:5601`
- 数据与配置挂载：`./elasticsearch/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml`
- 依赖服务：`elasticsearch`

- 顶层网络：`es=（空）`

### ELK

#### `Linux/elk/docker-compose-elk.yml`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elk/elasticsearch/data:/usr/share/elasticsearch/data`；`./elk/elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elk/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**kibana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kibana:7.14.1`
- 端口：`5601:5601`
- 数据与配置挂载：`./elk/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml`
- 依赖服务：`elasticsearch`

**logstash**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/logstash:7.14.1`
- 端口：`9600:9600`；`1218:1218`；`20010:20010`；`20030:20030`；`20040:20040`
- 数据与配置挂载：`./elk/logstash/data:/usr/share/logstash/data`；`./elk/logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml`；`./elk/logstash/config/small-tools:/usr/share/logstash/config/small-tools`
- 依赖服务：`elasticsearch`
- 环境变量：`LS_JAVA_OPTS=-Xmx512m -Xms512m`
- 启动参数：`logstash -f /usr/share/logstash/config/small-tools`

- 顶层网络：`elk=（空）`

### EFK

#### `Linux/efk/docker-compose.yml`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./app/elasticsearch/data:/usr/share/elasticsearch/data`；`./app/elasticsearch/logs:/usr/share/elasticsearch/logs`；`./app/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**kibana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kibana:7.14.1`
- 端口：`5601:5601`
- 数据与配置挂载：`./app/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml`
- 依赖服务：`elasticsearch`

**filebeat**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/filebeat:7.14.1`
- 数据与配置挂载：`./app/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml`；`./app/filebeat/logs:/usr/share/filebeat/logs`；`./app/filebeat/my-log:/usr/share/filebeat/my-log`
- 依赖服务：`elasticsearch`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

- 顶层网络：`efk=（空）`

### ELKF

#### `Linux/elkf/docker-compose.yml`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./app/elasticsearch/data:/usr/share/elasticsearch/data`；`./app/elasticsearch/logs:/usr/share/elasticsearch/logs`；`./app/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**kibana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/kibana:7.14.1`
- 端口：`5601:5601`
- 数据与配置挂载：`./app/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml`
- 依赖服务：`elasticsearch`

**logstash**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/logstash:7.14.1`
- 端口：`9600:9600`；`5044:5044`
- 数据与配置挂载：`./app/logstash/data:/usr/share/logstash/data`；`./app/logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml`；`./app/logstash/config/test:/usr/share/logstash/config/test`
- 依赖服务：`elasticsearch`
- 环境变量：`LS_JAVA_OPTS=-Xmx512m -Xms512m`
- 启动参数：`logstash -f /usr/share/logstash/config/test`

**filebeat**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/filebeat:7.14.1`
- 数据与配置挂载：`./app/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml`；`./app/filebeat/logs:/usr/share/filebeat/logs`；`./app/filebeat/my-log:/usr/share/filebeat/my-log`
- 依赖服务：`elasticsearch`；`logstash`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

- 顶层网络：`elkf=（空）`

### Filebeat

#### `Linux/filebeat/docker-compose-filebeat.yml`

**filebeat**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/filebeat:7.14.1`
- 数据与配置挂载：`./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml`；`./filebeat/logs:/usr/share/filebeat/logs`；`./filebeat/my-log:/usr/share/filebeat/my-log`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Graylog

#### `Linux/graylog/docker-compose-graylog.yml`

**mongo**
- 镜像：`mongo:3`

**elasticsearch**
- 镜像：`elasticsearch`
- 环境变量：`http.host=0.0.0.0`；`transport.host=localhost`；`network.host=0.0.0.0`；`ES_JAVA_OPTS=-Xms512m -Xmx512m`

**graylog**
- 镜像：`graylog/graylog:3.3`
- 端口：`9001:9000`；`1514:1514`；`1514:1514/udp`；`12201:12201`；`12201:12201/udp`
- 依赖服务：`mongo`；`elasticsearch`
- 环境变量：`GRAYLOG_PASSWORD_SECRET=somepasswordpepper（示例凭据，部署前修改）`；`GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918（示例凭据，部署前修改）`；`GRAYLOG_HTTP_EXTERNAL_URI=http://www.zhengqingya.com:9001/`

- 顶层网络：`graylog={"driver":"bridge"}`

### Grafana Loki

#### `Linux/grafana_promtail_loki/docker-compose.yml`

**loki**
- 镜像：`grafana/loki:latest`
- 端口：`3100:3100`
- 数据与配置挂载：`./grafana_promtail_loki/loki:/etc/loki`
- 启动参数：`-config.file=/etc/loki/loki-local-config.yaml`

**promtail**
- 镜像：`grafana/promtail:latest`
- 数据与配置挂载：`./grafana_promtail_loki/logs:/var/logs`；`./grafana_promtail_loki/promtail:/etc/promtail`
- 启动参数：`-config.file=/etc/promtail/promtail-docker-config.yaml`

**grafana**
- 镜像：`grafana/grafana:latest`
- 端口：`3000:3000`
- 数据与配置挂载：`./grafana_promtail_loki/grafana/data:/var/lib/grafana`；`./grafana_promtail_loki/grafana/log:/var/log/grafana`
- 环境变量：`GF_EXPLORE_ENABLED=true`

- 顶层网络：`loki=（空）`

### PlumeLog

#### `Linux/plumelog/docker-compose.yml`

**plumelog**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/plumelog:3.5.3`
- 端口：`8891:8891`
- 数据与配置挂载：`./app/plumelog/application.properties:/home/application.properties`
- 依赖服务：`elasticsearch`；`redis`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`JAVA_OPTS=-XX:+UseG1GC -Dspring.config.location=/home/application.properties,classpath:application.properties,`；`plumelog.queue.redis.redisHost=172.23.0.33:6379`；`plumelog.queue.redis.redisPassWord=123456（示例凭据，部署前修改）`；`plumelog.queue.redis.redisDb=10`；`plumelog.es.esHosts=172.23.0.22:9200`；`plumelog.es.userName=elastic`；`plumelog.es.passWord=123456（示例凭据，部署前修改）`；`login.username=admin`；`login.password=admin（示例凭据，部署前修改）`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./app/elasticsearch/data:/usr/share/elasticsearch/data`；`./app/elasticsearch/logs:/usr/share/elasticsearch/logs`；`./app/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=123456（示例凭据，部署前修改）`

**redis**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/redis:7.0.5`
- 端口：`6379:6379`
- 数据与配置挂载：`./app/redis/data:/data`；`./app/redis/config/redis.conf:/etc/redis/redis.conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 启动参数：`redis-server /etc/redis/redis.conf --requirepass 123456 --appendonly no`

- 顶层网络：`plumelog={"ipam":{"driver":"default","config":[{"subnet":"172.23.0.0/24"}]}}`

### Zipkin

#### `Linux/zipkin/docker-compose-zipkin.yml`

**zipkin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zipkin:2`
- 端口：`9411:9411`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`STORAGE_TYPE=mysql`；`MYSQL_HOST=host.docker.internal`；`MYSQL_TCP_PORT=3306`；`MYSQL_DB=zipkin`；`MYSQL_USER=root`；`MYSQL_PASS=root`

### Prometheus

#### `Linux/prometheus/v2.34.0-prometheus-grafana-java-linux/docker-compose-prometheus.yml`

**prometheus**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/prometheus:v2.34.0`
- 端口：`9090:9090`
- 数据与配置挂载：`./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
- 依赖服务：`node-exporter`
- 启动参数：`--config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus`

**node-exporter**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/node-exporter:v1.3.1`
- 端口：`9100:9100`

**grafana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/grafana:8.0.0`
- 端口：`3000:3000`
- 数据与配置挂载：`./prometheus/grafana/grafana.ini:/etc/grafana/grafana.ini`
- 依赖服务：`prometheus`
- 环境变量：`GF_EXPLORE_ENABLED=true`；`GF_SECURITY_ADMIN_PASSWORD=admin（示例凭据，部署前修改）`；`GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource,alexanderzobnin-zabbix-app`；`GF_DATABASE_URL=mysql://root:root@www.zhengqingya.com:3306/grafana`

- 顶层网络：`prometheus={"ipam":{"driver":"default","config":[{"subnet":"172.22.0.0/24"}]}}`

#### `Linux/prometheus/v3.11.2-prometheus-grafana-java/docker-compose.yml`

**prometheus**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/prometheus:v3.11.2`
- 端口：`9090:9090`
- 数据与配置挂载：`./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro`
- 启动参数：`["--config.file=/etc/prometheus/prometheus.yml","--storage.tsdb.path=/prometheus","--web.enable-lifecycle"]`

**grafana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/grafana:13.0`
- 端口：`3000:3000`
- 数据与配置挂载：`./grafana/provisioning:/etc/grafana/provisioning:ro`；`./grafana/dashboards:/var/lib/grafana/dashboards:ro`
- 依赖服务：`prometheus`
- 环境变量：`GF_SECURITY_ADMIN_USER=admin`；`GF_SECURITY_ADMIN_PASSWORD=admin（示例凭据，部署前修改）`；`GF_USERS_ALLOW_SIGN_UP=false`；`GF_USERS_DEFAULT_LANGUAGE=zh-Hans`

- 顶层网络：`monitor={"driver":"bridge"}`

#### `Linux/prometheus/v3.11.2-prometheus-grafana-otel/docker-compose.yml`

**prometheus**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/prometheus:v3.11.2`
- 端口：`9090:9090`
- 数据与配置挂载：`./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro`
- 启动参数：`["--config.file=/etc/prometheus/prometheus.yml","--storage.tsdb.path=/prometheus","--web.enable-lifecycle"]`

**grafana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/grafana:13.0`
- 端口：`3000:3000`
- 数据与配置挂载：`./grafana/provisioning:/etc/grafana/provisioning:ro`；`./grafana/dashboards:/var/lib/grafana/dashboards:ro`
- 依赖服务：`prometheus`
- 环境变量：`GF_SECURITY_ADMIN_USER=admin`；`GF_SECURITY_ADMIN_PASSWORD=admin（示例凭据，部署前修改）`；`GF_USERS_ALLOW_SIGN_UP=false`；`GF_USERS_DEFAULT_LANGUAGE=zh-Hans`

- 顶层网络：`monitor={"driver":"bridge"}`

### Grafana

#### `Linux/grafana/docker-compose-grafana.yml`

**grafana**
- 镜像：`grafana/grafana:master`
- 端口：`3000:3000`
- 数据与配置挂载：`./grafana/data:/var/lib/grafana`；`./grafana/log:/var/log/grafana`

### SkyWalking

#### `Linux/skywalking/10.4.0-banyandb-lite-otel/docker-compose.yml`

**banyandb**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-banyandb:0.10.1`
- 端口：`17912:17912`
- 环境变量：`TZ=Asia/Shanghai`
- 启动参数：`["standalone"]`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:10.4.0`
- 端口：`11800:11800`；`12800:12800`；`9411:9411`
- 数据与配置挂载：`./otel-rules/jvm-otel.yaml:/skywalking/config/otel-rules/jvm-otel.yaml:ro`
- 依赖服务：`banyandb`
- 环境变量：`TZ=Asia/Shanghai`；`SW_STORAGE=banyandb`；`SW_STORAGE_BANYANDB_TARGETS=banyandb:17912`；`SW_OTEL_RECEIVER=default`；`SW_OTEL_RECEIVER_ENABLED_HANDLERS=otlp-metrics,otlp-traces,otlp-logs`；`SW_OTEL_RECEIVER_ENABLED_OTEL_METRICS_RULES=apisix,nginx/*,k8s/*,istio-controlplane,vm,mysql/*,postgresql/*,oap,aws-eks/*,windows,aws-s3/*,aws-dynamodb/*,aws-gateway/*,redis/*,elasticsearch/*,rabbitmq/*,mongodb/*,kafka/*,pulsar/*,bookkeeper/*,rocketmq/*,clickhouse/*,activemq/*,kong/*,flink/*,banyandb/*,jvm-otel`；`SW_ENABLE_UPDATE_UI_TEMPLATE=true`；`SW_RECEIVER_ZIPKIN=default`；`SW_QUERY_ZIPKIN=default`；`JAVA_OPTS=-Xms512m -Xmx512m`

**otel-collector**
- 镜像：`otel/opentelemetry-collector-contrib:0.117.0`
- 端口：`4317:4317`；`4318:4318`；`13133:13133`
- 数据与配置挂载：`./otel-collector/config.yaml:/etc/otelcol-contrib/config.yaml:ro`
- 依赖服务：`oap={"condition":"service_healthy"}`
- 环境变量：`TZ=Asia/Shanghai`
- 启动参数：`["--config=/etc/otelcol-contrib/config.yaml"]`

**ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:10.4.0`
- 端口：`18080:8080`
- 依赖服务：`oap={"condition":"service_healthy"}`
- 环境变量：`TZ=Asia/Shanghai`；`SW_SERVER_PORT=8080`；`SW_OAP_ADDRESS=http://oap:12800`；`SW_ZIPKIN_ADDRESS=http://oap:9412`

#### `Linux/skywalking/10.4.0-banyandb-lite/docker-compose.yml`

**banyandb**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-banyandb:0.10.1`
- 端口：`17912:17912`；`17913:17913`
- 环境变量：`TZ=Asia/Shanghai`
- 启动参数：`["standalone"]`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:10.4.0`
- 端口：`11800:11800`；`12800:12800`；`9090:9090`
- 依赖服务：`banyandb`
- 环境变量：`TZ=Asia/Shanghai`；`SW_STORAGE=banyandb`；`SW_STORAGE_BANYANDB_TARGETS=172.24.0.83:17912`；`JAVA_OPTS=-Xms512m -Xmx512m`；`SW_STORAGE_BANYANDB_MAX_BULK_SIZE=2000`；`SW_STORAGE_BANYANDB_FLUSH_INTERVAL=15`；`SW_STORAGE_BANYANDB_METRICS_SHARDS_NUMBER=1`；`SW_STORAGE_BANYANDB_RECORD_SHARDS_NUMBER=1`；`SW_STORAGE_BANYANDB_CONCURRENT_WRITE_THREADS=4`

**ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:10.4.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`TZ=Asia/Shanghai`；`SW_SERVER_PORT=8080`；`SW_OAP_ADDRESS=http://172.24.0.81:12800`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/8.0.25-mysql/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:8.9.0`
- 端口：`11800:11800`；`12800:12800`
- 数据与配置挂载：`./skywalking/mysql-connector-java-8.0.28.jar:/skywalking/oap-libs/mysql-connector-java-8.0.28.jar`
- 依赖服务：`mysql`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2G -Xms2G`；`SW_STORAGE=mysql`；`SW_JDBC_URL=jdbc:mysql://172.24.0.83:3306/skywalking?rewriteBatchedStatements=true&allowMultiQueries=true&useSSL=false`；`SW_DATA_SOURCE_USER=root`；`SW_DATA_SOURCE_PASSWORD=root（示例凭据，部署前修改）`

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:8.9.0`
- 端口：`8888:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://oap:12800`；`TZ=Asia/Shanghai`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3308:3306`
- 数据与配置挂载：`./skywalking/mysql/my.cnf:/etc/mysql/my.cnf`；`./skywalking/mysql/data:/var/lib/mysql`；`./skywalking/mysql/log/mysql/error.log:/var/log/mysql/error.log`；`./skywalking/mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=skywalking`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/8.9.0-es/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:8.9.0`
- 端口：`11800:11800`；`12800:12800`
- 依赖服务：`elasticsearch`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=elasticsearch`；`SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200`；`SW_ES_USER=elastic`；`SW_ES_PASSWORD=elastic123456（示例凭据，部署前修改）`
- 权限与网络：启用了 privileged

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:8.9.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`
- 权限与网络：启用了 privileged

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/data:/usr/share/elasticsearch/data`；`./elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=elastic123456（示例凭据，部署前修改）`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.2.0-es/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.2.0`
- 端口：`11800:11800`；`12800:12800`
- 依赖服务：`elasticsearch`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=elasticsearch`；`SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200`；`SW_ES_USER=elastic`；`SW_ES_PASSWORD=elastic123456（示例凭据，部署前修改）`
- 权限与网络：启用了 privileged

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.2.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`
- 权限与网络：启用了 privileged

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/data:/usr/share/elasticsearch/data`；`./elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=elastic123456（示例凭据，部署前修改）`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.2.0-mysql/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.2.0`
- 端口：`11800:11800`；`12800:12800`
- 数据与配置挂载：`./skywalking/mysql-connector-java-8.0.28.jar:/skywalking/ext-libs/mysql-connector-java-8.0.28.jar`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=mysql`；`SW_JDBC_URL=jdbc:mysql://172.16.20.80:3306/skywalking-test?rewriteBatchedStatements=true&allowMultiQueries=true&useSSL=false`；`SW_DATA_SOURCE_USER=root`；`SW_DATA_SOURCE_PASSWORD=root（示例凭据，部署前修改）`
- 权限与网络：启用了 privileged

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.2.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`
- 权限与网络：启用了 privileged

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.3.0-es/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.3.0`
- 端口：`11800:11800`；`12800:12800`
- 依赖服务：`elasticsearch`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=elasticsearch`；`SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200`；`SW_ES_USER=elastic`；`SW_ES_PASSWORD=elastic123456（示例凭据，部署前修改）`

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.3.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=elastic123456（示例凭据，部署前修改）`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.3.0-mysql/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.3.0`
- 端口：`11800:11800`；`12800:12800`
- 数据与配置挂载：`./skywalking/mysql-connector-java-8.0.28.jar:/skywalking/ext-libs/mysql-connector-java-8.0.28.jar`
- 依赖服务：`mysql`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=mysql`；`SW_JDBC_URL=jdbc:mysql://172.24.0.83:3306/skywalking?rewriteBatchedStatements=true&allowMultiQueries=true&useSSL=false`；`SW_DATA_SOURCE_USER=root`；`SW_DATA_SOURCE_PASSWORD=root（示例凭据，部署前修改）`

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.3.0`
- 端口：`8888:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:5.7`
- 端口：`3308:3306`
- 数据与配置挂载：`./skywalking/mysql/my.cnf:/etc/mysql/my.cnf`；`./skywalking/mysql/data:/var/lib/mysql`；`./skywalking/mysql/log/mysql/error.log:/var/log/mysql/error.log`；`./skywalking/mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=skywalking`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.5.0-es/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.5.0`
- 端口：`11800:11800`；`12800:12800`
- 依赖服务：`elasticsearch`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=elasticsearch`；`SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200`；`SW_ES_USER=elastic`；`SW_ES_PASSWORD=elastic123456（示例凭据，部署前修改）`
- 权限与网络：启用了 privileged

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.5.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`SW_OAP_ADDRESS=http://172.24.0.81:12800`；`TZ=Asia/Shanghai`
- 权限与网络：启用了 privileged

**elasticsearch**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/elasticsearch:7.14.1`
- 端口：`9200:9200`；`9300:9300`
- 数据与配置挂载：`./elasticsearch/data:/usr/share/elasticsearch/data`；`./elasticsearch/logs:/usr/share/elasticsearch/logs`；`./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml`；`./elasticsearch/plugins/ik:/usr/share/elasticsearch/plugins/ik`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`TAKE_FILE_OWNERSHIP=true`；`discovery.type=single-node`；`ES_JAVA_OPTS=-Xmx512m -Xms512m`；`ELASTIC_PASSWORD=elastic123456（示例凭据，部署前修改）`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

#### `Linux/skywalking/9.7.0-mysql/docker-compose.yml`

**oap**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-oap-server:9.7.0`
- 端口：`11800:11800`；`12800:12800`
- 数据与配置挂载：`./skywalking/mysql-connector-java-8.0.28.jar:/skywalking/ext-libs/mysql-connector-java-8.0.28.jar`
- 环境变量：`TZ=Asia/Shanghai`；`JAVA_OPTS=-Xmx2048M -Xms2048M`；`SW_STORAGE=mysql`；`SW_JDBC_URL=jdbc:mysql://192.168.101.88:3306/skywalking?rewriteBatchedStatements=true&allowMultiQueries=true&useSSL=false`；`SW_DATA_SOURCE_USER=root`；`SW_DATA_SOURCE_PASSWORD=root（示例凭据，部署前修改）`

**oap-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/skywalking-ui:9.7.0`
- 端口：`18080:8080`
- 依赖服务：`oap`
- 环境变量：`TZ=Asia/Shanghai`；`SW_SERVER_PORT=8080`；`SW_OAP_ADDRESS=http://172.24.0.81:12800`

- 顶层网络：`skywalking={"ipam":{"driver":"default","config":[{"subnet":"172.24.0.0/24"}]}}`

## CI/CD 与网关

### Portainer

#### `Linux/portainer/1.24.1/docker-compose-portainer.yml`

**portainer**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/portainer:1.24.1`
- 端口：`9000:9000`
- 数据与配置挂载：`/var/run/docker.sock:/var/run/docker.sock`；`./portainer/data:/data`；`./portainer/Portainer-CN:/public`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

#### `Linux/portainer/1.25.0/docker-compose-portainer.yml`

**portainer**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/portainer:1.25.0`
- 端口：`9000:9000`
- 数据与配置挂载：`/var/run/docker.sock:/var/run/docker.sock`；`./portainer/data:/data`；`./portainer/Portainer-CN:/public`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

#### `Linux/portainer/2.17.0/docker-compose-portainer.yml`

**portainer**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/portainer-ce:2.17.0`
- 端口：`9000:9000`
- 数据与配置挂载：`/var/run/docker.sock:/var/run/docker.sock`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

#### `Linux/portainer/2.40.0/docker-compose.yml`

**portainer**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/portainer-ce:2.40.0`
- 端口：`9000:9000`
- 数据与配置挂载：`/var/run/docker.sock:/var/run/docker.sock`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Jenkins

#### `Linux/jenkins/docker-compose-jenkins.yml`

**jenkins**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/jenkins:2.346.1`
- 端口：`10000:8080`
- 数据与配置挂载：`/usr/bin/docker:/usr/bin/docker`；`/var/run/docker.sock:/var/run/docker.sock`；`/usr/lib64/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7`；`./jenkins/jenkins_home:/var/jenkins_home`；`./jenkins/jenkins_config:/var/jenkins_config`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`JAVA_OPTS=-Xmx2048M -Xms2048M -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:MaxNewSize=128m -Djava.util.logging.config.file=/var/jenkins_home/log.properties -Duser.timezone=Asia/Shanghai`
- 权限与网络：以 root 运行

### Nginx

#### `Linux/nginx/1.21.1/docker-compose-nginx.yml`

**nginx**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nginx:1.21.1`
- 端口：`80:80`
- 数据与配置挂载：`./nginx/conf/nginx.conf:/etc/nginx/nginx.conf`；`./nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf`；`./nginx/html:/usr/share/nginx/html`；`./nginx/log:/var/log/nginx`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

#### `Linux/nginx/1.27.0/docker-compose-nginx.yml`

**nginx**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nginx:1.27.0`
- 端口：`80:80`
- 数据与配置挂载：`./nginx/conf/nginx.conf:/etc/nginx/nginx.conf`；`./nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf`；`./nginx/html:/usr/share/nginx/html`；`./nginx/log:/var/log/nginx`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### GitLab

#### `Linux/gitlab/docker-compose-gitlab.yml`

**redis**
- 镜像：`redis:5.0.9`
- 数据与配置挂载：`redis-data:/var/lib/redis:Z`
- 启动参数：`["--loglevel warning"]`

**postgresql**
- 镜像：`sameersbn/postgresql:11-20200524`
- 数据与配置挂载：`postgresql-data:/var/lib/postgresql:Z`
- 环境变量：`DB_USER=gitlab`；`DB_PASS=password`；`DB_NAME=gitlabhq_production`；`DB_EXTENSION=pg_trgm`

**gitlab**
- 镜像：`sameersbn/gitlab:13.0.5`
- 端口：`10080:80`；`10022:22`
- 数据与配置挂载：`gitlab-data:/home/git/data:Z`
- 依赖服务：`redis`；`postgresql`
- 环境变量：`DEBUG=false`；`DB_ADAPTER=postgresql`；`DB_HOST=postgresql`；`DB_PORT=5432`；`DB_USER=gitlab`；`DB_PASS=password`；`DB_NAME=gitlabhq_production`；`REDIS_HOST=redis`；`REDIS_PORT=6379`；`TZ=Asia/Kolkata`；`GITLAB_TIMEZONE=Kolkata`；`GITLAB_HTTPS=false`；`SSL_SELF_SIGNED=false`；`GITLAB_HOST=localhost`；`GITLAB_PORT=10080`；`GITLAB_SSH_PORT=10022`；`GITLAB_RELATIVE_URL_ROOT=`；`GITLAB_SECRETS_DB_KEY_BASE=long-and-random-alphanumeric-string（示例凭据，部署前修改）`；`GITLAB_SECRETS_SECRET_KEY_BASE=long-and-random-alphanumeric-string（示例凭据，部署前修改）`；`GITLAB_SECRETS_OTP_KEY_BASE=long-and-random-alphanumeric-string（示例凭据，部署前修改）`；`GITLAB_ROOT_PASSWORD=（示例凭据，部署前修改）`；`GITLAB_ROOT_EMAIL=`；`GITLAB_NOTIFY_ON_BROKEN_BUILDS=true`；`GITLAB_NOTIFY_PUSHER=false`；`GITLAB_EMAIL=notifications@example.com`；`GITLAB_EMAIL_REPLY_TO=noreply@example.com`；`GITLAB_INCOMING_EMAIL_ADDRESS=reply@example.com`；`GITLAB_BACKUP_SCHEDULE=daily`；`GITLAB_BACKUP_TIME=01:00`；`SMTP_ENABLED=false`；`SMTP_DOMAIN=www.example.com`；`SMTP_HOST=smtp.gmail.com`；`SMTP_PORT=587`；`SMTP_USER=mailer@example.com`；`SMTP_PASS=password`；`SMTP_STARTTLS=true`；`SMTP_AUTHENTICATION=login`；`IMAP_ENABLED=false`；`IMAP_HOST=imap.gmail.com`；`IMAP_PORT=993`；`IMAP_USER=mailer@example.com`；`IMAP_PASS=password`；`IMAP_SSL=true`；`IMAP_STARTTLS=false`；`OAUTH_ENABLED=false`；`OAUTH_AUTO_SIGN_IN_WITH_PROVIDER=`；`OAUTH_ALLOW_SSO=`；`OAUTH_BLOCK_AUTO_CREATED_USERS=true`；`OAUTH_AUTO_LINK_LDAP_USER=false`；`OAUTH_AUTO_LINK_SAML_USER=false`；`OAUTH_EXTERNAL_PROVIDERS=`；`OAUTH_CAS3_LABEL=cas3`；`OAUTH_CAS3_SERVER=`；`OAUTH_CAS3_DISABLE_SSL_VERIFICATION=false`；`OAUTH_CAS3_LOGIN_URL=/cas/login`；`OAUTH_CAS3_VALIDATE_URL=/cas/p3/serviceValidate`；`OAUTH_CAS3_LOGOUT_URL=/cas/logout`；`OAUTH_GOOGLE_API_KEY=`；`OAUTH_GOOGLE_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_GOOGLE_RESTRICT_DOMAIN=`；`OAUTH_FACEBOOK_API_KEY=`；`OAUTH_FACEBOOK_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_TWITTER_API_KEY=`；`OAUTH_TWITTER_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_GITHUB_API_KEY=`；`OAUTH_GITHUB_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_GITHUB_URL=`；`OAUTH_GITHUB_VERIFY_SSL=`；`OAUTH_GITLAB_API_KEY=`；`OAUTH_GITLAB_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_BITBUCKET_API_KEY=`；`OAUTH_BITBUCKET_APP_SECRET=（示例凭据，部署前修改）`；`OAUTH_SAML_ASSERTION_CONSUMER_SERVICE_URL=`；`OAUTH_SAML_IDP_CERT_FINGERPRINT=`；`OAUTH_SAML_IDP_SSO_TARGET_URL=`；`OAUTH_SAML_ISSUER=`；`OAUTH_SAML_LABEL="Our SAML Provider"`；`OAUTH_SAML_NAME_IDENTIFIER_FORMAT=urn:oasis:names:tc:SAML:2.0:nameid-format:transient`；`OAUTH_SAML_GROUPS_ATTRIBUTE=`；`OAUTH_SAML_EXTERNAL_GROUPS=`；`OAUTH_SAML_ATTRIBUTE_STATEMENTS_EMAIL=`；`OAUTH_SAML_ATTRIBUTE_STATEMENTS_NAME=`；`OAUTH_SAML_ATTRIBUTE_STATEMENTS_USERNAME=`；`OAUTH_SAML_ATTRIBUTE_STATEMENTS_FIRST_NAME=`；`OAUTH_SAML_ATTRIBUTE_STATEMENTS_LAST_NAME=`；`OAUTH_CROWD_SERVER_URL=`；`OAUTH_CROWD_APP_NAME=`；`OAUTH_CROWD_APP_PASSWORD=（示例凭据，部署前修改）`；`OAUTH_AUTH0_CLIENT_ID=`；`OAUTH_AUTH0_CLIENT_SECRET=（示例凭据，部署前修改）`；`OAUTH_AUTH0_DOMAIN=`；`OAUTH_AUTH0_SCOPE=`；`OAUTH_AZURE_API_KEY=`；`OAUTH_AZURE_API_SECRET=（示例凭据，部署前修改）`；`OAUTH_AZURE_TENANT_ID=`

- 顶层命名卷：`redis-data=（空）`；`postgresql-data=（空）`；`gitlab-data=（空）`

### Gogs

#### `Linux/gogs/docker-compose.yml`

**grafana**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/gogs:latest`
- 端口：`10022:22`；`10880:3000`
- 数据与配置挂载：`./gogs:/data`
- 环境变量：`TZ=Asia/Shanghai`

### Rancher

#### `Linux/rancher/v2.6.0/docker-compose-rancher.yml`

**rancher**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rancher:v2.6.0`
- 端口：`80:80`；`443:443`
- 数据与配置挂载：`./rancher/data:/var/lib/rancher`；`./rancher/kubelet:/var/lib/kubelet`；`./rancher/log:/var/log`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 权限与网络：启用了 privileged

#### `Linux/rancher/v2.7.0/docker-compose-rancher.yml`

**rancher**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/rancher:v2.7.0`
- 端口：`20000:80`；`20443:443`；`30000-30050:30000-30050`
- 数据与配置挂载：`./rancher/data:/var/lib/rancher`；`./rancher/kubelet:/var/lib/kubelet`；`./rancher/log:/var/log`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`
- 权限与网络：启用了 privileged

### SonarQube

#### `Linux/sonarqube/docker-compose-sonarqube.yml`

**postgres**
- 镜像：`postgres:12.3`
- 端口：`5432:5432`
- 数据与配置挂载：`/etc/localtime:/etc/localtime:ro`
- 环境变量：`TZ=Asia/Shanghai`；`POSTGRES_USER=sonar`；`POSTGRES_PASSWORD=sonar（示例凭据，部署前修改）`；`POSTGRES_DB=sonar`

**sonarqube**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/sonarqube:9.2.1-community`
- 端口：`9005:9000`
- 数据与配置挂载：`/etc/localtime:/etc/localtime:ro`
- 依赖服务：`postgres`
- 环境变量：`TZ=Asia/Shanghai`；`SONARQUBE_JDBC_USERNAME=sonar`；`SONARQUBE_JDBC_PASSWORD=sonar（示例凭据，部署前修改）`；`SONARQUBE_JDBC_URL=jdbc:postgresql://postgres:5432/sonar`
- 启动参数：`["-Dsonar.ce.javaOpts=-Xmx2048m","-Dsonar.web.javaOpts=-Xmx2048m","-Dsonar.web.context=/","-Dsonar.core.serverBaseURL=https://sonarqube.example.com"]`

- 顶层网络：`sonarqube=（空）`

#### `Linux/sonarqube/docker-compose-sonarqube6.7.1.yml`

**sonarqube**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/sonarqube:6.7.1`
- 端口：`9005:9000`
- 数据与配置挂载：`./sonarqube/data:/opt/sonarqube/data`；`./sonarqube/logs:/opt/sonarqube/logs`；`./sonarqube/extensions/plugins/sonar-l10n-zh-plugin-1.19.jar:/opt/sonarqube/extensions/plugins/sonar-l10n-zh-plugin-1.19.jar`
- 环境变量：`SONARQUBE_JDBC_USERNAME=root`；`SONARQUBE_JDBC_PASSWORD=root（示例凭据，部署前修改）`；`SONARQUBE_JDBC_URL=jdbc:mysql://www.zhengqingya.com:3306/sonarqube?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance`

- 顶层网络：`sonarqube=（空）`

## 文件存储

### MinIO

#### `Linux/minio/latest/docker-compose-minio.yml`

**minio**
- 镜像：`minio/minio:latest`
- 端口：`9002:9000`；`9001:9001`
- 数据与配置挂载：`./minio/data:/data`；`./minio/minio:/minio`；`./minio/config:/root/.minio`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MINIO_PROMETHEUS_AUTH_TYPE=public`；`MINIO_ACCESS_KEY=root（示例凭据，部署前修改）`；`MINIO_SECRET_KEY=password（示例凭据，部署前修改）`
- 启动参数：`server /data  --console-address ":9001"`

#### `Linux/minio/RELEASE.2023-01-02T09-40-09Z/docker-compose-minio.yml`

**minio**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/minio:RELEASE.2023-01-02T09-40-09Z`
- 端口：`9001:9000`；`9090:9090`
- 数据与配置挂载：`./minio/data:/mnt/data`；`./minio/config/config.env:/etc/config.env`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MINIO_CONFIG_ENV_FILE=/etc/config.env`
- 启动参数：`server --console-address ":9090"`

### FastDFS

#### `Linux/fastdfs/docker-compose-fastdfs.yml`

**fastdfs-tracker**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/fastdfs:latest`
- 端口：`22122:22122`
- 启动参数：`tracker`
- 权限与网络：使用宿主机网络，端口不再隔离

**fastdfs-storage**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/fastdfs:latest`
- 端口：`8888:8888`；`23000:23000`
- 依赖服务：`fastdfs-tracker`
- 环境变量：`TRACKER_SERVER=www.zhengqingya.com:22122`；`GROUP_NAME=group1`
- 启动参数：`storage`
- 权限与网络：使用宿主机网络，端口不再隔离

### Nextcloud

#### `Linux/nextcloud/docker-compose-nextcloud.yml`

**nextcloud**
- 镜像：`nextcloud`
- 端口：`81:80`
- 数据与配置挂载：`./nextcloud/data:/var/www/html`

### 百度网盘 Web

#### `Linux/baidupcs-web/docker-compose-baidupcs-web.yml`

**baidupcs-web**
- 镜像：`johngong/baidupcs-web`
- 端口：`5299:5299`
- 数据与配置挂载：`./baidupcs-web/downloads:/root/Downloads`；`./baidupcs-web/config:/config`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

## 其它中间件

### Nacos

#### `Linux/nacos/nacos-1.4.1/docker-compose-nacos-1.4.1.yml`

**nacos**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:1.4.1`
- 端口：`8848:8848`；`9555:9555`
- 数据与配置挂载：`./nacos_1.4.1/logs:/home/nacos/logs`；`./nacos_1.4.1/init.d/custom.properties:/home/nacos/init.d/custom.properties`；`./nacos_1.4.1/conf/application.properties:/home/nacos/conf/application.properties`
- 环境变量：`PREFER_HOST_MODE=hostname`；`MODE=standalone`；`SPRING_DATASOURCE_PLATFORM=mysql`；`MYSQL_SERVICE_HOST=www.zhengqingya.com`；`MYSQL_SERVICE_DB_NAME=nacos_config`；`MYSQL_SERVICE_PORT=3306`；`MYSQL_SERVICE_USER=root`；`MYSQL_SERVICE_PASSWORD=root（示例凭据，部署前修改）`；`JVM_XMS=128m`；`JVM_XMX=128m`；`JVM_XMN=64m`；`JVM_MS=32m`；`JVM_MMS=32m`；`NACOS_DEBUG=n`；`TOMCAT_ACCESSLOG_ENABLED=false`

#### `Linux/nacos/nacos-2.0.3/01-单机/docker-compose-nacos-2.0.3.yml`

**nacos**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.0.3`
- 端口：`8848:8848`；`9848:9848`；`9849:9849`；`9555:9555`
- 数据与配置挂载：`./nacos_2.0.3/logs:/home/nacos/logs`；`./nacos_2.0.3/init.d/custom.properties:/home/nacos/init.d/custom.properties`；`./nacos_2.0.3/conf/application.properties:/home/nacos/conf/application.properties`
- 环境变量：`PREFER_HOST_MODE=hostname`；`MODE=standalone`；`SPRING_DATASOURCE_PLATFORM=mysql`；`MYSQL_SERVICE_HOST=www.zhengqingya.com`；`MYSQL_SERVICE_DB_NAME=nacos_config`；`MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai`；`MYSQL_SERVICE_PORT=3306`；`MYSQL_SERVICE_USER=root`；`MYSQL_SERVICE_PASSWORD=root（示例凭据，部署前修改）`；`JVM_XMS=128m`；`JVM_XMX=128m`；`JVM_XMN=64m`；`JVM_MS=32m`；`JVM_MMS=32m`；`NACOS_DEBUG=n`；`TOMCAT_ACCESSLOG_ENABLED=false`

- 顶层网络：`nacos={"driver":"bridge"}`

#### `Linux/nacos/nacos-2.0.3/02-集群/docker-compose-nacos-cluster-2.0.3.yml`

**nacos-nginx**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nginx:1.21.1`
- 端口：`8880:8880`
- 数据与配置挂载：`./nacos_cluster_2.0.3/nginx/conf/nginx.conf:/etc/nginx/nginx.conf`；`./nacos_cluster_2.0.3/nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf`；`./nacos_cluster_2.0.3/nginx/html:/usr/share/nginx/html`；`./nacos_cluster_2.0.3/nginx/log:/var/log/nginx`
- 依赖服务：`nacos-server-1`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

**nacos-server-1**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.0.3`
- 端口：`7848:7848`；`8848:8848`；`9848:9848`；`9849:9849`；`9555:9555`
- 数据与配置挂载：`./nacos_cluster_2.0.3/nacos_1_logs:/home/nacos/logs`；`./nacos_cluster_2.0.3/init.d/custom.properties:/home/nacos/init.d/custom.properties`；`./nacos_cluster_2.0.3/conf/application.properties:/home/nacos/conf/application.properties`；`./nacos_cluster_2.0.3/conf/cluster.conf:/home/nacos/conf/cluster.conf`
- 依赖服务：`nacos-server-2`
- 环境变量：`NACOS_SERVERS=nacos-server-1:8848,nacos-server-2:8848,nacos-server-3:8848`；`PREFER_HOST_MODE=hostname`
- 环境变量文件（需存在）：`nacos_cluster_2.0.3/env/nacos-hostname.env`

**nacos-server-2**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.0.3`
- 端口：`17848:7848`；`18848:8848`；`19848:9848`；`19849:9849`；`19555:9555`
- 数据与配置挂载：`./nacos_cluster_2.0.3/nacos_2_logs:/home/nacos/logs`；`./nacos_cluster_2.0.3/init.d/custom.properties:/home/nacos/init.d/custom.properties`；`./nacos_cluster_2.0.3/conf/application.properties:/home/nacos/conf/application.properties`；`./nacos_cluster_2.0.3/conf/cluster.conf:/home/nacos/conf/cluster.conf`
- 依赖服务：`nacos-server-3`
- 环境变量：`NACOS_SERVERS=nacos-server-1:8848,nacos-server-2:8848,nacos-server-3:8848`；`PREFER_HOST_MODE=hostname`
- 环境变量文件（需存在）：`nacos_cluster_2.0.3/env/nacos-hostname.env`

**nacos-server-3**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.0.3`
- 端口：`27848:7848`；`28848:8848`；`29848:9848`；`29849:9849`；`29555:9555`
- 数据与配置挂载：`./nacos_cluster_2.0.3/nacos_3_logs:/home/nacos/logs`；`./nacos_cluster_2.0.3/init.d/custom.properties:/home/nacos/init.d/custom.properties`；`./nacos_cluster_2.0.3/conf/application.properties:/home/nacos/conf/application.properties`；`./nacos_cluster_2.0.3/conf/cluster.conf:/home/nacos/conf/cluster.conf`
- 环境变量：`NACOS_SERVERS=nacos-server-1:8848,nacos-server-2:8848,nacos-server-3:8848`；`PREFER_HOST_MODE=hostname`
- 环境变量文件（需存在）：`nacos_cluster_2.0.3/env/nacos-hostname.env`

- 顶层网络：`nacos={"ipam":{"driver":"default","config":[{"subnet":"172.22.0.0/24"}]}}`

#### `Linux/nacos/nacos-2.2.0/docker-compose.yml`

**nacos**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nacos-server:2.2.0`
- 端口：`8848:8848`
- 数据与配置挂载：`./nacos/logs:/home/nacos/logs`
- 环境变量：`PREFER_HOST_MODE=hostname`；`MODE=standalone`；`SPRING_DATASOURCE_PLATFORM=mysql`；`MYSQL_SERVICE_HOST=172.16.16.88`；`MYSQL_SERVICE_DB_NAME=nacos_config`；`MYSQL_SERVICE_PORT=3306`；`MYSQL_SERVICE_USER=root`；`MYSQL_SERVICE_PASSWORD=root（示例凭据，部署前修改）`；`JVM_XMS=128m`；`JVM_XMX=128m`；`JVM_XMN=64m`；`JVM_MS=32m`；`JVM_MMS=32m`

- 顶层网络：`nacos={"driver":"bridge"}`

#### `Linux/nacos/nacos-latest/docker-compose-nacos.yml`

**nacos**
- 镜像：`nacos/nacos-server:latest`
- 端口：`8848:8848`
- 数据与配置挂载：`./nacos/logs:/home/nacos/logs`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MODE=standalone`

### XXL-JOB

#### `Linux/xxl-job/2.3.0/docker-compose-xxl-job.yml`

**xxl-job-admin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/xxl-job-admin:2.3.0`
- 端口：`9003:8080`
- 环境变量：`PARAMS=--spring.datasource.url=jdbc:mysql://192.168.0.88:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=root --spring.datasource.password=root --server.servlet.context-path=/xxl-job-admin --spring.mail.host=smtp.qq.com --spring.mail.port=25 --spring.mail.username=xxx@qq.com --spring.mail.from=xxx@qq.com --spring.mail.password=xxx --xxl.job.accessToken=`

#### `Linux/xxl-job/2.4.1/docker-compose-xxl-job.yml`

**xxl-job-admin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/xxl-job-admin:2.4.1`
- 端口：`9003:8080`
- 环境变量：`PARAMS=--spring.datasource.url=jdbc:mysql://10.133.10.253:3306/xxl_job?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF8&zeroDateTimeBehavior=convertToNull&useSSL=false --spring.datasource.username=root --spring.datasource.password=root --server.servlet.context-path=/xxl-job-admin --spring.mail.host=smtp.qq.com --spring.mail.port=25 --spring.mail.username=xxx@qq.com --spring.mail.from=xxx@qq.com --spring.mail.password=xxx --xxl.job.accessToken=`

#### `Linux/xxl-job/3.4.1/docker-compose.yml`

**xxl-job-admin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/xxl-job-admin:3.4.1`
- 端口：`9003:8080`
- 额外主机映射：`host.docker.internal:host-gateway`
- 环境变量：`PARAMS=--spring.datasource.url=jdbc:mysql://host.docker.internal:3306/xxl_job?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF8&zeroDateTimeBehavior=convertToNull&useSSL=false --spring.datasource.username=root --spring.datasource.password=root --server.servlet.context-path=/xxl-job-admin --spring.mail.host=smtp.qq.com --spring.mail.port=25 --spring.mail.username=xxx@qq.com --spring.mail.from=xxx@qq.com --spring.mail.password=xxx --xxl.job.accessToken=`

### PowerJob

#### `Linux/PowerJob/docker-compose.yml`

**powerjob-mysql**
- 镜像：`powerjob/powerjob-mysql:latest`
- 端口：`3307:3306`
- 数据与配置挂载：`./powerjob-data/powerjob-mysql:/var/lib/mysql`
- 环境变量：`MYSQL_ROOT_HOST=%`；`MYSQL_ROOT_PASSWORD=No1Bug2Please3!（示例凭据，部署前修改）`
- 启动参数：`--lower_case_table_names=1`

**powerjob-server**
- 镜像：`powerjob/powerjob-server:latest`
- 端口：`7700:7700`；`10086:10086`；`10010:10010`
- 数据与配置挂载：`./powerjob-data/powerjob-server:/root/powerjob/server/`
- 依赖服务：`powerjob-mysql`
- 环境变量：`PARAMS=--oms.mongodb.enable=false --spring.datasource.core.jdbc-url=jdbc:mysql://powerjob-mysql:3306/powerjob-daily?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai`

**powerjob-worker-samples**
- 镜像：`powerjob/powerjob-worker-samples:latest`
- 端口：`8081:8081`；`27777:27777`
- 数据与配置挂载：`./powerjob-data/powerjob-worker-samples:/root/powerjob/worker`
- 依赖服务：`powerjob-mysql`；`powerjob-server`
- 环境变量：`PARAMS=--powerjob.worker.server-address=powerjob-server:7700`

### Sentinel

#### `Linux/sentinel/1.8.2/01-普通版/docker-compose-sentinel.yml`

**sentinel**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/sentinel-dashboard:1.8.2`
- 端口：`8858:8858`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

#### `Linux/sentinel/1.8.2/02-持久化到mysql版/docker-compose-sentinel-mysql.yml`

**sentinel**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/sentinel-dashboard:1.8.2-mysql`
- 端口：`8858:8858`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`SENTINEL_AUTH_USERNAME=sentinel`；`SENTINEL_AUTH_PASSWORD=sentinel（示例凭据，部署前修改）`；`MYSQL_SERVICE_HOST=www.zhengqingya.com`；`MYSQL_SERVICE_DB_NAME=sentinel`；`MYSQL_SERVICE_PORT=3306`；`MYSQL_SERVICE_USER=root`；`MYSQL_SERVICE_PASSWORD=root（示例凭据，部署前修改）`

#### `Linux/sentinel/1.8.2/03-持久化到nacos/docker-compose-sentinel-nacos.yml`

**sentinel**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/sentinel-dashboard:1.8.4-nacos`
- 端口：`8858:8858`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`SENTINEL_AUTH_USERNAME=sentinel`；`SENTINEL_AUTH_PASSWORD=sentinel（示例凭据，部署前修改）`；`NACOS_SERVER_ADDR=www.zhengqingya.com:8848`；`NACOS_NAMESPACE=prod`；`NACOS_GROUP=sentinel-group`；`NACOS_USERNAME=nacos`；`NACOS_PASSWORD=nacos（示例凭据，部署前修改）`

### ZooKeeper

#### `Linux/zookeeper/3.7.0/docker-compose-zookeeper.yml`

**zookeeper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper:3.7.0`
- 端口：`2181:2181`
- 数据与配置挂载：`./zookeeper/data:/data`；`./zookeeper/datalog:/datalog`

### YApi

#### `Linux/yapi/docker-compose-yapi.yml`

**yapi**
- 镜像：`mrjin/yapi:latest`
- 端口：`3000:3000`
- 数据与配置挂载：`./yapi/yapi_log:/home/vendors/log`
- 依赖服务：`mongo`
- 环境变量：`VERSION=1.5.6`；`LOG_PATH=/tmp/yapi.log`；`HOME=/home`；`PORT=3000`；`ADMIN_EMAIL=admin@admin.com`；`DB_SERVER=mongo`；`DB_NAME=yapi`；`DB_PORT=27017`
- 权限与网络：启用了 privileged

**mongo**
- 镜像：`mongo`
- 端口：`27017:27017`

- 顶层网络：`yapi={"driver":"bridge"}`

### Flowable

#### `Linux/flowable/6.6.0/docker-compose-flowable.yml`

**flowable-ui**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/flowable-ui:6.6.0`
- 端口：`9004:8080`
- 数据与配置挂载：`./flowable/mysql-connector-java-8.0.22.jar:/app/WEB-INF/lib/mysql-connector-java-8.0.22.jar`
- 依赖服务：`mysql`
- 环境变量：`spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver`；`spring.datasource.url=jdbc:mysql://172.26.0.12:3306/flowable?allowMultiQueries=true&useUnicode=true&characterEncoding=UTF8&serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull&useSSL=false&nullCatalogMeansCurrent=true`；`spring.datasource.username=root`；`spring.datasource.password=root（示例凭据，部署前修改）`；`flowable.async-executor-activate=false`；`flowable.database-schema-update=true`

**mysql**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/mysql:8.0`
- 端口：`3308:3306`
- 数据与配置挂载：`./mysql/my.cnf:/etc/mysql/my.cnf`；`./mysql/data:/var/lib/mysql`；`./mysql/mysql-files:/var/lib/mysql-files`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`MYSQL_ROOT_PASSWORD=root（示例凭据，部署前修改）`；`MYSQL_DATABASE=flowable`
- 权限与网络：启用了 privileged；以 root 运行

- 顶层网络：`flowable={"ipam":{"driver":"default","config":[{"subnet":"172.26.0.0/24"}]}}`

### JumpServer

#### `Linux/jumpserver/docker-compose-build.yml`

**core**
- 镜像：`jumpserver/jms_core:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/core/logs:/opt/jumpserver/logs`
- 环境变量：`SECRET_KEY=$SECRET_KEY（示例凭据，部署前修改）`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`DEBUG=$DEBUG`；`LOG_LEVEL=$LOG_LEVEL`；`DB_HOST=$DB_HOST`；`DB_PORT=$DB_PORT`；`DB_USER=$DB_USER`；`DB_PASSWORD=$DB_PASSWORD（示例凭据，部署前修改）`；`DB_NAME=$DB_NAME`；`REDIS_HOST=$REDIS_HOST`；`REDIS_PORT=$REDIS_PORT`；`REDIS_PASSWORD=$REDIS_PASSWORD（示例凭据，部署前修改）`
- 启动参数：`start web`

**celery**
- 镜像：`jumpserver/jms_core:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/core/logs:/opt/jumpserver/logs`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`SECRET_KEY=$SECRET_KEY（示例凭据，部署前修改）`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`DEBUG=$DEBUG`；`LOG_LEVEL=$LOG_LEVEL`；`DB_HOST=$DB_HOST`；`DB_PORT=$DB_PORT`；`DB_USER=$DB_USER`；`DB_PASSWORD=$DB_PASSWORD（示例凭据，部署前修改）`；`DB_NAME=$DB_NAME`；`REDIS_HOST=$REDIS_HOST`；`REDIS_PORT=$REDIS_PORT`；`REDIS_PASSWORD=$REDIS_PASSWORD（示例凭据，部署前修改）`
- 启动参数：`start task`

**koko**
- 镜像：`jumpserver/jms_koko:${Version}`；启动前需提供：Version
- 端口：`2222:2222`
- 数据与配置挂载：`${VOLUME_DIR}/koko/data:/opt/koko/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`
- 权限与网络：启用了 privileged

**lion**
- 镜像：`jumpserver/jms_lion:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/lion/data:/opt/lion/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`

**nginx**
- 镜像：`jumpserver/jms_nginx:${Version}`；启动前需提供：Version
- 端口：`80:80`
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/nginx/data/logs:/var/log/nginx`
- 依赖服务：`core={"condition":"service_healthy"}`

- 顶层网络：`net={"driver":"bridge","ipam":{"driver":"default","config":[{"subnet":"$DOCKER_SUBNET"}]}}`

#### `Linux/jumpserver/docker-compose-mariadb.yml`

**core**
- 镜像：`未声明`
- 依赖服务：`mysql={"condition":"service_healthy"}`

**mysql**
- 镜像：`mariadb:10.6`
- 数据与配置挂载：`${VOLUME_DIR}/mariadb/data:/var/lib/mysql`
- 环境变量：`DB_PORT=$DB_PORT`；`MARIADB_ROOT_PASSWORD=$DB_PASSWORD（示例凭据，部署前修改）`；`MARIADB_DATABASE=$DB_NAME`
- 启动参数：`--character-set-server=utf8 --collation-server=utf8_general_ci`

#### `Linux/jumpserver/docker-compose-redis.yml`

**core**
- 镜像：`未声明`
- 依赖服务：`mysql={"condition":"service_healthy"}`

**redis**
- 镜像：`redis:6`
- 数据与配置挂载：`${VOLUME_DIR}/redis/data:/data`
- 环境变量：`REDIS_PORT=$REDIS_PORT`；`REDIS_PASSWORD=$REDIS_PASSWORD（示例凭据，部署前修改）`
- 启动参数：`redis-server --requirepass $REDIS_PASSWORD --loglevel warning --maxmemory-policy allkeys-lru`

#### `Linux/jumpserver/docker-compose-xpack.yml`

**omnidb**
- 镜像：`registry.fit2cloud.com/jumpserver/omnidb:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/omnidb/data:/opt/omnidb/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`

**xrdp**
- 镜像：`registry.fit2cloud.com/jumpserver/xrdp:${Version}`；启动前需提供：Version
- 端口：`3389:3389`
- 数据与配置挂载：`${VOLUME_DIR}/xrdp/data:/opt/xrdp/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`

#### `Linux/jumpserver/docker-compose.yml`

**core**
- 镜像：`jumpserver/core:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/core/logs:/opt/jumpserver/logs`
- 环境变量：`SECRET_KEY=$SECRET_KEY（示例凭据，部署前修改）`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`DEBUG=$DEBUG`；`LOG_LEVEL=$LOG_LEVEL`；`DB_HOST=$DB_HOST`；`DB_PORT=$DB_PORT`；`DB_USER=$DB_USER`；`DB_PASSWORD=$DB_PASSWORD（示例凭据，部署前修改）`；`DB_NAME=$DB_NAME`；`REDIS_HOST=$REDIS_HOST`；`REDIS_PORT=$REDIS_PORT`；`REDIS_PASSWORD=$REDIS_PASSWORD（示例凭据，部署前修改）`
- 启动参数：`start web`

**celery**
- 镜像：`jumpserver/core:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/core/logs:/opt/jumpserver/logs`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`SECRET_KEY=$SECRET_KEY（示例凭据，部署前修改）`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`DEBUG=$DEBUG`；`LOG_LEVEL=$LOG_LEVEL`；`DB_HOST=$DB_HOST`；`DB_PORT=$DB_PORT`；`DB_USER=$DB_USER`；`DB_PASSWORD=$DB_PASSWORD（示例凭据，部署前修改）`；`DB_NAME=$DB_NAME`；`REDIS_HOST=$REDIS_HOST`；`REDIS_PORT=$REDIS_PORT`；`REDIS_PASSWORD=$REDIS_PASSWORD（示例凭据，部署前修改）`
- 启动参数：`start task`

**koko**
- 镜像：`jumpserver/koko:${Version}`；启动前需提供：Version
- 端口：`2222:2222`
- 数据与配置挂载：`${VOLUME_DIR}/koko/data:/opt/koko/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`
- 权限与网络：启用了 privileged

**lion**
- 镜像：`jumpserver/lion:${Version}`；启动前需提供：Version
- 数据与配置挂载：`${VOLUME_DIR}/lion/data:/opt/lion/data`
- 依赖服务：`core={"condition":"service_healthy"}`
- 环境变量：`CORE_HOST=http://core:8080`；`BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN（示例凭据，部署前修改）`；`LOG_LEVEL=$LOG_LEVEL`

**web**
- 镜像：`jumpserver/web:${Version}`；启动前需提供：Version
- 端口：`80:80`
- 数据与配置挂载：`${VOLUME_DIR}/core/data:/opt/jumpserver/data`；`${VOLUME_DIR}/nginx/data/logs:/var/log/nginx`
- 依赖服务：`core={"condition":"service_healthy"}`

- 顶层网络：`net={"driver":"bridge","ipam":{"driver":"default","config":[{"subnet":"$DOCKER_SUBNET"}]}}`

### NPS

#### `Linux/nps/docker-compose-nps.yml`

**nps**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/nps:v0.26.10`
- 端口：`30080:30080`；`30024:30024`；`8100-8200:8100-8200`
- 数据与配置挂载：`./nps/conf:/conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

- 顶层网络：`nps=（空）`

### Tomcat

#### `Linux/tomcat/docker-compose-tomcat.yml`

**tomcat**
- 镜像：`tomcat`
- 端口：`8081:8080`
- 数据与配置挂载：`./tomcat/webapps:/usr/local/tomcat/webapps`

### JRebel

#### `Linux/jrebel/docker-compose-jrebel.yml`

**jrebel**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/jrebel`
- 端口：`8888:8888`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### OpenSumi Web

#### `Linux/opensumi-web/docker-compose-opensumi-web.yml`

**activemq**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/opensumi-web:latest`
- 端口：`20000:8000`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Walle

#### `Linux/walle/docker-compose-walle.yml`

**db**
- 镜像：`mysql`
- 端口：`3306:3306`
- 数据与配置挂载：`/data/walle/mysql:/var/lib/mysql`
- 暴露但不映射到宿主机：`3306`
- 环境变量文件（需存在）：`./walle/walle.env`
- 启动参数：`["--default-authentication-plugin=mysql_native_password","--character-set-server=utf8mb4","--collation-server=utf8mb4_unicode_ci"]`

**python**
- 镜像：`alenx/walle-python:2.1`
- 数据与配置挂载：`/opt/walle_home/plugins/:/opt/walle_home/plugins/`；`/opt/walle_home/codebase/:/opt/walle_home/codebase/`；`/opt/walle_home/logs/:/opt/walle_home/logs/`；`/root/.ssh:/root/.ssh/`
- 依赖服务：`db`
- 暴露但不映射到宿主机：`5000`
- 环境变量文件（需存在）：`./walle/walle.env`
- 启动参数：`bash -c "cd /opt/walle_home/ && /bin/bash admin.sh migration &&  python waller.py"`

**web**
- 镜像：`alenx/walle-web:2.1`
- 端口：`80:80`
- 依赖服务：`python`

- 顶层网络：`walle-net={"driver":"bridge"}`

### JPom

#### `Linux/jpom/docker-compose.yml`

**portainer**
- 镜像：`jpomdocker/jpom`
- 端口：`2122:2122`
- 数据与配置挂载：`./jpom/logs:/usr/local/jpom-server/logs`；`./jpom/data:/usr/local/jpom-server/data`；`./jpom/conf:/usr/local/jpom-server/conf`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

### Confluence

#### `Linux/confluence/docker-compose.yml`

**confluence**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/atlassian-confluence:7.9.3`
- 端口：`8090:8090`；`8091:8091`
- 数据与配置挂载：`./app/confluence/logs:/opt/atlassian/confluence/logs`；`./app/confluence/data:/var/atlassian/confluence`；`./app/confluence/atlassian-extras-2.4.jar:/opt/atlassian/confluence/confluence/WEB-INF/lib/atlassian-extras-decoder-v2-3.4.1.jar`
- 依赖服务：`db`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`

**db**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/postgres:14.5`
- 端口：`5432:5432`
- 数据与配置挂载：`./app/postgresql/data:/var/lib/postgresql/data`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`POSTGRES_DB=confluence`；`POSTGRES_USER=postgres`；`POSTGRES_PASSWORD=123456（示例凭据，部署前修改）`；`ALLOW_IP_RANGE=0.0.0.0/0`

### Jira

#### `Linux/jira/docker-compose.yml`

**jira**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/atlassian-jira-software:latest`
- 端口：`18080:8080`
- 数据与配置挂载：`./app/data:/var/atlassian/jira`；`./app/atlassian-agent.jar:/opt/atlassian/jira/atlassian-agent.jar`
- 环境变量：`TZ=Asia/Shanghai`；`LANG=en_US.UTF-8`；`CATALINA_OPTS=-javaagent:/opt/atlassian/jira/atlassian-agent.jar`

### Dubbo Admin

#### `Linux/dubbo-admin/docker-compose.yml`

**zookeeper**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/zookeeper:3.7.0`
- 端口：`2181:2181`
- 数据与配置挂载：`./zookeeper/data:/data`；`./zookeeper/datalog:/datalog`

**dubbo-admin**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/dubbo-admin:0.6.0`
- 端口：`38080:38080`
- 数据与配置挂载：`./dubbo-admin/properties:/config`
- 依赖服务：`zookeeper`
- 环境变量：`admin.registry.address=zookeeper://172.26.0.11:2181`；`admin.config-center=zookeeper://172.26.0.11:2181`；`admin.metadata-report.address=zookeeper://172.26.0.11:2181`；`admin.root.user.name=root`；`admin.root.user.password=root（示例凭据，部署前修改）`；`JAVA_OPTS=-Xmx100M -Xms100M -XX:+UseG1GC`

- 顶层网络：`dubbozk={"ipam":{"driver":"default","config":[{"subnet":"172.26.0.0/24"}]}}`

### Azkaban

#### `Linux/azkaban/docker-compose-azkaban.yml`

**azkaban-web**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/azkaban:3.91.0-313`
- 端口：`${AZKABAN_WEB_PORT}:${AZKABAN_WEB_PORT}`
- 数据与配置挂载：`./conf/web/azkaban.properties:${AZKABAN_HOME}/azkaban-web-server/conf/azkaban.properties`
- 依赖服务：`azkaban-exec`
- 环境变量文件（需存在）：`.env`
- 启动参数：`["sh","-c","/opt/apache/bootstrap.sh web azkaban-azkaban-exec-1 ${AZKABAN_EXEC_PORT}"]`
- 权限与网络：启用了 privileged

**azkaban-exec**
- 镜像：`registry.cn-hangzhou.aliyuncs.com/zhengqing/azkaban:3.91.0-313`
- 数据与配置挂载：`./conf/exec/azkaban.properties:${AZKABAN_HOME}/azkaban-exec-server/conf/azkaban.properties`
- 环境变量文件（需存在）：`.env`
- 启动参数：`["sh","-c","/opt/apache/bootstrap.sh exec"]`
- 权限与网络：启用了 privileged

- 顶层网络：`azkaban-network=（空）`

---

共分析 **112** 份 Compose 文件。生成命令：`python scripts/generate-compose-reference.py <上游仓库目录>`。
