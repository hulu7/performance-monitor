const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesProbe = sequelize.define(
  "web_pages_probe",
  { // 单次采集的探针信息
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为空
      autoIncrement: true, // 是否自增,
      primaryKey: true, // 是否主键,
      comment:'id自增' // 注解
    },
    monitor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
      comment:'单次数据采集的标识符，关联web_pages_basic的id'
    },
    boomerang_snippet_method: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: '',
      comment:'探针代码嵌入方式 iframe、src、preload'
    },
    time_to_interactive_method: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: '',
      comment:'可交互性的判定方法'
    },
    trigger_method: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'触发方式'
    },
    trigger_start: {
      type: DataTypes.BIGINT(50),
      allowNull: true,
      defaultValue: 0,
      comment:'触发时间戳'
    },
    boomer_time: {
      type: DataTypes.CHAR(30),
      allowNull: false,
      defaultValue: '',
      comment:'Boomerang自身加载时间参数'
    },
    continuity_epoch: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'可监测总时间'
    },
    continuity_last_beacon: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'最后一个信标的监测时间'
    },
    beacon_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'信标的数量'
    },
    boomerang_version: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: '',
      comment:'Boomerang版本'
    },
    page_visibility: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'返回数据时页面的可见性'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)
module.exports = WebPagesProbe
