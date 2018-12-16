---
title: AWS系列之使用无服务器架构你的网站
date: 2018-12-16 09:37:22
author: Troy
tags:
- aws
- serverless
categories:
- aws
photos: 
- https://images.troyyang.com/2018-12-16-aws-serverless.jpg
---
***
### Serverless 有什么用啊？
Jason最近又出新想法了，想要做一个简单的用户管理系统，好的，没问题，不就是在服务器上安装数据库，部署好网站吗？可答案是no，他不是专业人员，我也不可能永远维护这个服务器，更重要的是服务器开着就要美刀啊，还不能停，怎么办？有没有可以不用服务器的网站，有啊，你自己的静态博客不就是只用到了s3或者github的静态页面托管吗？可是数据库呢，后台api呢？额，这个嘛。。。   

好了，成功引出话题，要知道这是21世纪的云时代，只有你想不到，没有做不到的，这不，AWS早就提出了[Serverless](https://aws.amazon.com/cn/serverless/?nc1=h_ls)解决方案：S3 + GateWay API + Lambda + DynamDB，其中举例的一个天气的app架构：

![image](https://images.troyyang.com/2018-12-16-Lambda-WebApplications.png)

其中s3做静态页面托管，用户触发点击事件，调用Gateway API提供到接口，接口映射到Lambda服务端接口，Lambda再负责去处理和数据库相关到操作。整个过程不需要服务器，而且费用是极低的，按量付费，可扩展性也很强，基本做到可配置化。说了这么多，还是得用过才知道好不好。

### 实现思路
1. 服务端RestFull： Node express 实现RestFull API
2. 创建lambda并上传服务端代码
3. 配置API Gateway映射到lambda函数
4. 客户端实现： Bootstrap 实现登录 和 管理页面
5. 修改客户端api接口地址并上传至S3

其中，到第三步的时候我们就已经创建好了一个完整的无服务器的 Restfull API，剩下的就是客户端调用了，客户端调用这个就可以是五花八门的了，这也不是本篇文章的重点。

### 简单 RestFull 服务端实现
服务端的实现和平时实现一个Node RestFull api的完全没有任何区别, 部分代码如下:
app.js
```
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let contacts = require('./data');

app.get('/api/contacts', (request, response) => {
  if (!contacts) {
    response.status(404).json({ message: 'No contacts found.' });
  }
  response.json(contacts);
});

const hostname = 'localhost';
const port = 3001;
const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app

```

这一步做完，确保所有接口都能通过访问 localhost:3001/api/contacts

![image](https://images.troyyang.com/2018-12-16-restful-success.png)

### aws-serverless-express
要使得上面的服务端代码能在lambda中允许，只需借助 npm 包[aws-serverless-express](https://github.com/awslabs/aws-serverless-express)

在目录下新增 lambda.js文件
```
// lambda.js
'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
```
这也是为什么我们要在 app.js最后一行exports的原因
```
module.exports = app
```
此时，将所有文件包括node_module目录全部打包为.zip 文件为后面使用。
### 创建 lambda
#### 创建 IAM role
创建 Lambda的IAM Role是必须的，他指定了当前lamda能访问到的资源有那些，从我们的列子中，我们需要用到DynamoDB, 同时为了方便debug，我们还需要用到cloudwatch服务 （这个对于查找问题非常有用）。

登录aws console，打开 Service 找到 IAM ，再选择Roles，点击 create role 按钮 后如图，(第三步可选)：   
![image](https://images.troyyang.com/2018-12-16-lambda-create-role-step1.png)   
![image](https://images.troyyang.com/2018-12-16-lambda-create-role-step2.png)   
![image](https://images.troyyang.com/2018-12-16-lambda-create-role-step4.png)   

#### 创建 lambda 函数
打开Service 找到lambda, 选择 create function：   
![image](https://images.troyyang.com/2018-12-16-create-lambda.png)

创建后，在代码输入种类中选择上传 .zip 文件：   
![image](https://images.troyyang.com/2018-12-16-lambda-manage.png)

将服务端代码整个打包 （注意一定要包括packages目录下的所有文件）然后上传，大小不能超过10m，如果超过了，可以在代码输入种类选择s3上传。上传完成后，指定入口文件（即在处理程序）为 lambda.handler， 此文件将会映射到 lambda.js文件，一般情况，如果上传的zip包不是很大，aws会自动列出zip项目目录可供在线编辑，但如果大了的化，比如好几兆，则有可能不会列出项目目录，每次修改又只能重新上传。

![image](https://images.troyyang.com/2018-12-16-lambda-list-file.png)

当然，如果node 代码里包括了一些环境变量，你也可以为 lambda 做一些环境变量的设置：

![image](https://images.troyyang.com/2018-12-16-lambda-env.png)

一切ok后，就可以测试了，关于lambda的测试，则相对还比较麻烦，我也是最近才稍微懂那么一点。
#### 测试 lambda 函数

在创建好的lambda 函数旁，点击配置测试事件按钮，在弹出对话框创建测试事件中选择创建新测试事件，在事件模板中选择 Amazon API Gateway AWS Proxy, 并给个测试名称，如图：
![image](https://images.troyyang.com/2018-12-16-lambda-create-test.png)

选择Amazon API Gateway AWS Proxy是因为我们的这个lambda函数最终会被API Gateway 触发调用，同时由于默认的事件模板是 post 的请求方式，而我们的这个服务端只有一个api/contacts的get方法，所以我们需要更改事件内容为：
```
{
  "resource": "/{proxy+}",
  "path": "/api/contacts",
  "httpMethod": "get",
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Cache-Control": "max-age=0",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "US",
    "Host": "1234567890.execute-api.ap-northeast-1.amazonaws.com",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Custom User Agent String",
    "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
    "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  }
}
```
保存测试事件，并点击执行，如果一切正常，会得到如下:
![image](https://images.troyyang.com/2018-12-12-lambda-test-success.png)

### 创建 API Gateway
找到Service下到API Gateway，并点击新建 api,   

![image](https://images.troyyang.com/2018-12-16-create-api-gateway.png)   
新增 api 资源（路径）   
![image](https://images.troyyang.com/2018-12-16-api-gateway-create-api-source.png)   
选择 api 资源，再新增子资源，并选为proxy   
![image](https://images.troyyang.com/2018-12-16-api-gateway-create-source.png)   
选择 proxy 资源，创建 集成环境为我们创建好的lambda 函数   
![image](https://images.troyyang.com/2018-12-16-api-gateway-create-method.png)   

创建完成之后，在操作选项中，选择部署，弹出对话框并命名为dev阶段：   
![image](https://images.troyyang.com/2018-12-16-api-gateway-deploy.png)   

部署完成后，得到如下结果：   
![image](https://images.troyyang.com/2018-12-16-api-gateway-deploy-success.png)

### API Gateway 测试
在部署完成后，我们会在上述结果中得到发布出来的api 地址为  
>https://ijihnuupmh.execute-api.ap-northeast-1.amazonaws.com/dev

此时如果直接访问，会得到Missing Authentication Token的错误，原因是我们地址不对
```
{"message":"Missing Authentication Token"}
```
正确地址应该为:
>https://ijihnuupmh.execute-api.ap-northeast-1.amazonaws.com/dev/api/contacts

![image](https://images.troyyang.com/2018-12-16-api-gateway-deploy-url-success.png)   

由于上述地址是永久的，除非你重新部署，所以我们可以放心的使用用来作为api地址。还有一个就是API Gateway似乎是不收取费用的，只会按照lambda函数的调用次数来收取费用，好像每月前100万次请求是免费的。所以还是相当划算。

OK! 一个无服务器的后端 api 就这样搭建好了，剩下的就是前端静态资源的托管了

### 前端静态资源
直接上传html,js,css 等静态资源到S3就好了，具体可以参见另一篇博客 [AWS系列之S3 + Cloudfront搭建https静态网站](https://troyyang.com/2018/05/12/aws_s3_https_static_website/)

