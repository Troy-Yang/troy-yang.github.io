---
title: 成都持续交付大会
date: 2017-12-10 10:27:03
author: Troy
tags:
- devops
categories:
- 笔记
---
抽空记录一下2017年11月18日中国第十三届持续交付大会的内容，总的来说收货满满，扫盲了很多持续集成，持续交付以及众多分布式相关的技术。

![image](https://images.troyyang.com/2017-11-18-cdconf.png)


## 关键点
### 微服务架构
微服务毫无疑问是这两年最火的架构模式之一，可惜没有机会实践，但是了解到的是重点在于如何划分服务，更多的可以参考[cnblogs](https://www.cnblogs.com/imyalost/p/6792724.html)上的一篇博文，很全。
![image](https://images.troyyang.com/2017-11-18-microservices.png)

### 京东架构演变
听完演讲者的京东架构演变的过程充分验证了金字塔不是一天建成的，互联网产品一直是迭代的，两张京东架构图足以说明他们的技术演变过程：

**架构1.0:**
![image](https://images.troyyang.com/2017-11-18-jd-v1.png)

**架构3.0:**
![image](https://images.troyyang.com/2017-11-18-jd-v3.png)

### Serverless
感觉Serverless 会是另一个未来软件开发的趋势，自己的博客系统里就集成了很多serverless的服务，对于我来说最常见的可能就是类似各种评论系统像DISQUS，多说, （哎，可惜已经关了），存储系统等。当然对企业来说的话，像亚马逊的Lambda这种更能方便客户快速拼接出各种产品，减少开发人员成本。

这个月也参加了亚马逊用户社区活动，里面更是重点提到了Serverless的广泛运用，听完更是为Severless 打call。

## 扫盲篇（未完）：

### elasticsearch
### jmq
### binlog
### 数据库分库分表（取模）
### jproxy
### 服务找寻（取模）
### TRUNKED BASED DEVELOPMENT
### A/B 测试
### 蓝绿部署
### 分布式调用链追踪原理：在相互每个服务请求header中添加trackId
### 契约测试框架：janus, pact, pacto, spring cloud contract
### 开发环境区分：dev-qa-sys-perf-uat-prod (我们公司使用的有点不一样localdev-stage-dev-qa-uat-prod)

