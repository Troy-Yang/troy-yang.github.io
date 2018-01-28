---
title: Hexo-lazyload-image图片懒加载
date: 2017-08-06 18:20:22
author: Troy 
tags: 
- web前端
categories:
- web前端
photos:
- http://ommnrsgt0.bkt.clouddn.com/2017-08-06-hexo.png
excerpt: 最近在看Google Chrome新出的一个API是无意间想到了对图片的懒加载，后来想想自己的网站还不支持呢，索性花了些时间让网站给支持上了，并发现Hexo上还没有一个懒加载的插件，又倒腾着写了个hexo的插件hexo-lazyload-image，并发布到NPM上供大家使用，从这几天下载数来看看来大家还是很有这个需求 :)
---

### 动机
最近在看Google Chrome新出的一个API是无意间想到了对图片的懒加载，后来想想自己的网站还不支持呢，索性花了些时间让网站给支持上了，并发现Hexo上还没有一个懒加载的插件，又倒腾着写了个hexo的插件[hexo-lazyload-image](https://www.npmjs.com/package/hexo-lazyload-image)，并发布到NPM上供大家使用，从这几天下载数来看看来大家还是很有这个需求 :)。
### 图片懒加载
图片懒加载是提升网站性能和用户体验的一个非常很好方式，并且几乎所有的大型网站都使用到了，比如微博，仅把用户可见的部分显示图片，其余的都暂时不加载，做法就是：让所有图片元素src指向一个小的站位图片比如loading，并新增一个属性(如data-original)存放真实图片地址。每当页面加载（或者滚动条滚动），使用JS脚本将可视区域内的图片src替换回真实地址，并做请求重新加载。 
### Hexo-lazy-image 实现原理
因为文章都是使用markdown来编写的，所以不可能要求我们在markdown里将所有图片路径都指向站位图片，并附加另一个属性，所以，这个工作必须留给hexo的generate部分来做。

最终可分为两步： 
1. 在hexo *after_post_render*事件或者*after_render:html*事件里将生产出来的文章html代码中所有img元素都加上 data-original 属性，并把src值付给他， 然后在将src值致为loading图片
2. 注入simple-lazyload脚本在每个页面最后面，当页面加载过后负责判定当前需要重新加载的图片。

这里重点提提正则表达式，在对第一步替换的时候，只是使用了简单的正则表达式去匹配查找所有的img节点，后来发现不仅如此，正则表达式结合string.replace更是如此强大，直接将我原来30行的代码减为3行，从此热爱上了正则表达式。
```
return htmlContent.replace(/<img(\s*?)src="(.*?)"(.*?)>/gi, function (str, p1, p2) {
        return str.replace(p2, loadingImage + '" data-original="' + p2);
    });
```

关于simple-lazyload，这个是懒加载替换脚本的核心，原来使用jquery-lazyload插件，后来觉得没必要，最终还是自己写了个简单版。


### Hexo-lazy-image 使用
安装步骤：
```
npm install hexo-lazyload-image --save
```

然后修改 _config.yml 文件
```
lazyload:
  enable: true 
  onlypost: false
  loadingImg: # eg. ./images/loading.png 
```

既然要分享出来，那就得提供更多灵活的API来满足不同的需求，所以又加上了以下功能:

1. 自定义占位图片。（不指定使用默认值）
2. 只针对文章内容或者全网站图片使用图片懒加载


### 关于npm 发布包那点事
发布NPM包的时候有几个注意事项，这里列一下
* 每次publish必须在readme中更新版本号(npm patch会自动为你生成最新版本号方便你使用)
* 要更新npm中的readme页面，需要再次调用npm patch命令，不然尽管你已经更新了readme文件，npm包页面还是保持原来的页面
* 在packages.json中最好把git地址加上，因为npm会自动解析packages.json文件，会映射到包页面相应的位置
