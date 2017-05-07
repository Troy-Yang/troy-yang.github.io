---
title: 从wordpress主题中看CSS设计
date: 2017-03-11 12:20:22
author: Troy 
tags: 
- css
- web前端
categories:
- web前端
photos:
- https://twentyfifteendemo.files.wordpress.com/2014/10/fly1.jpg?w=825&h=510&crop=1
excerpt: 最近想做个个人博客，看上了wordpress的[twentyfifteen](https://wordpress.org/themes/twentyfifteen/)模板页(2015默认模板)，看上了就想拥有，而拥有是需要付出代价的...
---

***

### 写在开头
最近想做个个人博客，看上了wordpress的[twentyfifteen](https://wordpress.org/themes/twentyfifteen/)模板页(2015默认模板)，看上了就想拥有，而拥有是需要付出代价的，于是就掉入了源码坑里，爬了一周才算勉强爬出来，回过头来觉得这个坑里还是有很多有营养的东西，毕竟是大公司，所有标准都是最新的，所以想总结下学到的东西，方便以后使用(持续更新中)

***
##  Responsive page (干货都写在最前面)
在移动互联网时代，responsive的页面是必须的，我们知道css3里的media 可以帮我们实现不同设备尺寸的不同显示方式，所以设备尺寸的一个界定值就是我们的一个首要考虑问题，其他不多说，看看人家是如何定义的：

```
/**
 * 16.1 Mobile Large 620px
 */
 @media screen and (min-width: 38.75rem) {
}
/**
 * 16.2 Tablet Small 740px
 */

@media screen and (min-width: 46.25rem){
}

/**
 * 16.3 Tablet Large 880px
 */
 @media screen and (min-width: 55rem){}

/**
 * 16.4 Desktop Small 955px
 */
 
@media screen and (min-width: 59.6875rem){
}
/**
 * 16.5 Desktop Medium 1100px
 */
 
@media screen and (min-width: 68.75rem){
}
/**
 * 16.6 Desktop Large 1240px
 */
@media screen and (min-width: 77.5rem){
}
```
其中在mock的过程中发现几个tips
* 上面只有min-width，没有设置max-width，这是一个灵活的设计，没有max-width就说明他可以从最小满足条件的media开始，只要满足条件，都会被执行到，而我们需要做的就是把共有的部分写在最小尺寸里，或者放最外面，然后在需要更改的部分属性在在需要的尺寸中更改。简单举个栗子：
有个导航栏，需要在移动设备的时候隐藏，在桌面浏览器中显示所有，那我们可以这样:
![](http://ww1.sinaimg.cn/large/77a9e622gy1fdiu4ic4mqj20800j0t9e)

***

##  如何在css文件中使用fontawesome图标字体库
我们知道的是要在页面中使用fontawesome的图标很简单，只需要在html代码中加入如下代码
```
<i class="fa fa-address-book-o" aria-hidden="true"></i><a href="#">列表</a>
```
其中fa代表的是默认图标大小，如果想改变图标的大小，可以使用集成的fa-lg(放大33%),fa-2x, fa-3x, fa-4x, fa-5x。所以用起来很爽是吧。

从wordpress中(其实他没有用fontawesome图标库，而是他们自己的genericons库)，我看到了他是在css中定义这些图标的，试想一下，如果每次使用图标都需要新添加一个元素是不是很累赘，而且重复呢，这不符合程序设计的可复用原则啊！所以很自然的就想到使用class,这样就可以很轻松的在一些元素之前借助于伪类:before加上content神器自动加入，而我需要做的仅仅是在a标签加上一个class名称。

其中很重要的一步是引入这个新font-family FontAwesome。
实现如下：

```
[class*="font-asesome-icon"]:before {
  font-family: FontAwesome;
  font-weight: normal;
  font-style: normal;
  display: inline-block;
}

.secondary-toggle:before {
    color: #333;
	font-size: 2rem;
    content: "\f0c9";
    line-height: 40px;
    width: 40px;
}

<a class="font-asesome-icon secondary-toggle" href="#">列表</a>
```
其中content代表的是该图标的Unicode, 每个fontawesome图标库里都能查到其对应的unicode。
上面的是问题一，还有个问题是，我如何改变图标的大小呢？哈哈，我们回想一下这是什么库？对，字体库，所以，既然是字体，改变大小不就是font-size！我们上面是font-size:2rem，也就等于2*16px（rem是什么鬼一会再说），其实仔细查看fontawesome[官网](http://fontawesome.io/examples/)，然后任选一个图标，点击view css，我们会看到他的实现源码如下:

```
.@{fa-css-prefix}-lg {
  font-size: (4em / 3);
  line-height: (3em / 4);
  vertical-align: -15%;
}
.@{fa-css-prefix}-2x { font-size: 2em; }
.@{fa-css-prefix}-3x { font-size: 3em; }
.@{fa-css-prefix}-4x { font-size: 4em; }
.@{fa-css-prefix}-5x { font-size: 5em; }
```

## px, em, rem

### 基本概念
**px (pixel，像素)**：是一个虚拟长度单位，是计算机系统的数字化图像长度单位，如果px要换算成物理长度，需要指定精度DPI(Dots Per Inch，每英寸像素数)，在扫描打印时一般都有DPI可选。Windows系统默认是96dpi，Apple系统默认是72dpi

**em** (相对长度单位，相对于当前对象内文本的字体尺寸)：是一个相对长度单位，最初是指字母M的宽度，故名em。现指的是字符宽度的倍数，用法类似百分比，如：0.8em, 1.2em,2em等。通常1em=16px

**rem**（root em，根em）(相对长度单位，相对于根节点```html```的字体尺寸)


在wordpress博客中看到使用了```rem```，之前只知道```em```，查看了[相关资料](https://webdesign.tutsplus.com/tutorials/comprehensive-guide-when-to-use-em-vs-rem--cms-23984)后，学习到了:

- rem 和 em 都是根据你设计的fontsize值最终被浏览器解释成pixel的
- em 的值是根据当前他坐在的元素fontsize决定的
- rem的值是由html根节点的fontsize决定的
- em的值会被父元素的fontsize继承在计算(除非使用pixel显示的设置了当前元素的固定fontsize大小)
- rem的值会被在浏览器设置中设置的fontsize大小影响(除非在html根节点下使用了pixel去固定fontsize大小)
- 有时为了换算方便，经常为body设置fontsize 为65%

### 如何选择 
- 使用rem: 在文本大小值的设置上使用
- 使用rem或者px: 在media queies中使用
- 在和文本布局相关中，可使用em，比如某些文本的padding, margin 布局。防止因文本大小变化导致布局变得混乱
- 在多列布局中，不要使用em或者rem来作为宽度，而使用 ```%```代替

