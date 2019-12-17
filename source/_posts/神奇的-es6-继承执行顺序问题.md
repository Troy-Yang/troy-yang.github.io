---
layout: post
title: 神奇的 ES6 继承执行顺序问题
date: 2019-12-17T14:03:17.710Z
tags:
  - js
categories:
  - web
excerpt: ''
comments: true
---
刷推的时候无意间发现一位google 工程师发的一个感叹，感叹发现的一个神奇的JS 6继承顺序问题。。。

![](/images/uploads/2019-12-17-js6-class-order-miracle-tweeter.jpeg)

![](/images/uploads/2019-12-17-js6-class-order-miracle.png)



仔细看了看，确实好神奇，于是好奇的看了看babel转换出的结果：

```
var SuperClass = function SuperClass() {
  _classCallCheck(this, SuperClass);

  _defineProperty(this, "foo", function () {
    return console.log('foo init in supper class');
  }());

  console.log('super construtor');
};

var WhatEver =
/*#__PURE__*/
function (_SuperClass) {
  _inherits(WhatEver, _SuperClass);

  function WhatEver() {
    var _this;

    _classCallCheck(this, WhatEver);

    console.log('before sub class constructor');
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WhatEver).call(this));

    _defineProperty(_assertThisInitialized(_this), "foo", function () {
      return console.log('foo init in sub class');
    }());

    console.log('after sub class constructor');
    return _this;
  }

  return WhatEver;
}(SuperClass);

new WhatEver();
```

就和他猜测的一样：没有supper的时候，字段的初始化是早于构造函数执行的，有supper的时候，字段初始化是在构造函数里的super后执行！

个人看法是故意放super之后是为了能在字段里访问到父类的字段？
