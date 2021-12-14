const { sequelize, DataTypes } = require("../database/connect") // 引入相关依赖以及数据库

const WebPagesResources = sequelize.define(
  "web_pages_resources",
  { // 单次采集的页面资源数据
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
    page_id: {
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
    body_size: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'解码后Body大小'
    },
    encoded_body_size: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'编码后的body大小'
    },
    redirect_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'重定向数量'
    },
    transfer_size: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'数据包大小'
    },
    doms_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主frame的DOM节点数'
    },
    script_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主frame的script节点数'
    },
    external_script_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主frame的外部script节点数'
    },
    resources_fetch_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主frame的资源请求数'
    },
    html_size: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主frame的HTML字节数'
    },
    img_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'IMG节点个数'
    },
    link_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'LINK节点个数'
    },
    css_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'stylesheet和link个数'
    },
    iframe_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'iframe个数'
    },
    unique_domains_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'主页中唯一域的数量'
    },
    cookies_size: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'cookie的字节数'
    },
    total_js_heap_size: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'JS堆栈总大小'
    },
    js_heap_size_limit: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'JS的堆栈限制'
    },
    used_js_heap_size: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'JS堆栈使用大小'
    },
    used_local_storage_size: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'Localstorage使用大小'
    },
    used_local_storage_keys: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'Localstorage的key数量'
    },
    used_session_storage_size: {
      type: DataTypes.BIGINT(50),
      allowNull: false,
      defaultValue: 0,
      comment:'SessionStorage使用大小'
    },
    used_session_storage_keys: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment:'SessionStorage的key数量'
    },
    nocookie: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment:'cookie的使用情况1未使用'
    }
  },
  {
    timestamps: true, // 是否自动在数据表中添加数据操作时间
  }
)

module.exports = WebPagesResources
