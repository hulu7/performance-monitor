const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesRestiming = sequelize.define(
  "web_pages_restiming",
  { // 单次采集的时间相关性能数据
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
    restiming: {
      type: DataTypes.STRING(16293),
      allowNull: false,
      defaultValue: '',
      comment:'瀑布流数据'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebPagesRestiming
