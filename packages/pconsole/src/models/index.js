const {
  sequelize,
  Op
} = require('../database/connect')
const WebPagesBasic = require('./webPagesBasic')
const WebPagesClient = require('./webPagesClient')
const WebPagesNavigation = require('./webPagesNavigation')
const WebPagesProbe = require('./webPagesProbe')
const WebPagesResources = require('./webPagesResources')
const WebPagesRestiming = require('./webPagesRestiming')
const WebPagesTiming = require('./webPagesTiming')
const WebSystem = require('./webSystem')

sequelize.sync({ alter: true }).then(r => console.log('所有模型均已成功同步.'))
module.exports = {
  Op,
  WebPagesBasic,
  WebPagesClient,
  WebPagesNavigation,
  WebPagesProbe,
  WebPagesResources,
  WebPagesRestiming,
  WebPagesTiming,
  WebSystem
}

