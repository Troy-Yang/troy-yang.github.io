---
title: 踩过的坑--CORS跨域请求中预检(preflight)
date: 2017-6-6 19:59:22
author: Troy
tags:
- http
- cors
- ajax
- express
- jwt
categories:
- Web前端
- NodeJs
- 笔记
photos:
- http://ommnrsgt0.bkt.clouddn.com/2017-06-05-unauthorized-access.jpg
---
***
### 开头
这两天在使用NodeJS Express搭建REST服务器时遇到一个很典型的AJAX跨域包含自定义请求头问题（用于身份验证），在花了大半天时间排查问题后发现自己对CORS真正的理解还很不够，尤其是pre-flight。

### 需求描述
服务端使用NodeJS Express搭建包含JWT身份验证的REST Full API， 客户端在获取到JWT信息之后的每次API请求头中都附带上JWT信息，完成身份验证后才能执行API操作，否则返回401错误。

#### 代码

服务器端(CORS核心部分):

```
------ App -----
...
// Enable CORS from client-side
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Routes configuration
apiRoutes(app);

app.listen(port);

------- User -----
//==========================
// User Routes
//==========================
apiRoutes.use('/user', passport.authenticate('jwt', {session: false }), userRoutes);
userRoutes.get('/', user.getUsers);
userRoutes.get('/:id', user.getUser);
userRoutes.post('/', user.postUser);
userRoutes.put('/:id', user.updateUser);
userRoutes.delete('/:id', user.deleteUser);
```

上面的代码看起来还是那么多清晰，在PostMan 测试中附带jwt也是没有任何的问题，成功返回。
![image](http://ommnrsgt0.bkt.clouddn.com/2017-06-05-CORS-Postman.PNG)

接下来是客户端(jquery ajax):

```
------- Core --------
function BaseManager(auth) {
    this.baseApiUrl = 'http://localhost:8080/api/';
    this.auth = auth;
}
BaseManager.prototype.get = function (url, successCallback, errorCallback) {
    this.ajax(url, {}, 'get', successCallback, errorCallback);
}
BaseManager.prototype.ajax = function (url, data, type, successCallback, errorCallback) {
    let that = this;
    $.ajax({
        url: url,
        method: type,
        data: data,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', that.auth.authorizationToken);
        }
    })
        .done(successCallback)
        .fail(errorCallback);
}
----------- User -------
User.prototype.getUserById = function (id, successCallback, errorCallback) {
    let url = this.baseApiUrl + '/user/' + id;
    this.get(url, successCallback, errorCallback);
}
```

### 永远的401
然后， 问题出现了，尽管参数是如何的对，Chrome console下总是返回让人咬牙切齿的大红色401，甚至断点都没有进入到passport的Jwt middleware下。
![image](http://ommnrsgt0.bkt.clouddn.com/2017-06-05-401-error.PNG)

无数次的尝试，先是怀疑客户端ajax调用没对，甚至搬用最原生的ajax方法， 也怀疑过是服务端Jwt passport没写对，最后比较http请求头的时候发现了一些问题。

使用Post man在node服务器端得到的request是这样的：

![image](http://ommnrsgt0.bkt.clouddn.com/2017-06-05-request-header-postman.PNG)

通过浏览器ajax请求是这样的：
![image](http://ommnrsgt0.bkt.clouddn.com/2017-06-05-request-header-browser.PNG)

有人给我把请求头信息更改了！Authorization不见了，甚至连req.method都变成了OPTIONS，而不是GET。

### 罪魁祸首---预检(Pre-flight)
百思不得其解，Google相关关键词后，pre-flight浮出水面，到了这步，突然想起阮一峰的《[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)》，当时只是略读，大概了解CORS中有两种请求：简单请求和非简单请求。于是又翻出来看了下，此时的情况正是属于非简单请求，会发送两次的请求，第一次就是preflight，用于请求验证, 第二次才是用户真正需要发送的请求。

对于Pre-flight权威的解读： [mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests )

回到代码中，不巧，每次服务端捕捉到的就是这个preflight请求，然后做next，其中就包括Jwt 中间件，而因为请求头中没有Authorization这个header，Jwt就返回了401，而这个过程是在passport的JWT中自动检测的，自己写的JWT验证部分甚至都没有执行到！

### 解决办法
看了[express cors](https://github.com/expressjs/cors/blob/master/lib/index.js)源码后，其实把请求类型OPTIONS做个简单的过滤就好啦！！！

```
// Enable CORS from client-side
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method == "OPTIONS") {
    res.send(200);
  }
  else {
    next();
  }
});
```

### 结语
又想了一下为什么之前的项目一直没有这个问题，其实是因为很多框架以及帮我们实现好了，比如说.NET中的WebAPI, 在做验证的时候我们都不用去考虑需要捕捉pre-flight请求，而在express中，甚至如果我当初直接使用三方库[express cors](https://github.com/expressjs/cors/blob/master/lib/index.js) 也可以避免，但是幸运的是，因为这种偶然，我们更有机会看得更清楚这些请求的后面到底是什么。

看似简单的问题，却包括了很多需要自己去了解的东西，尤其是http各种请求头的含义，比如Content-type, Accept, 以及对应ajax应该传递的参数，最后，当然还有 Pre-flight!
