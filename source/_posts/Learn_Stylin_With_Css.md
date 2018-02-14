---
title: 《CSS设计指南》笔记
date: 2017-04-20 22:28:36
tags: 
- css
- web前端
categories:
- web前端
- 笔记
photos:
- https://images.troyyang.com/2017-04-20-StylinWithCss.PNG
---
## 选择器
- 子元素 > :  用于选择所有给定子元素，如 .food>li
- 后代元素： 用于选择所有子代和后代元素，如 .food li
- 子-星 > *：用于选择所有直接子元素，而不包括后代元素. 注意：在为子元素设定垂直外边距时，只能使用 margin-top 和 margin-bottom，不能使用简写的 margin，否则会抵消用“子-星选择符”应用给这些元素 的水平外边距，如果你想进一步缩进某个子元素的内容，就应该给该子元素应用内边距如让子元素与栏边界保持一定距离
```
article > * {margin:0 20px;}
```
- 非首位子元素 + : 这个选择符会选择除第一个之外的所有指定元 素，如
```
.list1 li + li {border-top:1px solid #f00;} 
```

## 盒子模型
- box-sizing:border-box 可用于避免改变内边距（边框）时导致整个盒子尺寸变化(width此时只是代表内容的宽度)，
- .Inner 另一种解决盒子尺寸变化的方式就是在其内部再包一层盒子

## 布局
- 使用table-cell 布局(css3)
```
nav {display:table-cell; width:150px; padding:10px;      background:#dcd9c0;} 
article {display:table-cell; padding:10px 20px;      background:#ffed53;} 
aside {display:table-cell; width:210px; padding:10px;      background:#3f7ccf;} 
```

## Display
- 将行内元素改为块级元素实现文本选择范围扩大
如，导航栏中文本
```
.list1 a {display:block; padding:3px 10px; textdecoration:           none; font:20px Exo, helvetica, arial, sansserif; 
```

## font
- 常用颜色
![image](https://images.troyyang.com/2017-6-1-regular-colors.PNG)

## background-clip
借助[background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip/)可以实现类似外边距分割效果，如
```
.multi-drop-menu ul {
    float: left;
}

.multi-drop-menu li {
    float: left;
    list-style-type: none;
}
.multi-drop-menu a {
    display: block;
    color: #555;
    background-color: #eee;
    padding: .2em 1em;
    border-width: 3px;
    border-color: transparent;
}
.multi-drop-menu li a {
    display: block;
    border-right-style: solid;
    background-clip: padding-box;
    text-decoration: none;
}

<nav class="multi-drop-menu vertical">
	<ul>
        <li><a href="#">Shirts</a></li>
        <li><a href="#">Pants</a></li>
        <li><a href="#">Dresses</a></li>
        <li><a href="#">Shoes</a></li>
    </ul>
</nav>
```
类似的用途如facebook的弹出框

![image](https://www.w3cplus.com/sites/default/files/facebook-effects.jpg)
> 使用background-clip把元素背景控制在padding或content区域内，这样一来，只需一个非常div，我们在这个div上加上透明边框，并配合background-clip把背景超过padding或content的边缘外的背景色直接裁剪掉著作权归作者所有。
商业转载请联系作者获得授权,非商业转载请注明出处。
原文: http://www.w3cplus.com/content/css3-background-clip © w3cplus.com
