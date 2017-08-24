# Nodejs+Express创建自签名的HTTPS服务器

# 实现https，需要有证书。在mac下，你可以进行如下操作。

首先，打开终端，创建一个文件夹

```
mkdir certificate
```

进入该文件夹

```
cd certificate
```

然后输入openssl  (mac下openssl是系统自带的，可以直接在终端使用。windows 电脑需要另行下载）

```
openssl
```

下面需要依次生成三个文件

- 首先是私钥

  ```
  genrsa -out private.pem 2048
  ```

- 生成证书签名

  ```
  req -new -key private.pem -out csr.pem
  ```

  生成证书签名需要填写一些信息，依次按照提示填写就行。以下是我随便填写的信息：

  ```
  Country Name (2 letter code) [AU]:CH
  State or Province Name (full name) [Some-State]:CH
  Locality Name (eg, city) []:CH
  Organization Name (eg, company) [Internet Widgits Pty         Ltd]:CH
  Organizational Unit Name (eg, section) []:CH
  Common Name (e.g. server FQDN or YOUR name) []:CH
  Email Address []:CH
  Please enter the following 'extra' attributes
  to be sent with your certificate request
  A challenge password []:123123123
  An optional company name []:CH
  ```

- 最后一步，生成证书文件

  ```
   x509 -req  -in csr.pem -signkey private.pem -out csr.crt
  ```

完成，此时certificate文件夹中就存在三个文件csr.crt,csr.pem,private.pem。将这三个文件，放入node项目的根目录。

# 现在要写node项目的启动js文件，index.js

```
let express = require('express');
let app = express();
let fs = require('fs');
let https = require('https');
let http = require('http');
let privateKey  = fs.readFileSync('private.pem', 'utf8');
let certificate = fs.readFileSync('csr.crt', 'utf8');
let cert = {key: privateKey, cert: certificate};
let httpServer = http.createServer(app);
let httpsServer = https.createServer(cert, app);
app.get('/', function(req, res) {
    if(req.protocol === 'https') {
    res.send('https require');
    } else {
    res.send('http require');
    }
});
httpServer.listen(3000, function() {
  console.log('HTTP Server is running');
});
httpsServer.listen(3001, function() {
console.log('HTTPS Server is running');
});
```

启动node 服务器

```
node index.js
```

此时控制台显示

```
HTTP Server is running
HTTPS Server is running
```

然后去浏览器输入 [https://localhost:3001/](https://localhost:3001/)
此时浏览器会拦截你访问，因为生成的证书是无效的。不过你可以按继续访问(safari浏览器）或者高级选项继续访问（chrome浏览器）。

WechatIMG1052.jpeg

如果你有自己的域名，你看去网上申请免费试用的证书。举个网站 [https://www.startssl.com](https://www.startssl.com)