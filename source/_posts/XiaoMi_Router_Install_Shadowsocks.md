---
title: 小米路由器 安装 Shadowsocks 客户端
date: 2017-04-16 11:10:00
author: Troy
tags: 
- Linux
categories:
- Linux
---

### 前因
当然是为了省去多个终端连接的烦恼，而我的直接原因确是为了Google神器Chromecast能正常使用（就单单是电视投射功能就足以让我心动）。大半年前在美国买了一个Chromecast，在美国的时候工作的好好的，回国后确怎么也投射不了，总是找不到设备，大概猜到是因为被墙的原因，可惜电脑挂起了VPN还是不行，后来才知道是电视也需要连接Google 服务！坑爹啊！然后就一直静静的放着放着直到这次买了个服务器(也是为了科学上网)后，想试试让路由器直接连Shadowsocks。
### 准备
- 一台运行着Shadowsocks，并且能访问外网的服务器
- 一台小米MINI路由器（其他的也行）
- 一台装载了linux远程连接客户端的电脑(XShell或者Putty)

### 第一步：开启路由器SSH
我的是小米MINI路由器，因为默认是稳定版而不是开发版，所以第一步就是升级（也可能是降级）到开发版去开启SSH，具体步骤在[这里](http://jingyan.baidu.com/article/624e7459ae65e834e8ba5afd.html)或者 [这里](http://bbs.xiaomi.cn/t-10044297)
> 升级前可以先备份路由信息

### 第二步：连接到路由器
升级完成后，使用在小米官网给出当前小米账号的root账号密码便可以登录路由器系统XIAO QIANG, 实质也是linux系统的一个distribution，查询后得知事实上生活中很多小的硬件设备都是搭载的linux系统，因为其开销实在太小啦
![image]https://images.troyyang.com/2017-04-15-LoginXiaoMiRouter.PNG)

查询当前路由器系统信息

```
uname -a
/// Linux XiaoQiang 2.6.36 #1 MiWiFi-R1CM-2.15.75 Thu Apr 13 17:10:07 CST 2017 mips GNU/Li
```

### 第三部：安装Shadowsocks
原本以为这个shadowsocks客户端其实就是github上的那个Linux Shadowsocks, 然后似乎并不是，只能猜测针对当前路由器又做过一次包装, 然后就发现了这么一个宝藏一键安装脚本：[http://d.ukoi.net/Miwifi/](http://d.ukoi.net/Miwifi/) 

也不知道作者是谁，只能猜测是对小米路由器系统很了解的人，所以根据这些安装脚本，我们就可以一步一步走向世界！之前试过很多小米论坛上的脚本，可惜基本都是不能下载的，所以很感激这位作者。

运行下面的脚本:
> 可以根据不同的小米路由器版本选择不同的脚本，更改相应的部分

```
// userdisk目录下的文件不会被系统reset
cd /userdisk
// 下载
wget http://d.ukoi.net/Miwifi/MINI/mini_install.sh
// 对文件赋权限
chmod +x mini_install.sh
// 安装
sh mini_install.sh
```

之后就是按照输入要求输入客户端连接的一些参数，完成后不出意外基本没问题啦，家里面所有wifi覆盖的地方都能愉快的科学上网，当然最重要的就是我的电视也能投射啦。。。。

还有一点就是这个脚本使用的是IP分流的，也就是说只有在GFW列表里的网站才会使用VPS，所以可以放心使用。

参考

http://www.miui.com/forum.php?mod=viewthread&tid=4133822&extra=




