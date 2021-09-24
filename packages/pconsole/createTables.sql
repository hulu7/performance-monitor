/*
 Navicat Premium Data Transfer

 Source Server         : 前端性能监控系统数据库
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost
 Source Database       : web_performance

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : utf-8

 Date: 21/07/2021 17:19:58 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;
-- --------------------------------------------------------------
--  Table `web_pages_basic`: 单次采集数据页面基本信息
-- --------------------------------------------------------------
CREATE TABLE `web_pages_basic` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `page_id` char(80) NOT NULL DEFAULT '' COMMENT '页面全局id',
  `system_id` int(11) NOT NULL DEFAULT '0' COMMENT '所属系统标识符，对应web_system的id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT 'url地址',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问页面时间',
  `mark_page` char(80) NOT NULL DEFAULT '' COMMENT '所有资源页面统一标识',
  `app` varchar(255) NOT NULL DEFAULT '' COMMENT '子应用的名称或者标识符',
  `user_id` varchar(255) NOT NULL DEFAULT '' COMMENT '用户标识符',
  `additional_info` varchar(255) NOT NULL DEFAULT '' COMMENT '附加信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_timing`: 单次采集的时间相关性能数据
-- --------------------------------------------------------------
CREATE TABLE `web_pages_timing` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `page_id` char(80) NOT NULL DEFAULT '' COMMENT '页面全局id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT 'url地址',
  `load_time` int(11) NOT NULL DEFAULT '0' COMMENT '页面完全加载时间 单位：ms',
  `white_time` int(11) NOT NULL DEFAULT '0' COMMENT '白屏时间 单位：ms',
  `first_paint` int(11) NOT NULL DEFAULT '0' COMMENT '首像素时间 (ms)',
  `first_contentful_paint` int(11) NOT NULL DEFAULT '0' COMMENT '首次内容绘制时间 (ms)',
  `visually_ready_time` int(11) NOT NULL DEFAULT '0' COMMENT '视觉就绪时间 ms',
  `perceived_load_time` int(11) NOT NULL DEFAULT '0' COMMENT '可感知加载时间',
  `dom_time` int(11) NOT NULL DEFAULT '0' COMMENT 'DOM构建时间 单位：ms',
  `analysis_dom_time` int(11) NOT NULL DEFAULT '0' COMMENT '解析dom耗时',
  `dns_time` int(11) NOT NULL DEFAULT '0' COMMENT 'dns解析时间 单位：ms',
  `tcp_time` int(11) NOT NULL DEFAULT '0' COMMENT 'TCP连接时间',
  `redirect_time` int(11) NOT NULL DEFAULT '0' COMMENT '页面重定向时间',
  `unload_time` int(11) NOT NULL DEFAULT '0' COMMENT 'unload 时间',
  `request_time` int(11) NOT NULL DEFAULT '0' COMMENT 'request请求耗时',
  `ready_time` int(11) NOT NULL DEFAULT '0' COMMENT '页面准备时间',
  `boomerang_start_time` char(20) NOT NULL DEFAULT '' COMMENT 'boomerang插件开始执行时间',
  `boomerang_end_time` char(20) NOT NULL DEFAULT '' COMMENT 'boomerang插件停止监控时间',
  `no_load_pages_number` int(11) NOT NULL DEFAULT '0' COMMENT '一个session下没有加载时间的页面',
  `session_id` char(50) NOT NULL DEFAULT '' COMMENT 'session id',
  `session_length` int(11) NOT NULL DEFAULT '0' COMMENT 'Session的个数',
  `session_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'Session开始时间戳',
  `sum_load_times` int(11) NOT NULL DEFAULT '0' COMMENT '一个session下的总加载时间',
  `additional_timers` varchar(255) NOT NULL DEFAULT '' COMMENT '附加计时器，记录其他页面、脚本的执行时间',
  `front_time` int(11) NOT NULL DEFAULT '0' COMMENT '前端时间',
  `back_time` int(11) NOT NULL DEFAULT '0' COMMENT '后端时间',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_restiming`: 单次采集的子应用瀑布流数据
-- --------------------------------------------------------------
CREATE TABLE `web_pages_restiming` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `restiming` varchar(16293) NOT NULL DEFAULT '' COMMENT '瀑布流数据',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_navigation`: 单次采集的Navigation Timing数据
-- --------------------------------------------------------------
CREATE TABLE `web_pages_navigation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `connect_end` BigInt(50) NOT NULL DEFAULT '0' COMMENT '完成建立连接时的时间戳',
  `connect_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '开始建立连接时的时间戳',
  `domain_lookup_end` BigInt(50) NOT NULL DEFAULT '0' COMMENT '域名查询结束的时间戳',
  `domain_lookup_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '域名查询开始的时间戳',
  `dom_complete` BigInt(50) NOT NULL DEFAULT '0' COMMENT '文档解析完成的时间戳',
  `dom_content_loaded_event_end` BigInt(50) NOT NULL DEFAULT '0'  COMMENT '所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳',
  `dom_content_loaded_event_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '所有需要被执行的脚本已经被解析时的时间戳',
  `dom_interactive` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'DOM结构结束解析、开始加载内嵌资源时的时间戳',
  `dom_loading` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'DOM结构开始解析时的时间戳',
  `fetch_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳',
  `load_event_end` BigInt(50) NOT NULL DEFAULT '0' COMMENT '加载事件完成时的时间戳',
  `load_event_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'load事件被发送时的时间戳',
  `navigation_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '上一个文档卸载(unload)结束时的时间戳',
  `request_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '发出HTTP请求时（或开始读取本地缓存时）的时间戳',
  `response_end` BigInt(50) NOT NULL DEFAULT '0' COMMENT '从服务器收到最后一个字节时的时间戳',
  `response_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '从服务器收到第一个字节时的时间戳',
  `unload_event_end` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'unload事件处理完成时的时间戳',
  `unload_event_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'unload事件抛出时的时间戳',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_resources`: 单次采集的页面资源数据
-- --------------------------------------------------------------
CREATE TABLE `web_pages_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `page_id` char(80) NOT NULL DEFAULT '' COMMENT '页面全局id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT 'url地址',
  `body_size` int(11) NOT NULL DEFAULT '0' COMMENT '解码后Body大小',
  `encoded_body_size` int(11) NOT NULL DEFAULT '0' COMMENT '编码后的body大小',
  `redirect_count` int(11) NOT NULL DEFAULT '0' COMMENT '重定向数量',
  `transfer_size` int(11) NOT NULL DEFAULT '0' COMMENT '数据包大小',
  `doms_number` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的DOM节点数',
  `script_number` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的script节点数',
  `external_script_number` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的外部script节点数',
  `resources_fetch_number` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的资源请求数',
  `html_size` int(11) NOT NULL DEFAULT '0' COMMENT '主frame的HTML字节数',
  `img_number` int(11) NOT NULL DEFAULT '0' COMMENT 'IMG节点个数',
  `link_number` int(11) NOT NULL DEFAULT '0' COMMENT 'LINK节点个数',
  `css_number` int(11) NOT NULL DEFAULT '0' COMMENT 'stylesheet和link个数',
  `iframe_number` int(11) NOT NULL DEFAULT '0' COMMENT 'iframe个数',
  `unique_domains_number` int(11) NOT NULL DEFAULT '0' COMMENT '主页中唯一域的数量',
  `cookies_size` int(11) NOT NULL DEFAULT '0' COMMENT 'cookie的字节数',
  `total_js_heap_size` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS堆栈总大小',
  `js_heap_size_limit` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS的堆栈限制',
  `used_js_heap_size` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'JS堆栈使用大小',
  `used_local_storage_size` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'Localstorage使用大小',
  `used_local_storage_keys` int(11) NOT NULL DEFAULT '0' COMMENT 'Localstorage的key数量',
  `used_session_storage_size` BigInt(50) NOT NULL DEFAULT '0' COMMENT 'SessionStorage使用大小',
  `used_session_storage_keys` int(11) NOT NULL DEFAULT '0' COMMENT 'SessionStorage的key数量',
  `nocookie` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'cookie的使用情况1未使用',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_client`: 单次采集的客户端信息
-- --------------------------------------------------------------
CREATE TABLE `web_pages_client` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `page_id` char(80) NOT NULL DEFAULT '' COMMENT '页面全局id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT 'url地址',
  `appin` char(10) NOT NULL DEFAULT '' COMMENT 'App进入点',
  `navigation_type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '导航方式：0 链接；1 重新加载； 2 前进、后退； 255 其他',
  `next_hop_protocol` char(70) NOT NULL DEFAULT '' COMMENT '网络协议 ',
  `system` char(20) NOT NULL DEFAULT '' COMMENT '操作系统',
  `browser` char(20) NOT NULL DEFAULT '' COMMENT '浏览器',
  `cpu_concurrency` int(11) NOT NULL DEFAULT '0' COMMENT 'CPU并发量',
  `screen_color_depth` char(20) NOT NULL DEFAULT '' COMMENT '屏幕色深',
  `screen_orientation` char(20) NOT NULL DEFAULT '' COMMENT '屏幕方向',
  `screen_size` char(20) NOT NULL DEFAULT '' COMMENT '屏幕尺寸',
  `http_initiator` char(20) NOT NULL DEFAULT '' COMMENT '页面切换类型',
  `effective_type` char(20) NOT NULL DEFAULT '' COMMENT '带宽类型',
  `downlink` char(20) NOT NULL DEFAULT '0' COMMENT '有效带宽',
  `round_trip_time` char(20) NOT NULL DEFAULT '0' COMMENT '网络延迟',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_pages_probe`: 单次采集的探针信息
-- --------------------------------------------------------------
CREATE TABLE `web_pages_probe` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `monitor_id` int(11) NOT NULL DEFAULT '0' COMMENT '单次数据采集的标识符，对应web_pages_basic的id',
  `boomerang_snippet_method` char(10) NOT NULL DEFAULT '' COMMENT '探针代码嵌入方式 iframe、src、preload',
  `time_to_interactive_method` char(10) NOT NULL DEFAULT '' COMMENT '可交互性的判定方法',
  `trigger_method` char(20) NOT NULL DEFAULT '' COMMENT '触发方式',
  `trigger_start` BigInt(50) NOT NULL DEFAULT '0' COMMENT '触发时间戳',
  `boomer_time` char(30) NOT NULL DEFAULT '' COMMENT 'Boomerang自身加载时间参数',
  `continuity_epoch` char(20) NOT NULL DEFAULT '' COMMENT '可监测总时间',
  `continuity_last_beacon` char(20) NOT NULL DEFAULT '' COMMENT '最后一个信标的监测时间',
  `beacon_number` int(11) NOT NULL DEFAULT '0' COMMENT '信标的数量',
  `boomerang_version` char(10) NOT NULL DEFAULT '' COMMENT 'Boomerang版本',
  `page_visibility` char(20) NOT NULL DEFAULT '' COMMENT '返回数据时页面的可见性',
  PRIMARY KEY (`id`,`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------
--  Table `web_system`: 系统注册信息
-- --------------------------------------------------------------
CREATE TABLE `web_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `system_domain` char(50) NOT NULL DEFAULT '' COMMENT '系统域名',
  `system_name` char(20) NOT NULL DEFAULT '' COMMENT '系统名称',
  `sub_systems` varchar(5000) NOT NULL DEFAULT '' COMMENT '子系统',
  `script` varchar(5000) NOT NULL DEFAULT '' COMMENT '获取页面统计脚本',
  `is_use` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要统计  0：是  1：否',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '系统新增时间',
  `slow_page_time` tinyint(2) NOT NULL DEFAULT '8' COMMENT '页面加载页面阀值  单位：s',
  `slow_js_time` tinyint(2) NOT NULL DEFAULT '2' COMMENT 'js慢资源阀值 单位：s',
  `slow_css_time` tinyint(2) NOT NULL DEFAULT '1' COMMENT '慢加载css资源阀值  单位：s',
  `slow_img_time` tinyint(2) NOT NULL DEFAULT '2' COMMENT '慢图片加载资源阀值  单位：s',
  `slow_ajax_time` tinyint(2) NOT NULL DEFAULT '2' COMMENT 'AJAX加载阀值',
  `app_id` char(70) NOT NULL DEFAULT '' COMMENT '系统appId标识',
  `is_monitor_pages` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面性能信息  0：是   1：否',
  `is_monitor_ajax` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面Ajax性能资源 0：是  1：否',
  `is_monitor_resource` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否统计页面加载资源性能信息 0：是    1：否',
  `is_monitor_system` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否存储用户系统信息资源信息',
  PRIMARY KEY (`id`,`app_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
