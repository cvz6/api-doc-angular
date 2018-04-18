# apiDoc生成
前端页面实现 （angular版）
# 简介

前后台分离时，api文档自动生成插件的前端页面，采用angular实现。

## 开发环境
```
Angular CLI: 1.7.4
Node: 8.4.0
OS: win32 x64
Angular: 5.2.10
```


# 快速启动
下载该项目然后`npm install`

如果网络受限，请尝试淘宝的镜像 
`npm i -g cnpm --registry=https://registry.npm.taobao.org`

`ng serve`后打开浏览器`localhost:4200`访问即可

# 动态代理
启用该代理需要先运行后端程序，后端代码地址:https://github.com/liupeng328/api-doc

文件 ： proxy.conf.json
```$xslt
{
  "/": {
    "target": "http://localhost:8080/",
    "secure": false
  }
}
```
