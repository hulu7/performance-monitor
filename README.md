# Performance Monitoring 前端性能监控系统

&emsp;&emsp;前端性能监控系统（后文简称PM）是一个能监控多页应用、单页应用（Single Page Web Application，SPA）、微前端（Micro-Frontends）类型应用的页面性能的平台。支持常用的SPA框架：[Vuejs](https://github.com/vuejs/vue)、[Angularjs](https://github.com/angular/angular.js)、[Angular2+](https://github.com/angular/angular)、[Emberjs](https://github.com/emberjs/ember.js)、[React](https://github.com/facebook/react)、[Backbone](https://github.com/jashkenas/backbone)等。对于常用的微前端框架[single-spa](https://github.com/single-spa/single-spa)、[qiankun](https://github.com/umijs/qiankun)、[icestark](https://micro-frontends.ice.work/)完全支持。
&emsp;&emsp;PM主要由探针和控制台两部分组成：探针fork自[boomerang](https://github.com/akamai/boomerang)，并进行了功能增强；控制台(pconsole)采用koa2+gulp+mysql+elasticsearch搭建，gulp-nodemon刷新node服务。采集的数据包括性能数据、网络瀑布流数据、平台数据、浏览器信息，并且提供了非常高效的数据搜索功能。PM致力于为开发人员提供非常全面的性能信息，帮助找到性能瓶颈，提升前端性能。  

## 主要功能
>  * 实时统计访问页面真实性能分析
>  * 实时统计页面AJAX性能分析
>  * 实时统计页面所有资源加载性能分析 
>  * 实时统计慢加载资源追踪 
>  * 模拟单个http请求，并给出性能指标，可做接口测试
>  * 检查线上网页性能，给出详细性能指标
>  * 历史数据全文搜索

## 探针原理
&emsp;&emsp;因为浏览器没有提供专门针对SPA的性能API，所以探针在针对单页应用或者微前端应用时，采用如下方式监控SPA前端性能。首先，探针会监听路由变化，一旦路由变化则触发监控机制，同时将路由变化触发时间点作为开始时间。然后探针通过劫持window的API：XMLHttpRequest和fetch，实现对后续api和静态资源的网络请求监听。请求结束后，探针通过劫持window的MutationObserver监听兴趣节点（兴趣节点包括img、iframe、image、link（stylesheet）和其他包含src和href的节点）变化并设定一定的延时，在延时内如果没有没有兴趣节点变化则监控结束，并记录结束时间。如果由兴趣节点更新，则顺延一个更长的延时，继续监听，直到没有兴趣节点变化为止，主要原理图如下：
![](https://git.jd.com/JDCloud-FE/performance-monitor/raw/feat-probe/material/image/probe-workflow.png)

## 控制台架构
&emsp;&emsp;控制台的架构如下：
![](https://git.jd.com/JDCloud-FE/performance-monitor/raw/feat-probe/material/image/console.png)

## 安装说明
### 一、安装node环境
* node.js 12+
* 本项目需要node.js支持async await的语法因此node需要7.6版本以上。

### 二、安装jdk环境
* jdk8
* 本项目需要用到Elasticsearch，官方推荐安装JDK8版本。

### 三、安装go环境
* go 1.11.11
* 本项目需要用到一款go的同步工具，建议安装go 1.11.11版本。
* 官网下载地址：https://golang.org/dl/
* 官网安装教程：https://golang.org/doc/install#install/

### 四、项目数据库为mysql，你需要在本地安装mysql,版本需要v5.6以上
* 备注：安装mysql时会给你默认账户、密码，有提示，自己记录下后期项目配置需要
* 官网下载地址：https://www.mysql.com/downloads/

### 五、项目搜索引擎为elasticsearch，你需要在本地安装elasticsearch和kibana, 版本需要v7.13以上
* 备注：安装后会不能以root用户启动，最好新增用户elastic专门启动elasticsearch和kibana
* Elasticsearch官网下载地址：https://www.elastic.co/cn/downloads/elasticsearch/
* Kibana官网下载地址：https://www.elastic.co/download/kibana/

### 六、数据库同步为go-mysql-elasticsearch
* Github地址：https://github.com/go-mysql-org/go-mysql-elasticsearch/

### 七、安装完成后配置
* 探针埋点请查看boomerang的README文档
* 控制台前端调试方式请查看pconsole的README文档

## 项目结构

```html
performance-monitor
├── README.md
├── lerna.json
├── material
├── package.json
└── packages
    ├── boomerang
    └── pconsole 
```
