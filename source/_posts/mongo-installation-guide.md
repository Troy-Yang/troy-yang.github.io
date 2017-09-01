---
title: 高可靠性MongoDB 安装指南
date: 2017-09-01 19:20:22
author: Troy 
tags: 
- mongo
- No-SQL
categories:
- 数据库
photos:
- https://images.troyyang.com/2017-09-01-mongo-logo.png
excerpt: 最近项目中用到了MongoDB，顺便就写了安装说明文档以备以后查看，包括创建高可靠性的副本集replica-set，远程连接，密码登录等配置。
---

最近项目中用到了MongoDB，顺便就写了安装说明文档，包括创建高可靠性的副本集replica-set，远程连接，密码登录等配置。
### 安装 MongoDB

1. 下载 [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)
2. 系统环境设置. (Path: C:\Program Files\MongoDB\Server\3.4\bin)

### 创建 MongoDB 实例

1. 创建高性能副本集replica-set数据库，打开命令行 (mongod代表着服务器)
```
>mkdir d:\mongodb\db01
>mongod --port 27017 --dbpath "d:\mongodb\db01" --replSet "rs01dev"
```
运行成功后，副本集db01已经创建成功并处于运行中，此时不关闭命令窗体，保持其运行状态。

2. 初始化 [replica-set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/).
打开另一个命令窗体，并运行下面命令(mongo代表着客户端)
```
>mongo
>rs.initiate({
    _id: "rs01dev",
      version: 1,
      members: [
         { _id: 0, host : "127.0.0.1:27017" }
      ]
})
>rs.config()
```
上面的命令将会创建一个主副本集（节点）

3. 创建数据库 'myDB'
```
>use myDB
>db.createUser(
  {
    user: "troyyang",
    pwd: "5469a64fe0a336da365f44f5980f573c",
    roles: [
       { role: "readWrite", db: "myDB" },
       { role: "dbAdmin", db: "myDB" }
    ]
  }
)
// 上面的命令不会马上创建出数据库，只有插入语句会触发创建数据库
>db.test.insert({"name":"name1"})
```

###  登录验证
默认情况下，mongo数据库的连接是不需要验证的，这就是为什么上面的那个客户端能直接连接上服务端，所以这样是极其不安全的做法，因此我们这里需要使用登录验证的方式。

关闭上面的客户端命令行，以及服务端。然后打开一个新的命令窗体并执行下面命令开启服务器：
```
mongod --auth --port 27017 --dbpath "d:\mongodb\db01" --replSet "rs01dev"
```
此时，需要验证的服务器开启完成，非常简单，可以看出，唯一的不同是多了一个 --auth的参数。

###  客户端登录验证测试
* 命令行客户端测试: 打开一个新的命令行窗体（本机或者外部机器），然后执行:
```
>mongo 127.0.0.1:27017 -u "troyyang" -p "5469a64fe0a336da365f44f5980f573c" --authenticationDatabase "myDB"
```

* Robomongo 测试
略
