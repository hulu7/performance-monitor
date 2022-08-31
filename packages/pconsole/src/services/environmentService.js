const {
  WebPagesBasic,
  WebPagesClient,
} = require('../models/index');
const koa2Req = require('koa2-request');
const { Sequelize,  Op } = require('sequelize'); // 引入sequelize依赖
const { ne, or, gte, lte } = Op;

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

  async queryIPGeo() {
    try {
      const targetData = await WebPagesClient.findAndCountAll({
        where: {
          ip: {
            [ne]: ''
          },
          location: {
            [or]: [null, '']
          }
        },
        limit: 10,
        offset: 0,
        raw: true
      })
      const requests = targetData.rows.map(item => koa2Req(`https://api.ipplus360.com/ip/geo/v1/city/?key=2ESgJHS1TZ9qkQiXgbPNu4uyMDzf9enUPSu50IcyPKhbrYtStaYHHyi8lDU3gKTq&ip=${item.ip}&coordsys=BD09&area=multi`))
      const responses = await Promise.all(requests)
      
      if (responses && responses.length) {
        console.log('-------New data! start to update LBS-------')
        const updateRequests = []
        responses.map(async (res, index) => {
          if (res && res.body) {
            const {
              continent,
              country,
              city,
              lat,
              lng
            } = JSON.parse(res.body).data
            updateRequests.push(WebPagesClient.update({
              location: JSON.stringify({
                continent,
                country,
                city,
                lat,
                lng
              })
            }, {
              where: {
                id: targetData.rows[index].id,
              }
            }))
          }
        })
        await Promise.all(updateRequests)
      } else {
        console.log('-------Nothing to update-------')
      }
    } catch(e) {
      console.error(e)
    }
  }

  async queryIPGeoHistory(param) {
    try {
      const {
        appId: app_id,
        beginTime,
        endTime,
      } = param;
  
      const query = {
        app_id
      };
  
      if (beginTime && endTime) {
        Object.assign(query, {
          create_time: {
            [gte]: beginTime,
            [lte]: endTime
          }
        });
      }
  
      return WebPagesBasic.findAndCountAll({
        where: query,
        include:[{
          model: WebPagesClient,
        }],
        raw: true,
        distinct: true,
        subQuery: false
      });
    } catch(e) {
      console.error(e)
    }
  }
}

module.exports = new EnvironmentService()
  