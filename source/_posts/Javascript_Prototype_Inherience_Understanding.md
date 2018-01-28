---
title: Javascript中原型链继承的简单理解
date: 2017-6-25 10:27:03
author: Troy
tags:
- javascript
- web前端
categories:
- 笔记
---
以前对于Javascipt中的继承，大部分只是基于代码层面，理论理解虽然看了很多，总是当时理解了过几天确又忘了怎么的了。这两天又看了一遍《Javascrip面向对象编程指南》，其中在说到原型链的时候有一段话解释了很多以前自己容易混淆的地方：
> 首先我们知道每个对象都会有一个构造器，而原型本身也是一个对象，这意味着它必然也有一个构造器，而这个构造器又会有自己的原型，于是这种结构就会持续下去，形成一个原型链。

## 实践出真知
理解这段话并不难，可如果没有在实践中去理解，就会像以前一样，老是记不住。
### 实例对象的各种属性
先看看最简单的内置对象string类型的各种构造函数（构造器）和原型，a一定是实例化的对象，而不是构造函数(构造函数一般是大写)。

![image](http://ommnrsgt0.bkt.clouddn.com/2017-6-25-js-inherence.png)

从上面我们可以很直观的看到很多东西：
- a是由String构造函数(constructor)创建的。
- a的构造器函数(constructor)是有原型(prototype)的。
- a是没有原型属性(prototype)的。
- 神秘的__proto__直接是对a构造器的原型的引用。

所以如果a里有我们继承的原型属性值rating，我们平时就可以这样使用:
```
a.constructor === String
a.constructor.prototype.rating === a.rating
```

### 构造函数的原型

在JS中实现继承的方式有很多，而我最喜欢这种[Mozilla](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)推荐的:
```
function User(auth) {
    BaseManager.call(this, auth);
}
User.prototype = Object.create(BaseManager.prototype); // IE8 不支持Object.create
User.prototype.constructor = User;
```
代码其实不难，也容易理解，首先是构造函数内调用基类，然后是原型覆盖，最后是构造函数重新赋值。其中最最最应该理解的是User是个构造函数而不是实例化的对象，只有构造函数是有prototype属性的，这和上面的实例化对象a是不一样的。
