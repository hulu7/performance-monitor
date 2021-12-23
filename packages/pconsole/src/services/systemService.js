const {
    WebSystem
  } = require('../models/index')
  
  class SystemService {
    // 获取系统列表
    async getAllSystems() {
      return WebSystem.findAll({
        order: [[ 'create_time', 'DESC' ]],
      })
    }

    // 根据系统ID获取系统详情
    async getSystemById(id) {
      return WebSystem.findAll({
        where: {
          id,
        },
      })
    }

    // 根据系统UUID获取系统详情
    async getSystemByUUID(uuid) {
      return WebSystem.findAll({
        where: {
          uuid,
        },
      })
    }

    // 根据系统ID获取系统详情
    async getSystemByName(system_name) {
      return WebSystem.findAll({
        where: {
          system_name,
        },
      })
    }

    // 根据系统Domain获取系统详情
    async getSystemByDomain(system_domain) {
      return WebSystem.findAll({
        where: {
          system_domain,
        },
      })
    }

    // 新增系统
    async createSystem(system) {
      return WebSystem.create(system)
    }

    // 更新系统设置
    async updateSystem (id, data) {
      await WebSystem.update(data, {
        where: {
          id,
        }
      })
    }
  }
  
  module.exports = new SystemService()
  