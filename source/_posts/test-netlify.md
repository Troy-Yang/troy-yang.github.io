---
layout: post
title: 使用NetlifyCMS在线编辑Github上的博客
date: 2019-11-24T04:08:35.524Z
tags:
  - netlify
  - hexo
  - github
categories:
  - web
photos:
  - 'https://troyyang.com/images/uploads/2019-11-24-netlifycms.png'
comments: true
---
### Netlify CMS 介绍

使用Netlify CMS我感觉有以下优点：

* 无缝支持Hexo 等十几种主流静态网站生成器 的 **文章后台管理***   
* 可视化在线编辑、新增github 上的markdown
* 自带图片上传功能
* 自动部署

支持列表：
Jekyll, GitBook,Hugo, Gatsby, Nuxt, Next, Gridsome, Zola,Hexo, Middleman, Jigsaw,Spike ,Wyam,Pelican,VuePress,Elmstatic,11ty,preact-cli

### 为什么使用它

对于我的情况：使用Hexo 网站生成器，托管在github上 <https://github.com/Troy-Yang/troy-yang.github.io>，其中Source branch是存放markdown等生成前分支，Master branch存放的是生成后的静态文件分支。
对于以前，如果要写一篇文章，基本是在source 分支里，新增一个markdown文件（可github上在线添加或者本地新增然后push），然后自动触发github 上配置的travis 自动部署流程，整体感觉已经很不错了。现在配置上Netlify CMS后， 可视化的在线编辑以及图片管理更加方便，可以随时随地发文章。
可惜, Netlify有个致命缺点：**需要翻墙访问**

### HEXO  NetlifyCMS 配置

只需要在hexo 的source/ 目录下添加admin 目录，新增下面两个文件：

```
config.yml
index.html
```

config.yml需要根据自己情况进行配置：

```
backend:
  name: git-gateway
  branch: Source

# This line should *not* be indented
media_folder: "source/images/uploads" # Media files will be stored in the repo under images/uploads
public_folder: "/images/uploads" # The src attribute for uploaded media will begin with /images/uploads

collections:
  - name: "blog" # Used in routes, e.g., /admin/collections/blog
    label: "Post" # Used in the UI
    folder: "source/_posts" # The path to the folder where the documents are stored
    create: true # Allow users to create new documents in this collection
    slug: "{{slug}}" # Filename template, e.g., YYYY-MM-DD-title.md
    fields: # The fields for each document, usually in front matter
      - {label: "Layout", name: "layout", widget: "hidden", default: "post"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Categories", name: "categories", widget: "list", required: false}
      - {label: "Photos", name: "photos", widget: "list", required: false}
      - {label: "Excerpt", name: "excerpt", widget: "string", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
      - {label: "Permalink", name: "permalink", widget: "string", required: false}
      - {label: "Comments", name: "comments", widget: "boolean", default: true, required: false}
```

index.html

```
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
</head>
<body>
  <!-- Include the script that builds the page and powers Netlify CMS -->
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</body>
</html>
```

### Netlify 端配置

#### 创建 Netlify website

注意：和大部分人的做法不同的是，我Deploy到的地方并不是托管在Netlify自己的平台上，而是github上，所以这里我选择部署的是Source分支，而不是Master，因为我只是想要Netlify去修改我的Source分支，然后触发Travis自动发布到Master分支。

但是我依旧需要填写Netlify的部署，因为Netlify会自动帮我创建域名为troyyang.netlify.com的网站，任何我Source分支上的修改也会触发这个网站的自动部署



![](/images/uploads/2019-11-24-create-netlify-website.png)