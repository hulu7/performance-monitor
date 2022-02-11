const {
  WebUser,
} = require('../models/index')

class UserService {
    // 根据用户ID获取用户信息
    async getUserById(id) {
      return WebUser.findAll({
        where: {
          id
        },
      });
    }

    // 根据用户名称获取用户信息
    async getUserByName(user_name) {
      return WebUser.findAll({
        where: {
          user_name
        },
      });
    }

    // 新增用户
    async createUser(user) {
      return WebUser.create(user)
    }

    // 更新用户信息
    async updateUser (id, data) {
      await WebUser.update(data, {
        where: {
          id,
        }
      })
    }
}

module.exports = new UserService()
  