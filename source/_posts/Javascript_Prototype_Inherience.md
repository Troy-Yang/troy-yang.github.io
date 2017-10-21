---
title: js 笔记之完美继承的演变
date: 2017-10-21 16:57:03
author: Troy
tags:
- javascript
- web前端
categories:
- 笔记
excerpt: 首先提个问题，都知道JS中的继承方式演变了很多种，你能完整的写出一种吗？用的最多的又是那种？如果你只能想到SubClass.prototype = new ParentClass()的同学就真该好好面壁了。
---
首先提个问题，都知道JS中的继承方式演变了很多种，你能完整的写出一种吗？用的最多的又是那种？如果你只能想到SubClass.prototype = new ParentClass()的同学就真该好好面壁了。

前段时间写了一篇[JS继承的简单理解](https://troyyang.com/2017/06/25/Javascript_Prototype_Inherience_Understanding/)，实在是太简单了，主要是为了梳理原型和构造器的关系。最近在对公司新同事的培训中涉及到JS核心部分，所以又仔细去研究了一下，整理出这篇笔记，如有错误，欢迎指出并拍砖。

## 什么是JS 中的继承？
创建的子类将继承超类的**所有属性和方法**，包括构造函数及方法的实现。记住，所有属性和方法都是公用的，因此子类可直接访问这些方法。子类还可添加超类中没有的新属性和方法，也可以覆盖超类的属性和方法。

## 完美继承
以前在开发中，使用继承用得最频繁的继承方式莫过于[MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Inheritance)上所推荐的，据说也是最完美的基础，也就是下面这种：
```
function Person(first, last, age, gender, interests) {
  this.name = {
    first,
    last
  };
  this.age = age;
  this.gender = gender;
  this.interests = interests;
};
Person.prototype.greeting = function() {
  alert('Hi! I\'m ' + this.name.first + '.');
};

function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests);

  this.subject = subject;
}
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;
```

毫无疑问，这种继承方式是基于原型链的，而并非其他复制方式的继承，而最新ES6中的class的extends也其实就是上面的一种语法糖，所以搞清楚其中的原理至关重要。上面涉及到的东西对于新手而言挺多了，关于this的部分我希望自己再在整理单独一篇文章，而且其实以前使用的时候并没有真正理解所有的地方。以上核心的地方有三个。
- Person.call 
- Teacher.prototype = Object.create(Person.prototype);
- Teacher.prototype.constructor = Teacher;


## 一步一步往上爬（继承的演变）
现在忘记上面的最终成品，我们可以一步一步如抽丝剥茧般的达到上述结果。

### 最简单的原型链继承
```
 function A(a){
    this.val = a;
    this.arr = [];
}
function B(){
}
B.prototype = new A();

var b1 = new B();
var b2 = new B();
b1.val = 1;
b1.arr.push(1);
console.log(b1.val) // 1
console.log(b1.arr); // 2
console.log(b2.val) // undefined
console.log(b2.arr); // 2
```
这可能是很多人的第一个继承版本，可惜因为两个问题根本没法用。
- 原型对象的引用属性是所有实例共享的 （b1对arr的改变影响到了b2的arr, val则没有影响，因为arr是引用类型）
- 没法使用父类的构造器参数

### 构造函数继承
为了解决上述问题，于是改进代码：
```
 function A(a){
    this.val = a;
    this.arr = [];
    this.func1 = function(){}
}
function B(param1){
    A.call(this, param1])
}
B.prototype = new A();

var b1 = new B(1);
var b2 = new B(2);
console.log(b1.val) // 1
console.log(b1.arr); // 1
console.log(b2.val) // 2
console.log(b2.arr); // 2
console.log(b1.fun1 === b2.fun1) // false
```
好，原型对象属性和构造器参数问题虽然解决了，但是原型的方法并没有实现共享，所以会造成极大的内存浪费，所以也是不可取的。

### 组合继承
```
function A(a){
    // 只在此处声明基本属性和引用属性
    this.val = a;
    this.arr = [];
}
//  在此处声明函数
A.prototype.func1 = function(){};

function B(param1){
    A.call(this, param1)
}
B.prototype = new A();
var b1 = new B(1);
var b2 = new B(2);
console.log(b1.fun1 === b2.fun1) // true
```
A.call(this);继承父类的基本属性和引用属性并保留能传参的优点；通过B.prototype = new A();继承父类函数，实现函数复用。

到了这里，似乎我们找到了最佳继承方式，可惜还是有一个小小的缺点：A构造器会被调用两次, 一次是new A的时候，还有一次是A.apply调用的时候。

### 完美继承
从组合继承我们可以看出，真正的问题在于new A()。我们在这一步的时候其实仅仅只是想要通用父类prototype中定义的方法（父类的属性我们已经通过apply的那一行调用到了），所以我们只需要改进这一步就好了。

也许你会想，那直接使用A的prototype不就完了
```
B.prototype = A.prototype;
```
肯定是不行的，因为任何B对原型的修改都讲影响到A的原型，比如我们给B的原型增加一个方法。此外，原型上的构造器也会是同一个B.prototype.constructor === A.prototype.constructor。

怎么办？一个聪明的方式是创建一个空对象然后把空对象的原型指向A的原型，因为这样的空对象是不占用任何内存的。
```
var temp = new Object();
temp.__proto__ = A.prototype;

B.prototype = temp;
```

而其实，上面的代码就是我从[Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)源码中拷贝过来的，所以我们可以改写为：
```
B.prototype = Object.create(A.prototype);
```

综上所述，我们的完美继承应该是这样的：
```
function A(a){
    // 只在此处声明基本属性和引用属性
    this.val = a;
    this.arr = [];
}
//  在此处声明函数
A.prototype.func1 = function(){};

function B(param1){
    A.call(this, param1)
}
B.prototype = Object.create(A.prototype);
```

然后，还是有个瑕疵（我保证是最后一个）：B.prototype.constructor === Object， 所以，我们这个时候需要重置B的原型构造器指向：
```
B.prototype.constructor = B;
```

好了，完美继承方式就是这样来的，我们在回过头去看看文章开头那段MDN给出的继承方式，是不是所有的都理解了：
- Person.call 
目的是调用父类构造函数或者仅仅理解为借用构造函数中的代码为自己赋属性值，所以属性都定义在父类构造器中
- Teacher.prototype = Object.create(Person.prototype);
目的是父类原型中的函数复用，所以共享方法都定义在父类原型中。
- Teacher.prototype.constructor = Teacher;
目的是重置子类原型构造器，具体原因可以参考[why-is-it-necessary-to-set-the-prototype-constructor](https://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor)


参考：

https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Inheritance
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
http://www.w3school.com.cn/js/pro_js_inheritance_implementing.asp
http://www.cnblogs.com/ayqy/p/4471638.html
