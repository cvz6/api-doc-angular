# apiDoc生成前端页面实现 （angular版）

# 简介

前后台分离时，api文档自动生成插件的前端页面，采用angular5.0实现。

## 开发环境
- nodejs 8.4.0
- npm 5.3.0
- angular/cli: 1.5
- TypeScript 2.4.2

# 快速启动

`angular-cli npm install -g @angular/cli@latest`

如果网络受限，请尝试淘宝的镜像 
`npm i -g cnpm --registry=https://registry.npm.taobao.org`

下载该项目然后`npm install`

`ng serve`后打开浏览器 localhost:4000即可

# 动态代理

文件 ： proxy.conf.json
```$xslt
{
  "/": {
    "target": "http://localhost:8088/",
    "secure": false
  }
}
```
