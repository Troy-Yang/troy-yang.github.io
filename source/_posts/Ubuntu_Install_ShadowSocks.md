---
title: Ubuntu 安装 Shadowsocks 实现科学上网
date: 2017-03-26 11:20:00
author: Troy
tags: 
- Linux
categories:
- Linux
---

***

### 开头
看了shadowsocks的各种安装部署教程，因为对于linux不熟，所以遇到很多坑，自己留个笔记在这里
### 更新
使用Ubuntu 14.04 版本已经不是必须的，当时主要是因为在最新版本Ubuntu内核没在锐速支持列表中，现在发现一种新的拥塞加速算法BBR（Google开发的），而且默认在最新的Ubuntu内核4.11已经集成进去，所以只需要开启即可，再也不用考虑已经不提供官方服务的锐速。完成安装ShadowSocks 后，参见秋水逸冰的《[一键安装最新内核并开启 BBR 脚本](https://teddysun.com/489.html)》。
### 环境准备
OS: 
- Ubuntu 14.04 X64 LTS
- Kernel Linux 3.13.0-112-generic

> 似乎 从16.04 开始以上已经全面使用[systemd](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)来启动管理守护进程，而不是像传统在init.d来启动。


VPS 平台: Vultr
远程控制客户端: XShell 或者 Putty

### 远程连接 ubuntu
略
### Shadowsocks 安装

安装pytyon 的pip管理程序，因为shadowsocks是由python写的
```
$ apt-get install python-pip
```

安装shadowsocks程序 (方式一)

```
$ sudo pip install shadowsocks
```
安装shadowsocks程序 (方式二), pip 上的不是最新版本)

```
# 安装yum
# 安装Python setuptools
$ sudo apt-get install python-setuptools
# 从github上安装shadowsocks
$ pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```


查看是否安装成功

```
$ ssserver
```

安装VIM
```
$ apt install vim
```

创建服务器配置文件(多端口)

```
$ vim  /etc/shadowsocks.json
```


vim 的命令: 按 "i" 进入编辑模式，编辑后按 "esc" 退出编辑模式， 输入 ":wq" 保存退出vi
```
{
    "server":"0.0.0.0",
    "local_address": "127.0.0.1",
    "local_port":1080,
    "port_password": {
         "443": "password1",
         "8888": "password2"
     },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

启动服务，后台运行

```
$ ssserver -c /etc/shadowsocks.json -d start
```
此时可配置好客户端shadowsocks检测是否可以访问

### 设置开机启动(针对16.10以下版本)

```
$ vim /etc/rc.local
```
在exit 0以前插入开机执行命令

```
$ ssserver -c /etc/shadowsocks.json -d start
```

### ShadowSocks 操作命令
查看日志

```
$ sudo less /var/log/shadowsocks.log
```

### [锐速加速](https://github.com/91yun/serverspeeder/)
一定要使用锐速加速，使用和不使用的差别是：没使用时查看youtube 720P 看不了，速度只有区区6、70KB的速度，使用后瞬间7、800甚至1m，发挥出了带宽的最大威力！
```
wget -N –no-check-certificate https://raw.githubusercontent.com/91yun/serverspeeder/master/serverspeeder-all.sh && bash serverspeeder-all.sh
```

### 各种坑---列表
- 使用Ubuntu 16.10 开机启动方式不同，网卡不同，锐速内核不支持
- 使用Ubuntu 16.4 锐速内核不支持
- 内核更换不成功！更换内核当然是为了使用锐速，试过了很多在锐速列表中支持的内核，可惜都提示类似错误 "Unable to locate package linux-image-extra-3.13.0-24-generic"
- 使用Ubuntu 14.4 rc.local 开机不执行












