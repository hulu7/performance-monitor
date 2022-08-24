const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesClient = sequelize.define(
  "web_pages_client",
  { // 单次采集的客户端信息
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
    page_id:{
      type: DataTypes.CHAR(80),
      allowNull: false,
      defaultValue: '',
      comment:'页面全局id'
    },
    app_id: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'应用唯一标识符'
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment:'url地址'
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment:'IP地址'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment:'地理位置'
    },
    appin: {
      type: DataTypes.CHAR(10),
      allowNull: true,
      defaultValue: '',
      comment:'App进入点'
    },
    navigation_type: {
      type: DataTypes.TINYINT(3),
      allowNull: false,
      defaultValue: 0,
      comment:'导航方式：0 链接；1 重新加载； 2 前进、后退； 255 其他'
    },
    next_hop_protocol: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'网络协议'
    },
    system: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'操作系统'
    },
    browser: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'浏览器'
    },
    cpu_concurrency: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'CPU并发量'
    },
    screen_color_depth: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'屏幕色深'
    },
    screen_orientation: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'屏幕方向'
    },
    screen_size: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'屏幕分辨率'
    },
    http_initiator: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'页面切换类型'
    },
    effective_type: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'带宽类型'
    },
    downlink: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '0',
      comment:'有效带宽'
    },
    round_trip_time: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '0',
      comment:'网络延迟'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)
module.exports = WebPagesClient
