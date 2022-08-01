---
title: 中国用户如何免费激活Stripe?
date: 2021-06-02 11:08:49
author: Troy
tags:
- payment
- stripe
categories:
- stripe
photos: 
- https://images.troyyang.com/stripe-worldfirst.png
---

# 中国用户如何免费激活Stripe?

本文会介绍无需开设海外银行账号或者香港账号，并免费的通过注册激活Stripe账号并提现，亲测有效！

主要通过使用万里汇海外账号绑定激活，其中万里汇是蚂蚁金服旗下的产品，值得可靠。（不是给万里汇打广告哦）

### 什么是Stripe

想象你是一个跨境电商，想要把产品卖到全球，却面临一个问题，商品标价$100，日本客户想直接支付日元，欧洲客户想支付欧元。。。你不可能要求客户说我只支持美元，请兑换后再支付吧？

所以如果你还不知道Stripe，那推荐你去了解下。作为和PayPal一样存在的支付巨头（现在市值 $950亿），在国外早已火得一塌糊涂，使用他作为支付平台的商家和网站数不甚数，消费者渗透率覆盖了全球135个国家。。。

[]()

### 中国商户，NO

遗憾的是，如果你是身在中国，那么是不能激活Stripe 账号的（不激活只是注册账号倒是可以，但是没法收款和体现，只能测试），可以查看现在商户支持的[40多个国家/地区列表](https://stripe.com/global), 其中香港是可以的。所以你能看到，这个注册公司地址里是没办法选择中国🇨🇳的，That's the problem!

![](/images/uploads/2021-06-02-stripe-reg-china-issue.png)

### 如果解决？万里汇 或者 TransferWise

问题的瓶颈在于stripe 激活的时候，需要提供你的商业信息以及银行信息，并且保证银行上的名字和账号里的个人姓名一致。但又由于商业信息的国家地区只有上面提到的，所以也就导致中国用户没办法激活。

解决办法的思路就是，使用万里汇注册个香港账号或者其他国家的银行账号（虽说是虚拟的，但和实际没区别），然后再根据账号的信息拿去Stripe激活，看似简单，但还有很多坑需要趟，且听我慢慢道来。

---

### 注册万里汇

点击注册地址 [https://portal.worldfirst.com.cn/register](https://portal.worldfirst.com.cn/register)， 

1. 然后按步骤选择支付网关, 这里可以按个人情况多选几个(最好把stripe 勾选上)，虽然我也不知道有多大影响

![](/images/uploads/2021-06-02-worldfirst-reg-gateway.png)

2. 选择类型，可以是个人， 也可以是公司，这里我选的个人

3. 填写基本信息，按部就班的填好就行，注册就算成功

### 认证账号

注册好了，是非认证状态的，这时是不能创建海外账号，还需要提供相应的信息上传去验证（据说可以支付宝快捷验证，但是我没发现有，只能拍照上传）

认证一般会持续一两天验证，等着收邮件就好了，如果有问题，可以联系自己的万里汇客户经理（真是一对一服务啊，这点好）

![](/images/uploads/2021-06-02-wordfirst-reg-home-page.png)

### 创建海外货币账户

终于到了关键步骤了，这里可以创建多个账户，每个账户就像自己银行卡一样，有卡号，为了stripe 注册方便，我创建了一个香港账户和一个美国账户

![](/images/uploads/2021-06-02-wordfirst-account-detail.png)

到了这一步，恭喜你，你已经开通了海外账户！关键是这个银行信息对后面的Stripe激活是非常重要。

---

## 创建和激活 Stripe 账号

首先创建Stripe 账号，[https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)， 国家/地区可以选择香港，创建好之后，登录进入主页面， 这个时候如果你暂时不想激活，是完全可以的，可以切换**测试**模式进行你的支付开发测试，**测试**模式基本和**在线**模式一模一样，除了测试的支付账号是假的以外 （PS， 我就是没激活使用了一年多，纯粹作为开发使用）

![](/images/uploads/2021-06-02-stripe-dashboard.png)

### 激活Stripe 账户

点击 **激活你的账户** ， 这里看起来有很多步骤，不用怕填错，后面都是可以跳回去改的。

公司结构：

![](/images/uploads/2021-06-02-stripe-activate-comany-info.png)

选择香港，或者其他上面货币账号国家，地址可以填银行账号地址，类型可以选个人（如果公司的话，据说stripe 会对你账号保护性或者服务更好），点击下一步

公司代表：必须是你自己在上述银行账号的姓名，否则可能会无法体现到你银行

![](/stripe-activate-represent-name-info.png)

地址信息可以继续用银行地址，电话号码最好是用中国的，可以选CN, 填写自己号码，因为后面可能会用来用来登录短信验证之类的，身份证ID 这个我没记错的话，是随便找的一个ID（只要位数和格式对了就行） ☹️

![](/images/uploads/2021-06-02-stripe-activate-represent-info.png)

银行详情：选择在万里汇创建的银行信息就行

![](/images/uploads/2021-06-02-stripe-activate-bank-info.png)

然后一直填下去，保存

### 激活成功了吗？

上述没问题的话，确实激活成功了，你也可以切换到线上模式去收款了，但是却无法提现（转账）到你银行卡里，还有两个重要的未完成步骤警告：

身份信息不匹配（个人信息验证失败，当然了，ID 都是假的） 和 US Tax Form （美国税收表）

![](/images/uploads/2021-06-02-stripe-activate-ux-tax-sign.png)

两个问题一个一个解决：

- ID 不匹配，进入提示的配置，只需要上传自己的身份证正反面就好了，一天左右就验证成功（不知道如何验证的，可能是后台人工验证，保证姓名一致就行，所以一定上传自己真实的身份证就，地址用自己中国地址）
- W-8 form，一定要选非美国居民（勾选No），然后点击提交，会被导航至表单填写页面，基本信息stripe 已经帮你预填了，只需要签上个人姓名就好了

![](/images/uploads/2021-06-02-w-8-form.png)

[documents-for-identity-and-home-address-verification](https://support.stripe.com/questions/documents-for-identity-and-home-address-verification#upload)

[w-8-forms-collected-by-stripe](https://support.stripe.com/questions/w-8-forms-collected-by-stripe)

等着这两个错误完成后，这个账号就算真正激活完成，并可以完成提现（每天，并且非常快）。

![](/images/uploads/2021-06-02-stripe-payout.png)

---

### 万里汇提现到人民币(成功)

现在万里汇香港账号已经有收到的港币了，但如果需要的话，需要转为人民币（可转到支付宝），但根据万里汇客户经理说明，这是需要提供相应凭据，也就是stripe 或者 paypal 上的支付记录，表明来历明确。提现过一次，因为金额不大，并且提供了paypay 的收款记录，所以成功提现。

特别提醒的是，这篇文章目的只是为激活stripe指南， 不为跨境转账成功负责，请酌情选择。

特此声明，本文禁止转载至除 troyyang.com, [itstripe.com](http://itstripe.com) 以外的网站


相关推荐文章：   
[wordpress stripe插件，支持微信和支付宝](https://troyyang.com/2020/12/30/wordpress-stripe-express-released/)   
[stripe集成 微信和支付宝](https://troyyang.com/2018/01/21/stripe_guide_alipay/)   