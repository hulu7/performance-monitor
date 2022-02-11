const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库
const WebUser = sequelize.define(
  "web_user",
  { // 用户信息
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为空
      autoIncrement: true, // 是否自增,
      primaryKey: true, // 是否主键,
      comment:'id自增' // 注解
    },
    user_name:{
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'用户名'
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: '',
      comment:'用户密码'
    },
    system_ids: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment:'用户所拥有的系统id列表'
    },
    user_img: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: '',
      comment:'用户头像'
    },
    user_phone: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      defaultValue: '',
      comment: '用户电话号码'
    },
    user_email: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: '',
      comment: '用户邮箱'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment:'系统新增时间'
    },
    login_expire_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment:'用户登录过期时间'
    },
    is_permit: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否禁用 0：正常  1：禁用',
    },
    level: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1,
      comment: '用户等级（0：管理员，1：普通用户）',
    },
    token: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: '',
      comment: '用户秘钥'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebUser
