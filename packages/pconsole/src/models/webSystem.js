const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库
const WebSystem = sequelize.define(
  "web_system",
  { // 系统注册信息
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为空
      autoIncrement: true, // 是否自增,
      primaryKey: true, // 是否主键,
      comment:'id自增' // 注解
    },
    uuid:{
      type: DataTypes.CHAR(70),
      allowNull: false,
      primaryKey: true,
      defaultValue: '',
      comment:'系统唯一标识符'
    },
    system_domain: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: '',
      comment:'系统域名'
    },
    system_name: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'系统名称'
    },
    script: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      defaultValue: '',
      comment:'获取页面统计脚本'
    },
    is_use: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否需要统计  0：是  1：否'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment:'系统新增时间'
    },
    slow_page_time: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 8,
      comment:'页面加载页面阀值  单位：s'
    },
    slow_js_time: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 2,
      comment:'js慢资源阀值  单位：s'
    },
    slow_css_time: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 1,
      comment:'慢加载css资源阀值  单位：s'
    },
    slow_img_time: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 2,
      comment:'慢图片加载资源阀值  单位：s'
    },
    slow_ajax_time: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 2,
      comment:'AJAX加载阀值'
    },
    is_monitor_pages: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否统计页面性能信息  0：是   1：否'
    },
    is_monitor_ajax: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否统计页面Ajax性能资源  0：是  1：否'
    },
    is_monitor_resource: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否统计页面加载资源性能信息  0：是    1：否'
    },
    is_monitor_system: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否存储用户系统信息资源信息'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebSystem
