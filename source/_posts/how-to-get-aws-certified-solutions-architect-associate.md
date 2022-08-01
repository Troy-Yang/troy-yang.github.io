---
title: 如何通过 AWS certified solution architect associate (SAA) 
date: 2022-07-31 11:08:49
author: Troy
tags:
- aws
- certification
categories:
- aws
excerpt: 花了三四个月的业余时间，终于通过 AWS SAA 认证。回过头，最大的收获不是获得这个证的荣誉，而是在面临工作压力，家庭琐事等等都情况下，坚持做一件有挑战的事，并做成后的成就感。
photos: 
- https://images.troyyang.com/2022-aws-saa-yangzhou.png
---
***

每天一两个小时的学习，前前后后三四个月，除了高考，也就这次考试的重视程度最高，最紧张了。回过头，看着网上评论有说小白一个月通过，我不太相信，即便对于我有一点AWS 基础的，考的过程还是很有压力。所以如果你也是准备在考的，请一定一定别低估考试的难度，务必准备足够充分。

### 考证缘由

说起为何想着考这个证，主要有几个原因：1. AWS的情怀，在前面的三四年里，在一些个人项目里或多或少的用过一些AWS 服务，像EC2, Lamda, DynamoDB, Route53 等，也分享过一些AWS的文章[aws_structure_series](https://troyyang.com/2018/05/12/aws_structure_series/)，所以想要继续提升aws的技能 2. 私下在和一位日本华人合作的过程中，发现国外的项目对AWS需求很大，如果能有个证，在项目上会有一定优势. 3. 个人的转型尝试 (也算是backup 吧)

### 考试须知

* 报名费：$150，考试失败，需重新缴费补考
* 考试时间为 130 分钟 （划重点，对于咱们中国考生，可申请考试通融额外获取30分钟）
* 65 道，单选题或多选题 (15道不计分，多选题题目数不定)
* Pearson VUE 和 PSI；考试中心或在线监考考试 （我是线上考的，但硬件和网络要求需考虑）
* 考试语言可选中英文，推荐选择中文，可在考试中来回切换中英文
* SAA-C02试题会在8月29, 2022 过期，之后会采用C03 (所以我是看这个deadline 来安排我的考试)

### 备考历程

从三四月决定考试开始，一开始便不知所措，除了官网的考试大纲和样本试题，国内的考试指南文章都实在帮助很小，大部分最后还是落在各种service 范围上，想要找到一个系统性的中文学习视频或文档实在很难，所以之后的所有重心都放在了国外的资源上，下面是我自个按照学习的时间线列出的资源：

* 下载考试大纲和样本试题pdf https://aws.amazon.com/cn/certification/certified-solutions-architect-associate/?c=sec&sec=resources
* [Youtube 小哥如何通过考试](https://www.youtube.com/watch?v=jypuayQpvao) 十几分钟，但非常励志，由其是SET A DEADLINE WITH A CONSEQUENCE 
* AWS 官方学习课程 [AWS Technical Essentials](https://explore.skillbuilder.aws/learn/course/external/view/elearning/1851/aws-technical-essentials?saa=sec&sec=prep)(5小时) 非常棒的介绍和引导，免费  
* [Youtube AWS full course by FreeCodeCamp.org](https://www.youtube.com/watch?v=Ia-UEYYR44s&t=1175s) 10小时，非常全面且免费，但缺少hands on
* [视频教程 Stephane Maarek SAA by udemy.com](https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/) ~28小时，我的学习主力，需购买大约$15，请注意这是C02，后面应该买C03了
* [jayendrapatil.com](https://jayendrapatil.com/) 必须要提这人的博客，几乎所有备考的人都提到了他，包括了几乎所有考点，但文章真的太多，我大部分review 过，只是用来总结自己是否掌握过相关知识点，但推荐每篇都仔细看。
* [Practice Exams](https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate) 需购买，大约$20，6套试题，但感觉这些难度有点高，考了四套，都才50% 到 60%，建议换其他如[whizlabs](https://www.whizlabs.com/aws-solutions-architect-associate/)
* 官方白皮书的介绍以及FAQ

最最重要的，可能就是hands on了，务必动手多练, 比如 VPC，EBS+ASG, S3 等等，一是光看大部分肯定都记不住并且连不起来，二是真的就只是为了拿证了，实在不是个合格的云架构师，一些看似很简单的设计比如两层架构，一上手才会知道自己会漏多少。

### 报考流程
登录 https://www.aws.training/ 后，最后被导航至 https://www.certmetrics.com/ ，填写好个人信息后（姓名务必使用拼音），就可以选择注册参考考试。（后期的成绩查询，证书下载都是在这个网站，PS：2021年11月后，证书已经更新，已经完全和网上看到的不一样了，黑底白字带验证码，实在不好看）
> 可以申请考试通融延迟30分钟考试时间，如果选的是PSI， 可直接点击申请，基本申请就显示成功，之后的考试时间就会是160分钟

### 考试过程

#### 考前准备

* 准备**护照**在手，（身份证不行，没有拼音和签名）
* 在线考试对自己的考场要求很严，需腾空考试房间，确保房间安静，房门关闭，中途不得上厕所，一旦有人或杂音，考官会终止考试

> 使用的PSI在线考试， 一直犹豫要不要选择Pearson VUE 考试中心现场考，但最终还是选择家里考，主要是因为当时PSI 有个考试优惠，以及疫情影响。如果家里网络稳定，以及对电脑有信心，最好是MAC，可以尝试在线考试。PSI 会在考试期间使用自家的浏览器，可锁定屏幕以及禁止其他软件运行，可提前下好，也可登录系统根据提示下载，下载地址在[这里](https://tca.psiexams.com/portal/testdelivery/sb_rpnow_download.jsp)

#### 考试中
选择的是9:30考，大概9点我就已经迫不及待的进入系统，按照操作，扫描护照鉴权通过后，考官会出现在对话框里，你看不见他，他能看见你，随后，他会有各种指示命令让显示各种视频角度等等检测（发现了我桌上的矿泉水都让给倒了），一切OK 会，考官会发题正式开始答题。

然后就是漫长的两个小时多的答题时间。。。原本的130分钟时间倒是差不多够，但由于我申请了通融，有多余的半个小时，花了十几分钟检查标记的题目。最后实在扛不住了，点击提交，再经过焦急的几秒后，终于显示通过。。。

#### 考试回顾

总体感觉很多架构题还挺有难度，简单的也有，大概20，30%，比如关于DDOS, XSS防范的服务是什么， 还记得其他比如
- Security group 相关的： web tier 和 database tier, 1433, 443
- route53 多IP 策略（multi value）
- VPC peering, private, public, nat
- fraget, EKS
- SQS, SNS
- cloud front 的字段加密
上面都还只是不太难的，难的都记不住了

### Next
回过头，最大的收获不是获得这个证的荣誉，而是在面临工作压力，家庭琐事等等都情况下，坚持做一件有挑战的事，并做成后的成就感。其次，就是那个小哥说的SET A DEADLINE WITH A CONSEQUENCE, 为目标设置截止日，这个深有体会，之前曾设定6.1 日考试，可因为各种各样的原因一推再推，最后7月底才完成，所以没有破釜沉舟的决心是很容易懒惰下去并背离自己的预设目标。

证书有效期只有三年，所以这仅仅是一个开始，希望自己继续在云架构这条路上继续深造！

最后附一张常见VPC架构图收尾，你是否都知道？
![](https://images.troyyang.com/2022-07-31-aws-vpc-architect.png) 


