const {
  WebPagesClient,
} = require('../models/index')
const { Sequelize } = require('sequelize'); // 引入sequelize依赖

class EnvironmentService {
  // 获取不同类型的环境信息
  async getDataForEnvironment(param) {
    const {
      appId: app_id,
      type
    } = param;

    return WebPagesClient.findAll({
      where: {
        app_id
      },
      group: [type],
      attributes: [
        type,
        [Sequelize.fn('COUNT', Sequelize.col(type)), 'count']
      ],
      raw: true
    })
  }
}

module.exports = new EnvironmentService()
  