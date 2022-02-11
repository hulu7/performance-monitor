const {
  sequelize,
  Op
} = require('../database/connect');
const WebPagesBasic = require('./webPagesBasic');
const WebPagesClient = require('./webPagesClient');
const WebPagesNavigation = require('./webPagesNavigation');
const WebPagesProbe = require('./webPagesProbe');
const WebPagesResources = require('./webPagesResources');
const WebPagesRestiming = require('./webPagesRestiming');
const WebPagesTiming = require('./webPagesTiming');
const WebSystem = require('./webSystem');
const WebUser = require('./webUser');

// 一（WebSystem）对多（WebPagesBasic）
WebSystem.hasMany(WebPagesBasic, { foreignKey: 'system_id' })
WebPagesBasic.belongsTo(WebSystem, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesClient）
WebPagesBasic.hasOne(WebPagesClient, { foreignKey: 'monitor_id' })
WebPagesClient.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesNavigation）
WebPagesBasic.hasOne(WebPagesNavigation, { foreignKey: 'monitor_id' })
WebPagesNavigation.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesProbe）
WebPagesBasic.hasOne(WebPagesProbe, { foreignKey: 'monitor_id' })
WebPagesProbe.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesResources）
WebPagesBasic.hasOne(WebPagesResources, { foreignKey: 'monitor_id' })
WebPagesResources.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesRestiming）
WebPagesBasic.hasOne(WebPagesRestiming, { foreignKey: 'monitor_id' })
WebPagesRestiming.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

// 一（WebPagesBasic）对一（WebPagesTiming）
WebPagesBasic.hasOne(WebPagesTiming, { foreignKey: 'monitor_id' })
WebPagesTiming.belongsTo(WebPagesBasic, { foreignKey: 'id', targetKey: 'id' })

sequelize.sync({ alter: true })
  .then(r => console.log('所有模型均已成功同步.'))
  .catch(err => {
    console.error(`错误信息：${err}`);
  });

module.exports = {
  Op,
  WebPagesBasic,
  WebPagesClient,
  WebPagesNavigation,
  WebPagesProbe,
  WebPagesResources,
  WebPagesRestiming,
  WebPagesTiming,
  WebSystem,
  WebUser
}
