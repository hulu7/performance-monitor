const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库
const WebPagesBasic = sequelize.define(
  "web_pages_basic",
  { // 单次采集数据页面基本信息
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为空
      autoIncrement: true, // 是否自增,
      primaryKey: true, // 是否主键,
      comment:'id自增' // 注解
    },
    page_id:{
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'页面全局id'
    },
    system_id: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: '',
      comment:'所属系统标识符，关联web_system的id'
    },
    app_id: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'应用唯一标识符'
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      comment:'用户标识符'
    },
    app_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment:'应用名称'
    },
    is_main: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'是否是主应用  0：是  1：否'
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment:'url地址'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment:'访问页面时间'
    },
    mark_page: {
      type: DataTypes.CHAR(80),
      allowNull: false,
      defaultValue: '',
      comment:'所有资源页面统一标识'
    },
    additional_info: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 2,
      comment:'附加信息'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)
module.exports = WebPagesBasic
