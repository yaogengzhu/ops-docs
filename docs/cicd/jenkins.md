---
title: Docker Compose 一键部署 Jenkins
description: 在容器里跑 Jenkins 做 CI。说明 10000 端口、初始密码位置、时区，以及挂载 docker.sock 在容器内构建镜像。
keywords: Docker Compose, Jenkins, CI, 持续集成
---

# Jenkins

自动化构建、测试、部署。这套编排把 Jenkins 跑在容器里，并挂载 **宿主机 Docker**，这样 Job 里也能 `docker build`。

## 什么时候用 / 什么时候别用

**用：** 要流水线；要定时任务拉代码；小团队还没上 GitLab CI。

**别用：** 笔记本内存小于 4G 还开很多 Job（yml 里堆了 2G 堆）；只想要 Git 托管（[Gogs](/cicd/gogs/) 更轻）。

## 仓库里有哪些版本

目录较扁平：`Linux/jenkins/docker-compose-jenkins.yml`，镜像注释为 `jenkins/jenkins:2.346.1`。

源码目录：`Linux/jenkins`

## 关键配置拆解

对照文件：`Linux/jenkins/docker-compose-jenkins.yml`。

```yaml
image: registry.cn-hangzhou.aliyuncs.com/zhengqing/jenkins:2.346.1
container_name: jenkins
user: root
ports:
  - "10000:8080"
environment:
  JAVA_OPTS: '-Xmx2048M -Xms2048M ... -Duser.timezone=Asia/Shanghai'
volumes:
  - "/usr/bin/docker:/usr/bin/docker"
  - "/var/run/docker.sock:/var/run/docker.sock"
  - "./jenkins/jenkins_home:/var/jenkins_home"
```

含义：

- **10000:8080**：浏览器走 10000，不要去敲 8080（那是容器内端口）。
- **jenkins_home**：任务、插件、凭证都在这。备份就备份这个目录。
- **docker.sock**：容器内 Docker 客户端操作的是宿主机引擎。Job 构建的镜像会出现在宿主机 `docker images`。
- **2G 堆**：内存吃紧时把 `Xmx` 降到 `512M` 再试。
- **时区**：`JAVA_OPTS` 里已加上海；只靠 `TZ` 对 Jenkins 界面时钟往往不够。

## 启动与访问

```shell
cd docker-compose/Linux/jenkins
chmod -R 777 ./jenkins
docker compose -f docker-compose-jenkins.yml -p jenkins up -d
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

打开 `http://<IP>:10000`，粘贴初始密码，安装推荐插件，创建管理员。

## 常见坑

1. **权限**：jenkins_home 必须可写，否则启动循环。
2. **插件安装失败**：网络或镜像源，可换国内更新中心，或预挂插件文件（yml 注释里提过 cloudbees-folder）。
3. **升级**：run.md 写了替换 `jenkins.war` 的办法；更稳妥是换镜像 tag 并备份 home。
4. **在容器里调 docker 失败**：sock 没挂、或二进制路径与宿主机不一致（Ubuntu 和 CentOS 的 libltdl 路径不同，yml 里有一条兼容挂载）。
5. **重启丢时区**：界面脚本里设的时区不持久，以 `JAVA_OPTS` 为准。
