# 优弛监控系统前端实现
本项目是优弛监控系统前端实现，使用pyff-vue实现

## 浏览器支持

Modern browsers and IE 10+。

[![testling badge](src/assets/ever.png)](https://ci.testling.com/substack/quote-stream)


<a name="项目的基础结构"></a>  

## 项目的基础结构

* build - webpack config files
* config - webpack config files
* dist - build
* document - 组件文档
* src -your app
    * api
    * assets
    * common
    * components - your vue components
    * mock
    * styles
    * views - your pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

<a name="项目的特色应用"></a> 


### 开始  

``` bash
# install dependencies
npm run init

# serve with hot reload at localhost:3000
npm run dev

# build for production with hot reload at localhost:8080
npm run start

# build for production with minification
npm run build

```

## 部署情况
- 线下环境
  * 研发本地环境
- 沙箱环境
  * 无
- 线上环境 
 * 机器节点 
   1. 192.168.153.15
   * 目录：/data/amp-console-vue/
   * 端口：3004
   * 访问地址：http://ampmonitor.ipinyou.com
   * 使用的监控接口：http://192.168.153.15:9601
   * 使用用的优弛接口:http://192.168.153.14:9751
 * 操作步骤
   1. 使用root权限
    ```bash
    $ netstat -lntup | grep 3004 | awk '{print $NF}' | awk -F'/' '{print $1}' | xargs kill
    ```
   2. 使用optimus用户权限
    ```bash
    $ cd /data/amp-console-vue/
    $ git pull
    ```
   3. 使用root权限
    ```bash
    $ cd /data/amp-console-vue/
    $ npm install  # 如有需要
    $ nohup npm run start &         # 访问 http://ampmonitor.ipinyou.com
          ``` 

## 相关文档链接

* [pyff-vue之vuex——pyff-vue开源项目使用技术详解（其一）](https://vuex.vuejs.org/zh-cn/)

* [pyff-vue之axios——pyff-vue开源项目使用技术详解（其二）](https://www.jianshu.com/p/df464b26ae58)

* [pyff-vue之vue-router——pyff-vue开源项目使用技术详解（其三）](https://router.vuejs.org/zh-cn/)

* [pyff-vue之echarts——pyff-vue开源项目使用技术详解（其四）](http://echarts.baidu.com/examples.html)

* [pyff-vue之font-awesome——pyff-vue开源项目使用技术详解（其五）](http://fontawesome.dashgame.com/)

* [pyff-vue之throttle-debounce——pyff-vue开源项目使用技术详解（其六）](https://www.jianshu.com/p/fb08b7ef31de)

* [pyff-vue之deepmerge——pyff-vue开源项目使用技术详解（其七）](http://npm.taobao.org/package/deepmerge)


