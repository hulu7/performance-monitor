const {
    WebSystem
  } = require('../models/index')
  const {
    sequelize
  } = require('../database/connect')
  
  class SystemService {
    // 获取系统列表
    async getAllSystems() {
      return WebSystem.findAll({
        order: [[ 'create_time', 'DESC' ]],
      })
    }
  }
  
  module.exports = new SystemService()
  