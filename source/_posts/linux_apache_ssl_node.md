---
title: Linux下Apache反向代理搭建SSL + Node 服务配置
date: 2017-11-26 15:59:22
author: Troy
tags:
- https
- web
categories:
- 笔记
excerpt: Cloudflare生成证书key pair 的pem 格式文件，更名为.crt和.key。文件名和扩展名只是为了提供便利，对功能没有影响；你可以将证书命名为 cert.crt、cert.pem 或 任何其他文件名...
---
***

## SSL 配置
### 证书申请 
Cloudflare生成证书key pair 的pem 格式文件，更名为.crt和.key。文件名和扩展名只是为了提供便利，对功能没有影响；你可以将证书命名为 cert.crt、cert.pem 或 任何其他文件名。
### 拷贝证书
使用winSCP 拷贝文件至etc/pki/目录,其中.crt拷贝至etc/pki/tls/certs, .key拷贝至etc/pki/tls/private下。 （由于使用AWS的EC2服务器，拷贝时没有对pki的写权限，所以执行了下面语句将ownship权限赋予ec2-user）
```
sudo chown -R -v ec2-user /etc/pki/
```
### Linux Apache配置
安装Apache 模块 mod_ssl 来添加 SSL/TLS 支持
```
sudo yum install -y mod24_ssl
```
这个时候检查/etc/httpd/conf.d/ssl.conf，你会发现默认的localhost（self-signed）证书已经配置好了。
这里使用自己的证书，修改Apache配置文件 ssl.conf 中的 配置项
SSLCertificateFile /etc/pki/certs/test.cer
SSLCertificateKeyFile /etc/pki/private/test.key

上面的修改是全局的，会对所有站点起作用，如果只布置某个站点，则需要在制定站点的配置里添加下面的配置就好了。找到或创建自己的apache配置文件，可能是/etc/httpd/conf/httpd.conf 或者/etc/httpd/conf.d/ 下默认的xx.conf文件，这里我重新创建一个新的配置以作为我站点的配置文件：
```
NameVirtualHost *:443
<VirtualHost *:443>
DocumentRoot   /var/www/where
ServerName     where.troyyang.com
SSLEngine      on
SSLCertificateFile        /etc/pki/tls/certs/where.troyyang.com.crt
SSLCertificateKeyFile     /etc/pki/tls/private/where.troyyang.com.key
</VirtualHost>
```

### 测试

## 安装[nodejs](https://nodejs.org/en/download/package-manager/)
On RHEL, CentOS or Fedora, for Node.js v6 LTS:
```
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
sudo yum -y install nodejs
sudo yum install gcc-c++ make
```

### Node 测试
在/var/www/where目录下创建test.js文件
```
var http = require("http");
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(1337);
```

### Apache 反向代理配置
```
<VirtualHost *:443>
    ServerAdmin admin@site.com
    ServerName where.troyyang.com
    SSLEngine      on
    SSLCertificateFile        /etc/pki/tls/certs/where.troyyang.com.crt
    SSLCertificateKeyFile     /etc/pki/tls/private/where.troyyang.com.key
    ProxyRequests off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    <Location />
        ProxyPass http://localhost:8080/
        ProxyPassReverse http://localhost:8080/
    </Location>
</VirtualHost>
```
重启apache
```
sudo httpd -k restart
```
启动node
```
sudo su root 
cd /var/www/where/
node test.js
```
浏览器浏览https://where.troyyang.com，输出hello world! 但是一旦退出当前连接session比如putty，则服务停止，所以需要让node服务在后台运行，这里可以使用[forever](https://www.npmjs.com/package/forever)包
```
sudo npm install -g forever
cd /var/www/where/
forever start test.js
```

###　部署服务
- 拷贝源码

```
cd /var/www/where/
npm install
NODE_ENV=development node app/server.js
```
如果用forever
```
cd /var/www/where/
npm install
forever stopall
forever list
forever start app/server.js NODE_ENV=development
forever list
```

>一定要注意Node源码中require的包一定是大小写敏感的，因为Unix系统是文件名大小写敏感，这和Windows系统不一样。就在这里载了个坑，有段代码是require('Joi')，但是找不到joi这个module包，改为require('joi')就对了。

>如果第二次部署时（覆盖原来代码，运行node app/server.js），可能会遇到端口8080使用中，此时可以停用所有node监听端口，再运行
```
ps aux | grep node
killall node
```



