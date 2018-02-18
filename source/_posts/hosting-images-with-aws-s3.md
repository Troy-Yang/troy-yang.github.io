---
title: 正确使用AWS S3的方式之打造自己的https图床
date: 2018-2-16 22:01:22
author: Troy
tags:
- aws
- s3
- devops
- https
categories:
- aws
photos:
- https://images.troyyang.com/2018-2-16-aws-s3.png
---
***

写过博客的人都知道图床，一个托管自己博客图片的地方，当然托管到自己的服务器另当别论。常见的图床可以是新浪博客，七牛云，imgur等，但是都是有各种问题，比如我之前使用的是七牛云（也曾在[《给Github自定义域名加上HTTPS》](https://troyyang.com/2017/05/21/Add_Free_Certification_In_Blog_Step_By_Step/)博文上推荐使用），用起来相当不错，只可惜后来备案信息过期了，导致无法再使用自定义域名，更可悲的是，https不再支持，意味着尽管我的博客是https但由于有内容是http的，只能被浏览器认为是mixed-content的。

但是，前几天无意发现一片新大陆，使用aws s3结合cloudfront distribution 可以借助亚马逊云无缝快速托管自己的图片还自带https，而费用几乎是很小的，按量收费。

### 步骤概述
（如果不需要有自定义图片的域名，第三步可选）
1. 创建一个图片s3 bucket并公开。
2. 创建cloudfront distribution并绑定S3 bucket和默认证书以支持https
3. 在DNS服务商（我的是cloudflare）创建图床域名，并绑定cloudfront域名地址 

### 全球亚马逊 Or 亚马逊中国？
两者区别好像挺大的，后者曾经注册过，但是不知为什么没通过审核，可能需要公司邮箱吧。并且，如果考虑到备案等因素，建议使用全球亚马逊。（需要绑定VISA信用卡）   
全球亚马逊地址是：https://console.aws.amazon.com/console/home

### 创建S3 Bucket（存储桶）
账号创建成功后，进入S3控制台https://s3.console.aws.amazon.com，存储桶名称以待托管域名命名，比如我的是 images.troyyang.com，其他项首先都选择默认，待会再一项一项改。
![image](https://images.troyyang.com/2018-2-18-s3-bucket.png)
#### 访问权限设置

在存储桶的权限页面，选择存储桶策略，键入下面的值：
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForGetBucketObjects",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::images.troyyang.com/*"
        }
    ]
}
```
![image](https://images.troyyang.com/2018-2-18-aws-s3-permission.png)
#### 静态托管
存储桶创建成功后，进入属性页面，选择静态网站托管，键入索引文件index.html，错误文档error.html，然后保存。此时，公共访问页面已经生成，终端节点如下：
http://images.troyyang.com.s3-website-ap-northeast-1.amazonaws.com

![image](https://images.troyyang.com/2018-2-18-aws-s3-static-host.png)
上传自己的所有图片在此存储桶下，然后加上文件后缀就应该可以访问了，然而现实是残酷的，在我大天朝下，这个地址有时候是无法访问当的 。。。WTF。。。于是，得进行下面的自定义域名步骤

### CloudFront Distribution
上面地址是AWS自动生成的访问域名，并且只支持http，想要支持https，并且绑定自定义域名（images.troyyang.com），需要使用到CloudFront Distribution。

CloudFront Distribution 是AWS的内容分发（CDN）使得全球各地都能以最快的速度访问到AWS最近的节点（对于中国，最近的是东京，经测，也已经足够快），并且可绑定或者生产SSL证书。

#### 创建 Distribution
打开 https://console.aws.amazon.com/cloudfront/home， 选择Create Distribution, 传输方式选择Web选项 Get Started，在很多选项中，主要注意几项就好了（都是可后期修改）：
- Origin Domain Name中选择刚才所建的S3 Bucket 域名
- Alternate Domain Names(CNAMEs)填写自定义域名(没有的话，可不管)， 这里是 images.troyyang.com
- SSL Certificate 暂时选默认Default CloudFront Certificate (*.cloudfront.net)
- Price Class 可以只选择Use Only US, Canada, Europe and Asia

![image](https://images.troyyang.com/2018-2-18-aws-create-distribution.png)

一切配置好后，静静等待几个小时就会看到Distribution部署成功，大致结果如下：

![image](https://images.troyyang.com/2018-2-18-distribution-overview.png)

此时，得到Distribution 的新访问地址 d2dxo9yo9kwqp2.cloudfront.net，这个时候，我们找一张在S3中存在的图片，加上https再次访问 https://d2dxo9yo9kwqp2.cloudfront.net/2017-5-21-https.png 一切OK

#### 自定义证书（可选）
上面的证书是亚马逊自己提供，如果想要使用绑定自己的域名证书，可以使用AWS的Certificate Manager 证书服务，在自己的DNS服务商比如万网或者阿里云那里配置好验证方式，具体操作方法参考 https://docs.aws.amazon.com/zh_cn/acm/latest/userguide/gs-acm-request.html 。因为我暂时觉得没必要，所以没使用上。

### 绑定自定义域名（可选）
上面的是cloudfront分发的一个地址，虽然地址是固定的，但毕竟不是自家的域名，感觉不高大上，所以需要绑定上自己的图片域名。

由于我的DNS服务解析改为了Cloudflare，所以是以Cloudflare的来配置的域名，但和万网或者阿里云的配置完全一致，在DNS解析项中添加一条CNAME记录，指向Cloudfront分配的域名即可

![image](https://images.troyyang.com/2018-2-18-dns-image.png)
等待绑定解析成功后，访问 https://images.troyyang.com/2017-5-21-https.png ，一切OK
