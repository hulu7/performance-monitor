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

  // 获取用户列表
  async getUserList(param) {
    const {
      pageNo, pageSize
    } = param;

    return WebUser.findAndCountAll({
      order: [['create_time', 'DESC']],
      attributes: [
        'id',
        'user_name',
        'system_ids',
        'user_img',
        'user_phone',
        'user_email',
        'create_time',
        'is_permit',
        'level'
      ],
      raw: true,
      limit: Math.floor(pageSize),
      offset: (pageNo - 1)
    });
  }
}

module.exports = new UserService()
  