---
title: С��·���� ��װ Shadowsocks �ͻ���
date: 2017-04-16 11:10:00
author: Troy
tags: 
- Linux
categories:
- Linux
---

### ǰ��
��Ȼ��Ϊ��ʡȥ����ն����ӵķ��գ����ҵ�ֱ��ԭ��ȷ��Ϊ��Google����Chromecast������ʹ�ã��͵����ǵ���Ͷ�书�ܾ����������Ķ����������ǰ����������һ��Chromecast����������ʱ�����ĺúõģ��ع���ȷ��ôҲͶ�䲻�ˣ������Ҳ����豸����Ųµ�����Ϊ��ǽ��ԭ�򣬿�ϧ���Թ�����VPN���ǲ��У�������֪���ǵ���Ҳ��Ҫ����Google ���񣡿ӵ�����Ȼ���һֱ�����ķ��ŷ���ֱ��������˸�������(Ҳ��Ϊ�˿�ѧ����)����������·����ֱ����Shadowsocks��
### ׼��
- һ̨������Shadowsocks�������ܷ��������ķ�����
- һ̨С��MINI·������������Ҳ�У�
- һ̨װ����linuxԶ�����ӿͻ��˵ĵ���(XShell����Putty)

### ��һ��������·����SSH
�ҵ���С��MINI·��������ΪĬ�����ȶ�������ǿ����棬���Ե�һ������������Ҳ�����ǽ�������������ȥ����SSH�����岽����[����](http://jingyan.baidu.com/article/624e7459ae65e834e8ba5afd.html)���� [����](http://bbs.xiaomi.cn/t-10044297)
> ����ǰ�����ȱ���·����Ϣ

### �ڶ��������ӵ�·����
������ɺ�ʹ����С�׹���������ǰС���˺ŵ�root�˺��������Ե�¼·����ϵͳXIAO QIANG, ʵ��Ҳ��linuxϵͳ��һ��distribution����ѯ���֪��ʵ�������кܶ�С��Ӳ���豸���Ǵ��ص�linuxϵͳ����Ϊ�俪��ʵ��̫С��
![image]http://ommnrsgt0.bkt.clouddn.com/LoginXiaoMiRouter.PNG)

��ѯ��ǰ·����ϵͳ��Ϣ

```
uname -a
/// Linux XiaoQiang 2.6.36 #1 MiWiFi-R1CM-2.15.75 Thu Apr 13 17:10:07 CST 2017 mips GNU/Li
```

### ����������װShadowsocks
ԭ����Ϊ���shadowsocks�ͻ�����ʵ����github�ϵ��Ǹ�Linux Shadowsocks, Ȼ���ƺ������ǣ�ֻ�ܲ²���Ե�ǰ·����������һ�ΰ�װ, Ȼ��ͷ�������ôһ�����أ�[http://d.ukoi.net/Miwifi/](http://d.ukoi.net/Miwifi/) 

Ҳ��֪��������˭��ֻ�ܲ²��Ƕ�С��·����ϵͳ���˽���ˣ����Ը�����Щ��װ�ű������ǾͿ���һ��һ���������磡

��������Ľű�:
> ���Ը��ݲ�ͬ��С��·�����汾ѡ��ͬ�Ľű���������Ӧ�Ĳ���

```
// userdiskĿ¼�µ��ļ����ᱻϵͳreset
cd /userdisk
// ����data Ŀ¼
mkdir data
// ����
wget http://d.ukoi.net/Miwifi/MINI/mini_install.sh
// ���ļ���Ȩ��
chmod +x mini_install.sh
// ��װ
sh mini_install.sh
```

