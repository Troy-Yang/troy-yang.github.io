---
title: Wordpress 插件 Stripe Express 发布啦！
date: 2020-12-30 19:49:22
author: Troy
tags:
- wordpress
- stripe
categories:
- web
photos: 
- https://images.troyyang.com/wordprss-stripe-express-banner.png
---
***

## Stripe Express 是什么？
简单来说，Stripe Express 是一款针对wordpress 平台，帮助你使用 stripe 快速，方便完成跨境支付的一款免费插件（扩展功能收费）。其中，包括多种已经创建好的支付组件，包括一次性支付(one-time)，电子钱包（支付宝，微信，Apple Pay, Google Pay，下面重点会提到微信和支付宝），表单支付等等组件，需要提及的是，上面的组件都支持常见的各种信用卡，Master, Visi, American Express, 等等等等，以及其他国家地区的主流支付方式比如 Bancontact, FPX, EPS, SEPA, Giropay, Sofort, iDeal。

所以，只有你有一个 Stripe 的账号，那么超过三十多个国家地区的客户都可以向你支付（对于微信和支付宝，你无需申请支付宝或者微信的商家账号，即可免费收款）。


问题: 什么人更需要这个组件？   
回答: 现阶段，因为还没集成woocommence， 所以如果你没有一个完整的电子商务网站比如使用 woocommence搭建，只是一个简单的Wordpress 网站，但是你又有自己的产品或者服务需要销售，而你只是想你用户简单的点击购买，付款。

[wordpress 插件地址](https://wordpress.org/plugins/wp-stripe-express/)

## https://itstripe.com VS Stripe Express

![](https://images.troyyang.com/itstripe-logo.png)   

Stripe Express 是本人的网站https://itstripe.com下的针对Wordpress 平台的一个插件，先说说 itstripe.com， 创办的原因其实还是在我们国内，大部分人肯定知道Paypal，却不知道Stripe，更别说用过，当然也和Stripe 暂不支持中国商家的原因分不开。殊不知，国外Stripe普及程度远大于我们的想象，很多网站都会加上对Stripe 的支持，因为这意味着你的网站可以面向全世界超过30个主要国家的客户收费，包括中国！所以想要做跨境支付的话，Stripe 你必须要熟悉！   

不继续布道了，说会正题，itstripe.com 的创办主要是从 wordpress 的 stripe 插件开始，毕竟全世界超过30%的网站都是他创建的，而且现在也依旧火爆。再加上之前很多朋友都在咨询我关于 stripe 在wordpress上的问题，所以主要侧重点会是在 stripe express 这款插件上。其次，网站会包括产品介绍，以及插件的文档，还有和stripe 相关集成服务，如果你有集成这方面的需求的话，或者Web 的支付开发，可以联系我们。   

## Stripe，微信 和 支付宝   
这是一个最重要的原因之一促使我想要做这么一个东西。有这么一部分人：1. 小商家或者个人网站用户想要接入微信或者支付宝，方便国内用户收费，2. 国外的中小网站想要针对中国用户微信和支付宝收费。但是对于他们而言，由其老外，要想接入微信或者支付宝支付接口，门槛还是有点高，需要去申请商家账号，但是，stripe 却在这方面有着天然优势，由于已经和alipay 和 wechat 达成协议，Stripe 完全可以实现上面的收费，其中stripe 会收取3.4% + $0.50每笔的服务费。   

之前写过一篇关于 [stripe集成 微信和支付宝](https://troyyang.com/2018/01/21/stripe_guide_alipay/)的文章，反响挺大的，看到很多评论和转载，也收到很多咨询的邮件，但是之前的那篇从技术角度其实有点老了，我会另外抽时间重新写一个更通用的集成方式（已经在这款插件中实践了）

## 后续
本着布道外加对自己产品的宣传，我计划的是在明年多写写 stripe 相关的技术文章，也许有的也只是翻译而已，希望自己能做得到！   

回想这半年多的开发时间（包括插件和官网），白天正常上班，晚上继续开发，连周末都不想出门，像打鸡血一样的完善产品，终于迎来了发布的日子（实际发布的日期应该是11.25日，上传至Wordpress 插件库的那天）。无论这款插件将来如何，安装量怎样，有过这么一段为了某个目标而全力以赴的日子也是极好的！

![](https://images.troyyang.com/wordprss-stripe-express-preview.png) 