const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesTiming = sequelize.define(
  "web_pages_timing",
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
    app_id: {
      type: DataTypes.CHAR(70),
      allowNull: false,
      defaultValue: '',
      comment:'应用唯一标识符'
    },
    page_id: {
      type: DataTypes.CHAR(80),
      allowNull: false,
      defaultValue: '',
      comment:'页面全局id'
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      comment:'url地址'
    },
    load_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'页面完全加载时间 单位：ms'
    },
    white_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'白屏时间 单位：ms'
    },
    first_paint: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 8,
      comment:'首像素时间 (ms)'
    },
    first_contentful_paint: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 2,
      comment:'首次内容绘制时间 (ms)'
    },
    time_to_interactive: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1,
      comment:'可交互时间'
    },
    visually_ready_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 2,
      comment:'视觉就绪时间 ms'
    },
    perceived_load_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 2,
      comment:'可感知加载时间'
    },
    dom_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'DOM构建时间 单位：ms'
    },
    analysis_dom_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'解析dom耗时'
    },
    dns_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'dns解析时间 单位：ms'
    },
    tcp_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'TCP连接时间'
    },
    redirect_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'页面重定向时间'
    },
    unload_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'unload 时间'
    },
    request_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'request请求耗时'
    },
    ready_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'页面准备时间'
    },
    boomerang_start_time: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'boomerang插件开始执行时间'
    },
    boomerang_end_time: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
      comment:'boomerang插件停止监控时间'
    },
    no_load_pages_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'一个session下没有加载时间的页面'
    },
    session_id: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: '',
      comment:'session id'
    },
    session_length: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'Session的个数'
    },
    session_start: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'Session开始时间戳'
    },
    sum_load_times: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '一个session下的总加载时间'
    },
    additional_timers: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      comment: '附加计时器，记录其他页面、脚本的执行时间'
    },
    front_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '前端时间'
    },
    back_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '后端时间'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebPagesTiming
