---
title: Stripe开发使用指南--国际支付（含支付宝）
date: 2018-1-21
author: Troy
tags:
- payment
- alipay
- finance
categories:
- Web
---
***
前段时间，因为Jason让我帮忙把Stripe支付集成到他个人网站上去，让我有机会接触到支付系统开发，同时也因为苦于没有找到太多中文方面相关文档介绍，所以做个总结，也方便以后有需要的同学。

### 关于Stripe支付

第一次听说Stripe还是在几个月前的一个新闻上了解到，大致说的是美国总统都在使用它，极有可能成功下一个Paypal。这么受欢迎的一个支付平台到底有什么好处呢？我粗略搜集了一下：

- 一条代码让你网站支持繁琐的国际支付功能。（对于创业公司，再合适不过）
- 向全球化业务拓展会成为Stripe的机会。即使支付货币不同、方法不同，Stripe都能打通各自的渠道，让全球化交易不受支付阻碍。
- 市值超过90亿美元，和Tweeter,Lyft，Best Buy等以及国内的 Alipay, WeChat等有合作

重点说下第二点，什么意思呢，就是说客户可以使用人民币支付，如果商家（收款方）是美国的银行的话，就自动转成美元，是英国的银行就自动转为英镑！（**可惜暂时不支持商家是中国（但Stripe也可提供解决方案，就是使用Atlas去创建一个美国的代理公司）**）

而对于我们程序员的话，当然最关心第一条，因为他的宗旨就是开发极简，对开发人员超级友好！至于多友好呢，请往下看。

### 最简洁支付

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Stripe Checkout</title>
</head>
<body>
   <form action="/your-server-side-code" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key="[Publishable key]"
    data-amount="999"
    data-name="troy yang"
    data-description="Widget"
    data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
    data-locale="auto"
    data-zip-code="true"
    data-currency="eur">
  </script>
</form>
</body>
</html>
```
就这么几行代码，我们就已经实现了客户端所有事：

![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-13-stripe-checkout.png)

真的是超级简单，但是这种方式是基于信用卡支付的界面，已经可以满足一半的支付方式，对于其他的三方支付，比如3D secure， 支付宝，微信，甚至比特币，Stripe为我们提供了其他方式，等下我就使用支付宝来举例。

### 注册 Stripe 账号
和注册支付宝账号一个道理，首先注册账号，然后绑定自己银行卡，BUT, 就像前面提到的，不支持中国，所以就算注册成功，也没法激活，也就没法收款。
![](http://ommnrsgt0.bkt.clouddn.com/2018-1-13-stripe-support-countries.PNG)

对于中国商家怎么办呢，我能想到的就只有这几个办法：
- 自己去支持国家去办理张银行卡
- 使用国外的朋友银行卡
- 使用Atlas

对于Jason来说，因为他是英国人，所以他可以创建他的主账号，然后添加我的stripe账号到他team memeber账号列表中，这样我就可以访问他账户下所有开发者需要的权限。邀请成功后，Dashboard页面

### 两个阶段

Stripe有两种模式，一个是测试模式(Test Mode)，一个是生产模式(Live Mode)，测试模式下产生的金钱交易都只用于测试，当所有测试通过后即可切换为Live模式。唯一的不同就是**Publishable key** 和 **Secret key**， 一会我们会用到这两个值。
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-13-stripe-test-mode.PNG)

### 交易流程
Stripe有几个概念用于整个交易阶段和状态：
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-18-workflow.png)

#### 创建 Source

使用自己的**Publishable key**来创建一种source（比如Cards, 3D Secure, 支付宝，甚至比特币等）, 创建source完了后，就会得到一个用于交易的Token或者是一个跳转到其他支持的三方支付平台（比如支付宝支付）页面等待用户支付。当用户支付（或者取消支付）完成，自动跳转回到指定结果页面。用户支付页面结束后，可能会得到三个状态：

- source.chargeable 用户授权（支付）成功
- source.failed 用户拒绝授权（支付）
- source.canceled 超时支付

#### 创建 Charge
当用户支付成功后，此时在Stripe端的支付状态变为source.chargeable，意思就是授权成功了，你可以在我支付宝平台上扣钱啦，所以，此时我们还需要使用**Secret key**来创建Charge来完成，官方推荐的是使用webhooks来捕捉状态，并且完成Charge的创建。当Charge完成后，整个支付完成，会得到一个charge.succeeded的状态。

#### 使用 webhooks
Webhooks 里提供了几十种状态，所有这些状态都会注册到Stripe里一个叫webhooks事件钩子的地方，我们可以指定不同事件的触发时，转发数据到某个我们自己搭建好的Web Api上。（下图是我们的服务器end point, 因为我们没有用到服务器，使用的是亚马逊lambda做一个Serverless）
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-18-web-hooks.png)

## 举个支付宝的栗子

### 服务端 （Serverless）
以AWS的Lambda + API gateway为例， 其中，前者是用来定义API， 后者是做路由。
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-18-lambda.png)

![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-18-lambda-source-chargeable.png)

![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-18-lambda-variable.png)

创建Charge代码：
```
'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.handler = (event, context, callback) => {
    console.log("request: " + JSON.stringify(event));

    let stripeData = event.data.object;
    stripe.charges.create({
        amount: stripeData.amount,
        source: stripeData.id,
        currency: stripeData.currency || 'usd',
        description: 'My Englishtutor 30 days' || ('Stripe payment ' + event.id),
    }, function(err, charge) {
        if (err && err.type === 'card_error') {
            context.fail(new Error(err.message));
        }
        else if (err) {
            context.fail(err);
        }
        else {
            context.succeed({ status: charge.status, success: true });
        }
    });
};
```


### 客户端 (Web)
多种实现方式：
#### Checkout
文章开头那段<form>的集成代码就是使用的checkout方式，非常简单。集成代码直接帮你完成了客户端的部分，服务端只需要定义好source.chargeable的钩子API 就好了。

在做支付宝开发的时候，发现可以直接使用Checkout的方式：
```
<form action="https://xxx.execute-api.eu-central-1.amazonaws.com/stripepayment/xxx" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key="pk_test_xxx"
    data-amount="30000"
    data-name="myenglishtutor.eu"
    data-label="Pay With Alipay"
    data-description="30 days"
    data-image="/images/logo.png"
    data-locale="auto"
    data-alipay="auto"
    data-currency="usd">
  </script>
</form>
```
但是总是得到这个错误：
```
Unrecognized request URL (POST: /v1/alipay/send_sms). Please see https://stripe.com/docs or we can help at https://support.stripe.com/.
```
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-21-alipay-checkout.png)

发邮件给Stripe support team得到的结果是为了以后的扩展，Stripe不再提供alipay的checkout方式， 无奈，只得使用下面的方式。
#### Stripe.js & Elements
当然对于如果你觉得Checkout的方式集成度太高，不够灵活，那Stripe.js是你最好的选择。

Stripe.js其实就是客户端的一个JS核心类库，Elements是它的UI类库，其实上面的Checkout代码就是Stripe使用两者给我们封装好了的，避免我们直接接触敏感信息，但是其实质都是一样的，都是用来创建source。这里就直接贴出客户端的代码了(这里没有用到Elements做UI，因为就是一个按钮支付，太简单，所以没用到)：
```
var stripe = Stripe('pk_live_xxxx');

function alipay(amount) {
    showLoading();
    stripe.createSource({
        type: 'alipay',
        amount: parseInt(amount),
        currency: 'gbp', // usd, eur,
        redirect: {
            return_url: 'https://xxx.eu/pay/result.html'
        },
    }).then(function (response) {
        hideLoading();
        if (response.error) {
            alert(response.error.message);
        }
        else {
            processStripeResponse(response.source);
        }
    });
}

function processStripeResponse(source) {
    window.location.href = source.redirect.url;
}
```
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-21-alipay-console.png)


这里需要注意几点：
- currency 必须是Stripe账号所在地货币，也就是绑定的银行卡所在地，因为Jason是英国人，所以必须使用gbp（这里愚蠢如我的犯了一个常识错误，一直以为英国也是欧盟的，所以使用eur，结果怎么也不对，直接哭晕在厕所）
- return_url指向的是当用户重定向到我们常见的支付宝支付页面后，跳转回支付完成的页面，在这个返回页面中，因为支付宝是同步完成支付的，所以我们可以去查询charge.succeeded的状态来判定是否用户支付是否完成。


当一切OK，点击支付按钮，就会跳转到支付宝支付页面(其他支持的三方平台也可以)，如下：
![image](http://ommnrsgt0.bkt.clouddn.com/2018-1-23-alipay-success.png)
