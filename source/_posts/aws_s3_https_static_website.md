---
title: AWS系列之S3 + Cloudfront搭建https静态网站
date: 2018-5-12 09:37:22
author: Troy
tags:
- https
- aws
- hexo
categories:
- aws
photos: 
- https://images.troyyang.com/2018-5-12-hexo-s3.png
---
***

本文和之前写的[《正确使用AWS S3的方式之打造自己的https图床》](https://troyyang.com/2018/02/16/hosting-images-with-aws-s3/) 内容非常像，但也有新的内容如自动上传部署和自定义证书、Route53部分，这里主要补充新的内容。

### 温馨提醒
1. 个人用户请注册AWS 全球账号，因为AWS 中国账号似乎只对企业开发而无法注册。
2. AWS S3默认地址中国无法访问，需要使用Cloudfront的新地址才能访问，而且访问速度不慢，你能感觉到我博客的图片加载慢吗？
3. S3、Cloudfront、Route53等收费异常的低，几乎可以忽略。

### 架构概述
![image](https://images.troyyang.com/2018-5-12-myenglishtutor-s3.png)
采用Hexo作为静态网站生成器，主题使用的正是我自己开发的hexo-theme-twentyfifteen-wordpress，整个网站代码托管在github的私人repo下。当写好文章后，使用Hexo生成静态代码html+css+js+image，并使用写好的s3 SDK 上传工具到指定aws 的存储桶里进行静态托管 （之前使用的是github的Travis 自动部署，但由于私人Repo需要收费，于是放弃Travis改用自己的工具上传）。上传到S3里之后，使用Cloudfront做内容分发，并绑定自定义的https证书，最后，使用Route53做自定义域名的绑定。

### 生成 IAM access key 用户子账号 
此账号可用于编程的方式访问AWS 的所有指定资源，这里我们创建的IAM 账号只需要有S3的读写权限

进入 https://console.aws.amazon.com/iam/home?region=ap-northeast-1#/users

选择add user后， 一定要选择programmatic access这种编程方式的子账号，而另一个console账号针对的是用户名，密码登录的子账号
![image](https://images.troyyang.com/2018-5-12-aws-iam-step1.png)

指定该账号可访问的权限
![image](https://images.troyyang.com/2018-5-12-aws-iam-step2.png)

保存access id和key
![image](https://images.troyyang.com/2018-5-12-aws-iam-step4.png)

### 使用S3 SDK自动上传
默认情况下，所有Hexo编译后的文件都放在public文件件下，所以只需要拷贝到S3 存储桶下，当然可以手动拷贝，但是实在太麻烦。所以写了个node tool去自动上传（部署）。

[下载](https://gist.github.com/Troy-Yang/436a62fb14d9e07e1aa3534f1c351050)
--s3-deploy
------config.json
------index.js

config.js 里包括的是AWS AMI 账号信息，确保region使正确的区域, 具体参考[区域列表](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)
```
{
    "accessKeyId": "xxxxxx",
    "secretAccessKey": "xxxxx",
    "region": "ap-northeast-1" 
}
```

index.js，其中myenglishtutor.eu是存储桶的名字(命名的时候请用域名)
```
var path = require("path");
var fs = require('fs');
var mime = require('mime');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3-deploy/config.json');
let s3 = new AWS.S3();

const uploadDir = function (s3Path, bucketName) {
    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function (filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length + 1);
        let mimeType = mime.getType(bucketPath);
        let params = { 
            Bucket: bucketName, 
            Key: bucketPath.replace(/\\/g, '/'), 
            Body: fs.readFileSync(filePath),
            ContentType: mimeType
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName);
            }
        });
    });
};

uploadDir("public", "myenglishtutor.eu");
```

最后在package.json文件中，添加运行脚本：
```
  "scripts": {
    "start": "hexo clear & hexo g & hexo server",
    "deploy": "hexo clear & hexo g & node ./s3-deploy/index"
  },
```

### 使用Travis 自动部署
如果代码是托管到github上或者支持Travis的服务，可以是用下面的.travis.yml配置达到CI, CD，请在travis.org中配置好环境变量$AWS_ACCESS_ID， AWS_SECRET_KEY，AWS_REGION
```
language: node_js
node_js: stable

script: true

# S: Build Lifecycle
install:
  - npm install

before_install:
  - git submodule update --init --remote --recursive
  
#before_script:
 # - npm install -g gulp

script:
  - hexo g
# E: Build LifeCycle


before_deploy:
  # - zip -r latest *
  # - mkdir -p dpl_cd_upload
  # - mv latest.zip dpl_cd_upload/latest.zip
  - cp -a source/.well-known public/

deploy:
  - provider: s3
    access_key_id: ${AWS_ACCESS_ID}
    secret_access_key: ${AWS_SECRET_KEY}
    local_dir: public
    skip_cleanup: true
    on:
      repo: Troy-Yang/troy-yang.github.io
      branch: source
    bucket: troyyang.com
    region: ${AWS_REGION}
```

### https自定义证书
想要支持https，那么证书是必须的，可以直接开启cloudfront，默认就会添加cloufront生成证书，如
![image](https://images.troyyang.com/2018-2-18-distribution-overview.png)

如果想要自定义证书，则需要自己在ACM(AWS Certificate Manager)申请证书，并做txt域名验证，一切ok后则会得到：
![image](https://images.troyyang.com/2018-5-12-aws-myenglishtutur-acm.png)

申请步骤如下：
进入 https://console.aws.amazon.com/acm/home?region=us-east-1#/wizard/ 
填写域名:
![image](https://images.troyyang.com/2018-5-12-aws-acm-step1.png)
选择验证方式：（DNS验证方便，Email没试过，好像很麻烦）
![image](https://images.troyyang.com/2018-5-12-aws-acm-step2.png)
拷贝name和value值，保存并在DNS服务器中添加CNAME记录，如果DNS是使用AWS自家的Route53，则非常方便，只需要在相应的Domain下，添加 Record Set 记录, 类型选择CNAME。如果是在万网或者Cloudflare，也是非常方便的。
![image](https://images.troyyang.com/2018-5-12-aws-acm-step4.png)
记录添加好后，等待验证通过后（大概几至十几个小时后），状态从pending 变为 issued，就说明证书通过，该域名已合法。
![image](https://images.troyyang.com/2018-5-12-aws-acm-list.png)

#### Cloudfront 中使用自定义证书
证书有了之后，只需要将其添加到创建的Cloudfront中就可以了
![image](https://images.troyyang.com/2018-5-13-aws-acm-cloudfront.png)

请注意选择Custom SSL Certificate, 然后输入框中，AWS会自动列出可用的证书列表，如果没有，则点击Request or Import a certificate with ACM 选择上面新增的就好了
在浏览器访问这个cloudfront地址，就可以看到https的标志，查看这个https证书就可以得到自定义的这个域名，而不是cloudfront开头的，看起来是不是很高大上。

#### 绑定Cloudfront 到自定义DNS
上面的cloudfront地址如果用于提供API之类的接口地址倒是无所谓， 但是如果是别人访问的地址，那肯定不行的，还需要添加一条A记录，将自己的域名和上述地址进行绑定。同理，如果是在Route53，只需要添加一条A记录就好了，大致如图：
![image](https://images.troyyang.com/2018-5-13-aws-dns-cloudfront.png)

保存后，过几分钟就可以通过自己域名，访问到S3中的内容，并且证书显示的是自己域名。
![image](https://images.troyyang.com/2018-5-12-aws-myenglishtutur-acm.png)