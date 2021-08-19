/*
 Navicat Premium Data Transfer

 Source Server         : 测试数据库
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost
 Source Database       : web-performance

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : utf-8

 Date: 21/07/2021 17:19:58 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `web_pages`
-- ----------------------------
-- DROP TABLE IF EXISTS `web_pages`;
CREATE TABLE `web_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `systemId` int(11) NOT NULL COMMENT '所属系统id',
  `url` varchar(255) NOT NULL COMMENT 'url域名',
  `createTime` datetime NOT NULL COMMENT '访问页面时间',
  `markPage` varchar(64) DEFAULT NULL COMMENT '所有资源页面统一标识',
  `loadTime` int(11) NOT NULL DEFAULT '0' COMMENT '页面完全加载时间 单位：ms',
  `dnsTime` int(11) NOT NULL DEFAULT '0' COMMENT 'dns解析时间 单位：ms',
  `tcpTime` int(11) NOT NULL DEFAULT '0' COMMENT 'TCP连接时间',
  `domTime` int(11) NOT NULL DEFAULT '0' COMMENT 'DOM构建时间 单位：ms',
  `whiteTime` int(11) NOT NULL DEFAULT '0' COMMENT '白屏时间 单位：ms',
  `redirectTime` int(11) NOT NULL DEFAULT '0' COMMENT '页面重定向时间',
  `unloadTime` int(11) NOT NULL DEFAULT '0' COMMENT 'unload 时间',
  `requestTime` int(11) NOT NULL DEFAULT '0' COMMENT 'request请求耗时',
  `analysisDomTime` int(11) NOT NULL DEFAULT '0' COMMENT '解析dom耗时',
  `readyTime` int(11) NOT NULL DEFAULT '0' COMMENT '页面准备时间',
  `connectEnd` BigInt(50) NOT NULL DEFAULT '0' COMMENT '完成建立连接时的时间戳',
  `connectStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '开始建立连接时的时间戳',
  `bodySize` int(11) NOT NULL DEFAULT '0' COMMENT '解码后Body大小',
  `domainLookupEnd` BigInt(50) NOT NULL DEFAULT '0' COMMENT '域名查询结束的时间戳',
  `domainLookupStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '域名查询开始的时间戳',
  `domComplete` BigInt(50) NOT NULL DEFAULT '0' COMMENT '文档解析完成的时间戳',
  `domContentLoadedEventEnd` BigInt(50) NOT NULL DEFAULT '0'  COMMENT '所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳',
  `domContentLoadedEventStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '所有需要被执行的脚本已经被解析时的时间戳',
  `domInteractive` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'DOM结构结束解析、开始加载内嵌资源时的时间戳',
  `domLoading` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'DOM结构开始解析时的时间戳',
  `encodedBodySize` int(11) NOT NULL DEFAULT '0' COMMENT '编码后的body大小',
  `fetchStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳',
  `loadEventEnd` BigInt(50) NOT NULL DEFAULT '0' COMMENT '加载事件完成时的时间戳',
  `loadEventStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'load事件被发送时的时间戳',
  `navigationStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '上一个文档卸载(unload)结束时的时间戳',
  `navigationType` tinyint(3) NOT NULL DEFAULT '0' COMMENT '导航方式：0 链接；1 重新加载； 2 前进、后退； 255 其他',
  `nextHopProtocol` varchar(64) DEFAULT NULL COMMENT '网络协议 ',
  `redirectCount` int(11) NOT NULL DEFAULT '0' COMMENT '重定向数量',
  `requestStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '发出HTTP请求时（或开始读取本地缓存时）的时间戳',
  `responseEnd` BigInt(50) NOT NULL DEFAULT '0' COMMENT '从服务器收到最后一个字节时的时间戳',
  `responseStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '从服务器收到第一个字节时的时间戳',
  `transferSize` int(11) NOT NULL DEFAULT '0' COMMENT '数据包大小',
  `unloadEventEnd` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'unload事件处理完成时的时间戳',
  `unloadEventStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'unload事件抛出时的时间戳',
  `boomerTime` varchar(30) DEFAULT NULL COMMENT 'Boomerang自身加载时间参数',
  `continuityEpoch` varchar(20) DEFAULT NULL COMMENT '可监测总时间',
  `continuityLastBeacon` varchar(20) DEFAULT NULL COMMENT '最后一个信标的监测时间',
  `timeToInteractiveMethod` varchar(10) DEFAULT NULL COMMENT '可交互性的判定方法',
  `cpuConcurrency` int(11) NOT NULL DEFAULT '0' COMMENT 'CPU并发量',
  `visuallyReadyTime` int(11) NOT NULL DEFAULT '0' COMMENT '视觉就绪时间 ms',
  `cookiesSize` int(11) NOT NULL DEFAULT '0' COMMENT 'cookie的字节数',
  `uniqueDomainsNumber` int(11) NOT NULL DEFAULT '0' COMMENT '主页中唯一域的数量',
  `iframeNumber` int(11) NOT NULL DEFAULT '0' COMMENT 'iframe个数',
  `imgNumber` int(11) NOT NULL DEFAULT '0' COMMENT 'IMG节点个数',
  `linkNumber` int(11) NOT NULL DEFAULT '0' COMMENT 'LINK节点个数',
  `cssNumber` int(11) NOT NULL DEFAULT '0' COMMENT 'stylesheet和link个数',
  `domsNumber` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的DOM节点数',
  `resourcesFetchNumber` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的资源请求数',
  `scriptNumber` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的script节点数',
  `externalScriptNumber` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的外部script节点数',
  `htmlSize` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的HTML字节数',
  `httpInitiator` varchar(20) DEFAULT NULL COMMENT '页面切换类型',
  `downlink` varchar(20) DEFAULT NULL COMMENT '有效带宽',
  `effectiveType` varchar(20) DEFAULT NULL COMMENT '带宽类型',
  `roundTripTime` varchar(20) DEFAULT NULL COMMENT '网络延迟',
  `totalJSHeapSize` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS堆栈总大小',
  `jsHeapSizeLimit` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS的堆栈限制',
  `usedJSHeapSize` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS堆栈使用大小',
  `usedLocalStorageSize` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'Localstorage使用大小',
  `usedLocalStorageKeys` int(11) NOT NULL DEFAULT '0' COMMENT 'Localstorage的key数量',
  `usedSessionStorageSize` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'SessionStorage使用大小',
  `usedSessionStorageKeys` int(11) NOT NULL DEFAULT '0' COMMENT 'SessionStorage的key数量',
  `beaconNumber` int(11) NOT NULL DEFAULT '0' COMMENT '信标的数量',
  `nocookie` tinyint(1) DEFAULT NULL COMMENT 'cookie的使用情况1未使用',
  `pageId` varchar(20) DEFAULT NULL COMMENT '页面ID',
  `firstContentfulPaint` int(11) NOT NULL DEFAULT '0' COMMENT '首次内容绘制时间 (ms)',
  `firstPaint` int(11) NOT NULL DEFAULT '0' COMMENT '首像素时间 (ms)',
  `restiming` LongText DEFAULT NULL COMMENT '瀑布流数据',
  `appin` varchar(10) DEFAULT NULL COMMENT 'App进入点',
  `mainRestiming` LongText DEFAULT NULL COMMENT '主应用瀑布流数据',
  `app` varchar(255) DEFAULT NULL COMMENT '子应用的名称或者标识符',
  `boomerangStartTime` varchar(20) DEFAULT NULL COMMENT 'boomerang插件开始执行时间',
  `boomerangEndTime` varchar(20) DEFAULT NULL COMMENT 'boomerang插件停止监控时间',
  `noLoadPagesNumber` int(11) NOT NULL DEFAULT '0' COMMENT '一个session下没有加载时间的页面',
  `sessionId` varchar(50) DEFAULT NULL COMMENT 'session id',
  `sessionLength` int(11) NOT NULL DEFAULT '0' COMMENT 'Session的个数',
  `sessionStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'Session开始时间戳',
  `triggerMethod` varchar(20) DEFAULT NULL COMMENT '触发方式',
  `triggerStart` BigInt(50) NOT NULL DEFAULT '0' COMMENT '触发时间戳',
  `sumLoadTimes` int(11) NOT NULL DEFAULT '0' COMMENT '一个session下的总加载时间',
  `screenColorDepth` varchar(20) DEFAULT NULL COMMENT '屏幕色深',
  `screenOrientation` varchar(20) DEFAULT NULL COMMENT '屏幕方向',
  `screenSize` varchar(20) DEFAULT NULL COMMENT '屏幕尺寸',
  `boomerangSnippetMethod` varchar(10) DEFAULT NULL COMMENT '探针代码嵌入方式 iframe、src、preload',
  `perceivedLoadTime` int(11) NOT NULL DEFAULT '0' COMMENT '可感知加载时间',
  `additionalTimers` tinytext DEFAULT NULL COMMENT '附加计时器，记录其他页面、脚本的执行时间',
  `frontTime` int(11) NOT NULL DEFAULT '0' COMMENT '前端时间',
  `backTime` int(11) NOT NULL DEFAULT '0' COMMENT '后端时间',
  `system` varchar(20) DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(20) DEFAULT NULL COMMENT '浏览器',
  `boomerangVersion` varchar(10) DEFAULT NULL COMMENT 'Boomerang版本',
  `pageVisibility` varchar(20) DEFAULT NULL COMMENT '返回数据时页面的可见性',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `web_system`
-- ----------------------------
-- DROP TABLE IF EXISTS `web_system`;
CREATE TABLE `web_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `systemDomain` varchar(50) NOT NULL COMMENT '系统域名',
  `systemName` varchar(20) NOT NULL COMMENT '系统名称',
  `subSystems` LongText DEFAULT NULL COMMENT '子系统',
  `script` LongText DEFAULT NULL COMMENT '获取页面统计脚本',
  `isUse` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要统计  0：是  1：否',
  `createTime` datetime DEFAULT NULL COMMENT '系统新增时间',
  `slowPageTime` tinyint(2) NOT NULL DEFAULT '8' COMMENT '页面加载页面阀值  单位：s',
  `slowJsTime` tinyint(2) NOT NULL DEFAULT '2' COMMENT 'js慢资源阀值 单位：s',
  `slowCssTime` tinyint(2) NOT NULL DEFAULT '1' COMMENT '慢加载css资源阀值  单位：s',
  `slowImgTime` tinyint(2) NOT NULL DEFAULT '2' COMMENT '慢图片加载资源阀值  单位：s',
  `slowAjaxTime` tinyint(2) NOT NULL DEFAULT '2' COMMENT 'AJAX加载阀值',
  `appId` varchar(64) NOT NULL COMMENT '系统appId标识',
  `isMonitorPages` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面性能信息  0：是   1：否',
  `isMonitorAjax` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面Ajax性能资源 0：是  1：否',
  `isMonitorResource` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面加载资源性能信息 0：是    1：否',
  `isMonitorSystem` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否存储用户系统信息资源信息',
  PRIMARY KEY (`id`,`appId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
