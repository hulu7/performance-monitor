import {
    DB
} from '../config.js'

const { Sequelize, DataTypes , Op } = require('sequelize'); // 引入sequelize依赖
const sequelize = new Sequelize({
    host: DB.HOST,
    port: DB.PROT,
    dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一，并安装相应的npm包 */
    port: DB.PROT,
    username: DB.USER,
    password: DB.PASSWORD,
    database: DB.DATABASE,
    pool: { // 连接池配置
        min: 0, // 最小连接数
        max: DB.POOLLIMIT,  // 最大连接数
        idle: 30000,
        acquire: 60000
    },
    define: {
      underscored: true, // 字段以下划线（_）来分割（默认是驼峰命名风格）
      freezeTableName: true, // 禁止在创建表名称时自动加s
      createdAt: false, // 禁止在创建表时自动加created_at列
      updatedAt: false, // 禁止在创建表时自动加updated_at列
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    },
    timezone: '+08:00'
});

sequelize.authenticate().then(() => {
    console.log('数据库连接成功！');
}).catch(err => {
    console.error('数据库连接失败:', err);
});

module.exports = {
    sequelize, // 将sequelize暴露出接口方便Model调用
    DataTypes,
    Op
}
