---
title: 一个人如何开发个人产品
date: 2022-01-21 11:08:49
author: Troy
tags:
- stripe
- payment
categories:
- stripe
excerpt: 自己业余开发的stripe express 产品发布一年，收获100+来自全球各地的用户，包括10+的付费用户, 个人研发产品的路还在继续，记录下这一年的点滴。
---
***

经过一年的打磨，现在产品的状态应该处于稳定上升期，收获100+来自全球各地的稳定用户，包括10+的付费用户，不算大的成功，但也能激励我继续投入, 相关的输出部分提现在下面的link 中：
* [https://itstripe.com/](https://itstripe.com/)
* [https://docs.itstripe.com/](https://docs.itstripe.com/)
* [https://wordpress.org/plugins/wp-stripe-express/](https://wordpress.org/plugins/wp-stripe-express/)

### Idea 

是什么促使你有做这个产品的想法，一定是某个痛点被暴露，无论是你自己遇到或者朋友，客户遇到，做这个有前途吗？收益值得做吗？这些应该是最初的那个想法应该带给你的第一个问题。以我做的这个为例，因为之前写的一篇关于stripe在中国的微信和支付宝支付的文章，被很多读者关注，也收到很多询问问题的邮件，本着能帮就帮的原则，绝大多数邮件也都仔细回复，甚至有些还被添加了微信，在和好多用户的沟通中，发现好些都是期望用到wordpress 中去，于是开始了对WP 的了解，之前懂一点WP，知道很多人在用，可没想到居然多年过去，还是这么火爆，维基百科显示超过全球40%的网站都是由它搭建，并且还有上涨的趋势(大火的 wix 也只能占零头不到)，实在惊呆，其中不乏很多厂商依靠他来售卖插件和主题，市场还是足够大。为何我不能做一款基于WP的免费+付费插件，定位于前期面向中国，后期更多海外国家支付，再想大一点，专做Stripe 集成服务，毕竟这几年对stripe的开发还是很熟悉，而国内对这部分的了解还是很少？

### 前期调研

找出竞争者，看下当下的市场情况，能做到多大， 能比竞争者做的更好吗，甚至技术的调研。经过一段时间的调查，列出了一个100%匹配的竞争者以及几个间接竞争者。从调研的角度看，这个产品值得做，为什么，因为世面上已经有，就代表有市场，不用担心做的东西没人用，这倒是省去了一大顾虑，接下来的考虑就是如何超过他们。从产品角度而言，对于这个直接竞争者，我有90%的把握比他做的更好，既然他能买出产品，那为什么我不能？所以后面定的第一个短期目标就是超过他，后面从自己的客户信息来看，似乎也的确也做到了。但针对中国支付，这个市场的确有点小，估计一年最多几十个付费用户，所以产品也不能单一，可以扩展到海外其他国家，这些就是这几个间接竞争者，市场够大（做的最好的一年有上万个的客户），竞争也必然更加激烈，但也是迟早需要面对的。

### 合伙人

之所以想找合伙人，初衷是自己之前也独立做过一些好玩的东西，知道单打独斗的困难，不是因为事情繁杂，而是孤独，以及孤独带来的惰性，希望两个人的话，能相互互补，互相搀扶。后来也找到了一个在德国的好朋友，可惜没多久因为他忙于学业，最终还是落到了一个人头上，经过这短暂的合作，深深的明白这句“一个人可以让你走的更快，一个团队可以让你走的更远”。个人的建议是，如果是产品初期，并且自己属于产品控以及强势的一方，最好还是一个人做，会省掉你很多时间和精力，不用去想沟通的成本，后期如何合作运营，想法的冲突和利益的分配等等，一个人会让项目推进的更快更符合自己的初衷，当然事情会更多更杂。但是后期，等到产品雏形一出，甚至投入市场，则需要更多更专业的投入和设计，此时拿着产出去找投资或者合伙人不是更有信心吗？

### 总体规划
列了个之前做的计划图，实际的计划远不止这个图
![](https://images.troyyang.com/2021-1-20-stripe-express-plugin-plan.png)

### 产品研发

想做一个专业的针对国外的软件产品，不是简单的前端加后端，再套个UI 就完事了，至少下面的项目是需要考虑的：

#### 官网 (https://itstripe.com)

（主域名，Logo, 企业邮箱，技术支持， 产品介绍，演示(Demo)，价格定位，各种条约：隐私，授权，退款条约等等）

门面必须要有，并且一定要专业！其中，主域名一定要想好，后期所有推广，品牌都和这个息息相关，不能后面随便修改，官网的实现是基于gatsby JS，然后自己找了个好看点的主题魔改，虽然还是很丑（一位付费用户抱怨这网站看起来不专业），但还能将就用，最后托管到gitlab 的page 上，后端就一个AWS lambda 提供API 来发送contact me的邮件。

企业邮箱可以使用阿里云的企业邮箱服务，5年免费，可以薅一下，有企业邮箱会让你的网站更加专业，客户会更加信任，什么sales@itstripe.com, support@itstripe.com 等等等等，虽然都是我一个人在打理，哈哈

条约，一定要重视，从google analysis 上看，神奇的是，如此偏门的页面居然也有不少人会去点击，让我不得不重视其中的每一条每一款。 

#### 产品帮助文档(https://docs.itstripe.com)

产品当然得有帮助文档，要不然客户每次来烦你，你的邮件一定会爆的，什么quick start guide, setting, Q&A 放文档上就好了，节约你和客户的大把时间。 

#### 产品 Demo (https://itstripe.com/demo, https://demo.itstripe.com)

当然也少不了了，哪怕是静态的也好，这是目标客户点击率最高的地方。

#### 产品研发 ([https://wordpress.org/plugins/wp-stripe-express/](https://wordpress.org/plugins/wp-stripe-express/))

做的WP插件，需要考虑，如何安装，激活，如何区分付费和免费用户，如何升级付费用户，客户如何支付，如何管理License（是否过期等）

自学了php，wordpress API, 外加 4 个 react repo(官网，文档，插件后端，插件前端) ，对于如何集成付费用户，又使用到了freemius 来管理代码和客户，为了产品的介绍，又摸索学习了Figma 设计图形，logo 

#### 运营

保证优质的回复每一封客户的邮件，遵守退款条约（退了两三次，好心痛），从客户需求里或者自己挖掘新功能（千万别模仿竞争者，保持产品的独立性），保持定期产品更新，让目标客户或者现有客户知道这产品的活力，WP 上不少插件都是没人维护状态。

下面是我指定的 TODO 运维图，有些是客户提的需求，一些来自自己发现需要优化的地方。
![](https://images.troyyang.com/2021-1-20-stripe-express-plugin-todos.png)

#### 客户的 feedback 是你产品最大的财富
下面是最近来自德国一位付费用户的邮件回复，真的深深的让我体会到，你的产品远没你想的那么好，但你的付出总会得到回报：

> So I’m happy about you being so responsive and willing to help, because looking at the low number of installations shown for your free version on Wordpress org, the at first not working feature for metadata, broken homepage and the failed payment and no imprint with physical company address on homepage did not make the very best impression at first. You have proved, that my first impression was not right, but I bet others that evaluate the best Stripe plugin might come to a similar conclusion. 

### 思考

这一年以来，还是花了太多的业余时间在这上面，包括多少个周末，甚至大理游玩都在弄，到现在也只是踏出了第一步， 列表里还列了很多关于这产品的TODO LIST，包括UI 的更新，大功能新增等，希望来年能完善好。

产品的故事实在太多，写着写着就停不下来，也许这就是折腾的意义，对提升个人知识的广度实在太多了