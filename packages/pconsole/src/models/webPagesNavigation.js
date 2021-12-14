const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesNavigation = sequelize.define(
  "web_pages_navigation",
  { // 单次采集的Navigation Timing数据
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为空
      autoIncrement: true, // 是否自增,
      primaryKey: true, // 是否主键,
      comment:'id自增' // 注解
    },
    monitor_id:{
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
      comment:'单次数据采集的标识符，关联web_pages_basic的id'
    },
    connect_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'完成建立连接时的时间戳'
    },
    connect_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'开始建立连接时的时间戳'
    },
    domain_lookup_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'域名查询结束的时间戳'
    },
    domain_lookup_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'域名查询开始的时间戳'
    },
    dom_complete: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'文档解析完成的时间戳'
    },
    dom_content_loaded_event_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳'
    },
    dom_content_loaded_event_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'所有需要被执行的脚本已经被解析时的时间戳'
    },
    dom_interactive: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'DOM结构结束解析、开始加载内嵌资源时的时间戳'
    },
    dom_loading: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'DOM结构开始解析时的时间戳'
    },
    fetch_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳'
    },
    load_event_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'加载事件完成时的时间戳'
    },
    load_event_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'load事件被发送时的时间戳'
    },
    navigation_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'上一个文档卸载(unload)结束时的时间戳'
    },
    request_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'发出HTTP请求时（或开始读取本地缓存时）的时间戳'
    },
    response_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'从服务器收到最后一个字节时的时间戳'
    },
    response_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'从服务器收到第一个字节时的时间戳'
    },
    unload_event_end: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'unload事件处理完成时的时间戳'
    },
    unload_event_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'unload事件抛出时的时间戳'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebPagesNavigation
