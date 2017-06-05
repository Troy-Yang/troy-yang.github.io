---
title: 给Github自定义域名加上HTTPS
date: 2017-5-21 15:59:22
author: Troy
tags:
- https
- github
categories:
- security
photos:
- https://images.troyyang.com/2017-5-21-https.png
---
***
 
### 写在开头
随着Https越来越成为一种趋势，最近也给自己家博客弄上了高大上的https，主要是结合使用的cloudflare和七牛云（图床）使用，关键是免费！所以想把这个过程记录下来，万一有人用得到呢。(还想抽空写写对Https的原理的理解，主要目的还是总结前段时间自己对Https的学习。)

### Https时代
>According to Mozilla since January 2017 more than half of the Web traffic is encrypted. [wiki pedia](https://en.wikipedia.org/wiki/HTTPS) 

维基百科告诉我们，自从2017年1月，超过一半的网络请求是通过加密过后的。百度也告诉站长们：
> 为了给用户提供一个安全可靠的网络环境，继启用https加密之后，百度搜索再次重磅推出：全面支持https页面直接收录；另外从相关性的角度，百度搜索引擎认为权值相同的站点，采用https协议的页面更加安全，排名上会优先对待。[百度站长](http://zhanzhang.baidu.com/wiki/392)

Google 今年更厉害，从1月份开始，所有没有用Https的网站会在Chrome浏览器地址栏前面加上不安全的图标：
>Beginning in January 2017 (Chrome 56), we’ll mark HTTP pages that collect passwords or credit cards as non-secure, as part of a long-term plan to mark all HTTP sites as non-secure. [Google](https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html)

百度2015年实现全站HTTPS，并且Google和百度都收录Https的网站并且提高其搜索排名，国外大型互联网网站基本都使用https，所以，有人说2017年是一个Https年。那既然如此，高大上的Https我们普通老百姓玩得起吗？要知道，一般的Https证书动辄也是几千块一年！

### 天上掉下个证书
没错，Cloudflare免费提供给证书，尽管你没有自己的服务器。Cloudflare是一个相当厉害的DNS服务商和CDN提供商，提供各种安全防范解决方案，全世界各地都有他的节点，对于国内，百度选择和他一起合作就是个很好的栗子，所以不用担心国内解析速度。所以我准备把主站的证书使用Cloudflare提供的。

再一个就是七牛云，作为博客，不可能把文章图片全都放github上，所以最好还是要有自己的图床，但是好多图片床都是不支持https的，好在七牛可以免费申请证书。所以这是第二个证书。

### 准备
因为自己的博客站点暂时是托管到github上的，不是自己的服务器，所以并不能使用[Let's encrypt](https://letsencrypt.org/)在服务器端生成免费的证书，但好在一切都有cloudflare!

- ~~有一个自己的域名~~（废话）
- 自己的Github博客地址 (一般都是https://[username].github.io)
- 注册Cloudflare
- 注册七牛云 （如果有自己的图片床，并支持https, 可省去）

Cloudflare，主要用于域名解析，这是成功的关键！只有在他那里域名解析，他才能为我们提供多种证书服务。

### 开始第一步: Github 自定义域名
我们知道Github可以托管开源和私自项目(私有收费)，同样，功能强大的Github也可以提供静态页面站点，默认站点是 **https://[username].github.io** ，对应的站点代码是在reponsitory名为[username].github.io 下，如果没有，请创建自己的默认repository，可参考官方[说明](https://pages.github.com/)

![image](https://images.troyyang.com/2017-5-21-https-github-home.png)
创建成功后，我们就成功的创建了自己的个人站点: https://troyyang.github.io 显然这还不是我们的最终目的。

接下来，打开这个repository, 定位到repo setting，绑定自己的域名，绑定完成后，我们可以看到repo代码下新加了一个CNAME的文件，换句话说，其实我们也可以直接在repo中直接添加这个文件即可，而不需要在setting中去手动设置，这个在我们静态站点发布的时候非常有用，因为每次发布后提交都会删除原有的文件，所以我们就可以在生成的文件中默认加上这个文件。

![image](https://images.troyyang.com/2017-5-21-https-github-home-customdomain.png)

CNAME
```
troyyang.com
```

### 第二步：使用Cloudflare解析域名
#### 修改默认DNS服务器
在使用Cloudflare之前，我使用的是万网（现在是阿里云）的默认DNS服务器，也就是
```
dns9.hichina.com
dns10.hichina.com
```
现在修改为Cloudflare
```
apollo.ns.cloudflare.com
mary.ns.cloudflare.com
```
个人觉得cloudflare作为DNS服务器特别快，修改了任何A记录或者其他记录会马上生效，不用再等待几个小时。
#### 域名解析
登录cloudflare, 将域名A记录指向Github服务器地址(同时也可指定CNAME记录去加上www)，绑定完成几分钟后访问troyyang.com或者www.troyyang.com 就可以访问到我们Github上那个默认的repo静态站点。这个时候可以尝试去访问https://troyyang.com 理论上是不会成功的，哈哈。
![image](https://images.troyyang.com/2017-5-21-dns-cloudflare.png)

### 第三步：使用Cloudflare的 Universal SSL 证书
在Cloudflare管理页面，导航到Crypto，我们会看到SSL在Cloudflare上使用证书有三种方式: Flexible、Full、Full Strict，
- Flexible SSL: 在访客与Cloudflare之间是加密的，从Cloudflare到自己服务器是不加密的，所以
1. 你不需要在站点服务器上安装任何证书。
2. 访客可以在浏览器地址栏上看到加密的图标。（证书签名来自Cloudflare）
- Full SSL: 从访客到Cloudflare, 从Cloudflare到站点服务器都是加密的。Full 和 Full (Strict)不同之处在于Full Strict会去验证你服务器上的证书是否合法，而Full不会验证，所以你可以在你服务器上安装任何证书，包括自签名证书也是可以的。当然
1. 访客可以在浏览器地址栏上看到加密的图标。（证书签名来自Cloudflare）
- Full SSL (strict): 从访客到Cloudflare, 从Cloudflare到站点服务器都是加密的。你必须在你的服务器上安装有可信赖的CA证书，这个证书必须是未过期，包含有域名等信息的。同样
1. 访客可以在浏览器地址栏上看到加密的图标。（证书签名来自自己申请的CA）

三种模式如图
![image](https://images.troyyang.com/2017-5-21-cloudflare-ssl.png)

当然，我们选择Flexible，选择后我们还需要在下面的Edge Certificates栏目中新增Universal SSL 证书（当初以为选择Flexible后就等待24小时激活就完了，可几天过去了状态一直处于initilizing certification, 问了客服后，客服帮我加上这个Universal SSL证书就好了，给他们客服赞一个）

在Edge Certificates中，点击Order SSL Certificate按钮，弹出几种证书，我们当然选择免费的那个, 然后填写证书服务的域名troyyang.com和*.troyyang.com.

![image](https://images.troyyang.com/2017-5-21-cloudflare-universal-ssl.png)

一步一步完成后就等待了，一般情况不会超过24小时就会生效，激活后就如下图（我个人选的是Full），然后就可以尽情的访问 https://troyyang.com

![image](https://images.troyyang.com/2017-5-21-cloudflare-universal-ssl-success.png)

如何你查看域名证书，细心的你除了看到Cloudflare签发的证书外，还有证书有效期只有半年，这个不用担心过期，客服小哥回复说他们会在快过期时自动延期的。

![image](https://images.troyyang.com/2017-5-21-cloudflare-ssl-troyyang.png)

### 七牛图床Https支持
Cloudflare客服小哥在帮我加好Universal SSL证书后，回复我说你网站还包括非https的内容也就导致所谓的mixed-content 问题，也就导致我当时在地址栏还看不到那个https图标，这个是我能想到的，因为我知道我的图片还都不是https，因为图片存放在七牛云上的，赶紧回去看看七牛是怎么支持https，于是在踩了无数坑过后终于让图片支持上了。

#### 第一步： 在七牛上使用自定义域名 (images.troyyang.com)
要使用https图床，必须得使用自定义域名（我使用的是images.troyyang.com），这个比较简单，可以参考[页面](https://developer.qiniu.com/fusion/manual/1367/custom-domain-name-binding-process)，我们可以先不选择https模式，让正常http先工作。主要工作就是在Cloudflare上新增一个CNAME记录指向七牛为自己域名生成的域名地址就好了。一切正常后，我们应该可以访问任意图片比如http://images.troyyang.com/2017-05-01-hexo-2015-wordpress.jpg

要使用自定义域名，在七牛上，你必须等往账号里充至少10元，让自己成为标准用户，

#### 第二步： 给自定义域名加上https支持
现在要给自己的自定义图片域名加上https支持，在七牛上有两种方式，一种是上传自己已有的证书，第二种是申请免费证书或者购买证书。对于第一种，除了上传自己的证书公钥以外，还需要私钥也一同上传，所以我还是选择的第二种，反正也只是一个二级域名的证书，也并不存在任何私密性的东西。

在七牛管理页面，在证书页面选择购买证书，然后选择TrustAsia的DV限免性，最关键的就是DNS的TXT验证了（[验证指南](https://developer.qiniu.com/fusion/manual/1703/qiniu-free-certificate)），我也是在使用了三次申请后才弄明白申请失败原因: Github上默认会解析出两个IP地址

![image](https://images.troyyang.com/2017-5-21-qiniu-dig.png)

解决方案就是，在Cloudflare上先删除所有A记录，CNAME记录，先添加上用作域名验证的Txt记录，等证书申请成功后（大约十几分钟），在恢复A记录，CNAME记录。这个是我Cloudflare上的相关解析最终样子
![image](https://images.troyyang.com/2017-5-21-cloudflare-dns-all.png)

有一点需要说明的是在七牛上如果只使用http的话，只要一个月不超过20G流量，是不会收费的，但是https是不在免费额度里面的。



