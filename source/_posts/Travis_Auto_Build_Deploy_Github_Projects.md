---
title: Travis-ci自动编译部署github上的项目
date: 2017-6-24 10:31:22
author: Troy
tags:
- travis-ci
- github
- hexo
categories:
- 笔记
photos:
- https://images.troyyang.com/2017-6-24-travis-ci-logo.png
excerpt: 在使用Hexo写完一篇博客后，都需要手动在本地编译，并生成静态文件，最后在上传至github服务器上才能发布，繁琐步骤姑且不说，万一哪天换了台电脑，没有Hexo环境的时候如何写博客呢？要是直接在github源码里写好文章后能自动编译发布就好了，好在github的好基友travis可以轻松帮我们同时实现这种CI,CD。
---
在使用Hexo写完一篇博客后，都需要手动在本地编译，并生成静态文件，最后在上传至github服务器上才能发布，繁琐步骤姑且不说，万一哪天换了台电脑，没有Hexo环境的时候如何写博客呢又或者修改博客Bug？要是直接在github源码里写好文章后能自动编译发布就好了，好在github的好基友travis可以轻松帮我们同时实现这种持续集成, 持续部署。
## 前因
我的博客是基于[Hexo](https://hexo.io/)写的，最终发布地址是托管到Troy-Yang/troy-yang.github.io下的，为了方便，我把源码放在他的一个source分支下，以前要写一篇博客的做法是：
1. 获取Source分支，使用markdown写好文章放在指定目录
2. 安装搭建hexo环境
3. 使用Node编译这个hexo项目
4. 使用Node发布编译后的结果到github上

缺点显而易见，我必须要搭建hexo的环境，并且还需要获取到source源码，而我只是想写一个markdown啊或者修改博客里某个css文件的bug，所以最理想的做法就是能自动检测到我的源码改动并自动编译部署，就和我们平时项目开发时的CI、CD一样。

## [Travis](https://travis-ci.org/)
不想介绍太多它，只想提一点的是它只针对开源项目免费，并且和github上的项目集成，所以所有github上的项目都可以使用它做CI、CD。
> 这也就是为什么我们看到很多github上的项目都有.travis.yml文件
和任何CI服务器一样，它的作用就在于可以捕捉任何代码提交并自动化的编译部署项目。

## 第一步，github上添加access token
登录github，进入到setting => develop setting => personal access tokens

在description里输入任意token 名字，比如Travis-CI，并勾选上下面所有复选框。这个时候会生成token，请务必记住，因为他只会出现一次，否则需要重新生成(这个就是)。

![image](https://images.troyyang.com/2017-6-24-github-create-token.png)


## 第二步，添加github上的项目至travis上
使用github账号登录[https://travis-ci.org/](https://travis-ci.org/)，这个时候你会看到自己所有github上的项目，选择需要做自动集成的项目troy-yang.github.io

![image](https://images.troyyang.com/2017-6-24-travis-ci-create.png)

## 第三步, 添加access token到travis上
第一步和第三步的目的是保护你的access token除了travis和你自己以外别人都看不到，你肯定不希望把access token放在.travis.yml文件里让大家都看到吧。

在travis上进入troy-yang.github.io 后，在右上角more options里找到setting，打开后，勾选 [Build only if .travis.yml is present] 并且 在Environment Variables中添加github上的access token。

![image](https://images.troyyang.com/2017-6-24-travis-ci-setting.png)

## 第四步,　添加编写.travis.yml
在项目源码根目录(我的是troy-yang.github.io source分支), 添加.travis.yml文件，内容如下:
```
language: node_js
node_js: stable

# S: Build Lifecycle
install:
  - npm install

before_install:
  - git submodule update --init --remote --recursive
  
#before_script:
 # - npm install -g gulp

script:
  - hexo g

after_script:
  - cd ./public
  - git init
  - git config user.name "troyyang"
  - git config user.email "yangzhouemail@163.com"
  - git add .
  - git commit -m "Update docs"
  - git push --force --quiet "https://${GitHub_TOKEN}@${GH_REF}" master:master
# E: Build LifeCycle

branches:
  only:
    - Source
env:
 global:
   - GH_REF: github.com/Troy-Yang/troy-yang.github.io.git
```

里面最重要的可能就是执行脚本和变量，脚本。 其中hexo g是编译hexo 项目命令，after_script是编译命令完成后将结果推送至github项目下。${GitHub_TOKEN} 和 ${GH_REF}是两个占位符，第一个就是我们在Travis项目下添加的Token，会在travis执行的时候自动替换，第二个就是下面env的一个变量，这里我们也可以不要这个变量直接放地址也可以。还有一点的是branch指定，我们这里只需要Source 分支。

根据不同项目，travis.yml文件内容各有不同, Travis上的一个官方demo文件[.travis.yml]( https://github.com/travis-ci/cat-party/blob/master/.travis.yml)

## 第五步，测试
让我们试试直接浏览器登录github，然后在troy-yang.github.io.git下的source分支下提交任何文件修改。在登录Travis，此时你可以看到一旦提交，Travis这边马上开始执行流程，看起来非常赏心悦目。

![image](https://images.troyyang.com/2017-6-24-travis-ci-build.png)

从此发布文件，修改博客bug是如此容易！博客如此，其他开源项目同样如此。
