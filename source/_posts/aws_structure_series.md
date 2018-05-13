---
title: AWS系列之 myenglishtutor基于AWS生态的广泛使用
date: 2018-5-12 09:37:22
author: Troy
tags:
- aws
categories:
- aws
photos: 
- https://images.troyyang.com/2018-5-12-aws-services-myenglishtutor.png
---
***
### 写在开头
看着系统生成的写作时间，2018年5月12日，恐怕是让所有四川人都难以忘怀的日子，在此缅怀十年前大地震遇难的同胞，也希望曾遭受苦痛的同胞十年后的今天一切安好！

回想在给Jason兼职工作的这半年多，一个人把 ![image](https://myenglishtutor.eu/images/icons/favicon-32x32.png) [https://myenglishtutor.eu](https://myenglishtutor.eu) 从0到1的把网站一点一点建好，感觉像个自己的孩子，总想要给他最好的，但也由于个人精力有限，很多想做的都没去做。尤其是AWS的生态让我印象深刻，所以想要写下这一个系列的技术感悟。

|<h2>[AWS系列之S3 + Cloudfront搭建https hexo静态网站](https://troyyang.com/2018/05/12/aws_s3_https_static_website/)</h2>|
|:---------|
|使用hexo做静态内容生成，s3托管静态网站内容，使用cloudfront做内容分发及https证书自动生成，route53做域名DNS解析，还有部分工具如依托s3 SDK做代码自动上传部署，google driver 自动同步等。|
|hexo、s3、cloudfront、route53、certification、aws s3 SDK auto sync file and deployment|

|<h2>[AWS系列之 Stripe 国际支付](https://troyyang.com/2018/01/21/stripe_guide_alipay/)</h2>|
|:---------|
|服务端使用Lambda、API Gateway实现的无服务器服务，客户端使用Stripe的Element.js类库|
|Lambda、API Gateway|

|<h2>AWS系列之结合OpenTek实现多人实时Web视频通话、教学</h2>|
|:---------|
|使用s3做视频前端和后台管理的代码托管, Lambda+DynamoDB+API Gateway实现Serverless搭建的node express无服务器服务端。|
|s3、openTek SDK、Lambda、DynamoDB、API Gateway、Angular 1.0、bootstrap|

|<h2>AWS系列之Polly服务实现AI文本到语音翻译</h2>|
|:---------|
|使用aws的Polly服务实现文本转语音的翻译，服务端搭建的Serverless服务端，客户端使用自己写的hexo plugin功能调用API。|
|Lambda、API Gateway、SNS、s3、Hexo plugin|

|<h2>AWS系列之使用Wowza streaming实现视频直播+弹幕服务</h2>|
|:---------|
|架构上使用EC2负载均衡和自动扩容实现可伸缩视频直播服务。弹幕使用web socket实现双向通信，客户端采用对手机H5播放支持。|
|s3、EC2、Load banance、ASG、cloudfront、linux、 danmaku、h5 video|


这里也打个广告简单介绍一下Jason和他的myenglishtutor，从名字也大概知道他是个英语老师和他的个人网站，Jason是个地道的英国人，浓厚的英国口音以及超过十几年英语专业教学经验，作为myenglishtutor的开发者，我为他集成了包括视频直播，1对1，1对多的视频教学直播，支付宝支付，词法解释等功能，所以不用担心教学方式及支付等问题。如果有意专业英语要求的个人或者团体，欢迎直接联系我，有更低的折扣等你。

