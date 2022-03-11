const {
  WebPagesBasic,
  WebPagesClient,
  WebPagesResources,
  WebPagesRestiming,
  WebPagesTiming,
} = require('../models/index')
const { Sequelize,  Op } = require('sequelize'); // 引入sequelize依赖
const {gte, lte} = Op;

class AppService {
  // 获取应用列表
  async getAppList(param) {
    const {
      systemId: system_id,
      pageNo, pageSize
    } = param;

    return WebPagesBasic.findAndCountAll({
      where: {
        system_id
      },
      group: ['app_name', 'app_id', 'is_main'],
      attributes: ['app_id', 'app_name', 'is_main', [Sequelize.fn('COUNT', 'app_id'), 'count']],
      order: [
        [Sequelize.literal('count'), 'DESC']
      ],
      limit: Math.floor(pageSize), //Math.floor(pageSize)
      offset: (pageNo - 1) * Math.floor(pageSize),
      raw: true
    })
  }

    // 获取应用历史
    async getAppHistory(param) {
      const {
        appId: app_id,
        pageNo, pageSize,
        beginTime, endTime, userId
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

      if (userId) {
        Object.assign(query, {
          user_id: userId
        })
      }
  
      return WebPagesBasic.findAndCountAll({
        where: query,
        include:[{
          model: WebPagesTiming,
          attributes: ['load_time', 'white_time', 'request_time']
        }],
        limit: Math.floor(pageSize),
        order: [['create_time', 'DESC']],
        offset: (pageNo - 1) * Math.floor(pageSize),
        raw: true,
        distinct: true,
        subQuery: false
      });
    }

    async getWebPagesBasicById(param) {
      const {
        id
      } = param;

      return WebPagesBasic.findAll({
        where: {
          id
        },
        raw: true
      });
    }

    async getWebPagesClientById(param) {
      const {
        id: monitor_id
      } = param;

      return WebPagesClient.findAll({
        where: {
          monitor_id
        },
        raw: true
      });
    }

    async getWebPagesResourcesById(param) {
      const {
        id: monitor_id
      } = param;

      return WebPagesResources.findAll({
        where: {
          monitor_id
        },
        raw: true
      });
    }

    async getWebPagesRestimingById(param) {
      const {
        id: monitor_id
      } = param;

      return WebPagesRestiming.findAll({
        where: {
          monitor_id
        },
        raw: true
      });
    }

    async getWebPagesTimingById(param) {
      const {
        id: monitor_id
      } = param;

      return WebPagesTiming.findAll({
        where: {
          monitor_id
        },
        raw: true
      });
    }

    // 获取应用详情
    async getAppDetail(param) {
      const {
        id
      } = param;

      return WebPagesBasic.findAll({
        where: {
          id
        },
        include:[{
          model: WebPagesClient
        }, {
          model: WebPagesResources
        }, {
          model: WebPagesRestiming
        }, {
          model: WebPagesTiming
        }]
      });
    }

    // 获取单个应用
    async getSingleApp(param) {
      const {
        systemId: system_id,
        appId: app_id
      } = param;
  
      return WebPagesBasic.findAll({
        where: {
          system_id,
          app_id
        },
        raw: true,
        limit: 1,
        offset: 0
      })
    }

  async getAveragePageTiming(param) {
    const {
      appId: app_id
    } = param;
    return WebPagesTiming.findAll({
      where: {
        app_id
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('load_time')), 'load_time'],
        [Sequelize.fn('AVG', Sequelize.col('white_time')), 'white_time'],
        [Sequelize.fn('AVG', Sequelize.col('first_paint')), 'first_paint'],
        [Sequelize.fn('AVG', Sequelize.col('first_contentful_paint')), 'first_contentful_paint'],
        [Sequelize.fn('AVG', Sequelize.col('time_to_interactive')), 'time_to_interactive'],
        [Sequelize.fn('AVG', Sequelize.col('visually_ready_time')), 'visually_ready_time'],
        [Sequelize.fn('AVG', Sequelize.col('perceived_load_time')), 'perceived_load_time'],
        [Sequelize.fn('AVG', Sequelize.col('dom_time')), 'dom_time'],
        [Sequelize.fn('AVG', Sequelize.col('analysis_dom_time')), 'analysis_dom_time'],
        [Sequelize.fn('AVG', Sequelize.col('dns_time')), 'dns_time'],
        [Sequelize.fn('AVG', Sequelize.col('tcp_time')), 'tcp_time'],
        [Sequelize.fn('AVG', Sequelize.col('redirect_time')), 'redirect_time'],
        [Sequelize.fn('AVG', Sequelize.col('unload_time')), 'unload_time'],
        [Sequelize.fn('AVG', Sequelize.col('request_time')), 'request_time'],
        [Sequelize.fn('AVG', Sequelize.col('ready_time')), 'ready_time'],
        [Sequelize.fn('AVG', Sequelize.col('boomerang_start_time')), 'boomerang_start_time'],
        [Sequelize.fn('AVG', Sequelize.col('boomerang_end_time')), 'boomerang_end_time'],
        [Sequelize.fn('AVG', Sequelize.col('session_start')), 'session_start'],
        [Sequelize.fn('AVG', Sequelize.col('sum_load_times')), 'sum_load_times'],
        [Sequelize.fn('AVG', Sequelize.col('front_time')), 'front_time'],
        [Sequelize.fn('AVG', Sequelize.col('back_time')), 'back_time'],
        [Sequelize.fn('COUNT', Sequelize.col('app_id')), 'count'],
      ],
      raw: true
    })
  }

  async getAveragePageResources(param) {
    const {
      appId: app_id
    } = param;
    return WebPagesResources.findAll({
      where: {
        app_id
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('body_size')), 'body_size'],
        [Sequelize.fn('AVG', Sequelize.col('encoded_body_size')), 'encoded_body_size'],
        [Sequelize.fn('AVG', Sequelize.col('redirect_count')), 'redirect_count'],
        [Sequelize.fn('AVG', Sequelize.col('transfer_size')), 'transfer_size'],
        [Sequelize.fn('AVG', Sequelize.col('unique_domains_number')), 'unique_domains_number'],
        [Sequelize.fn('AVG', Sequelize.col('iframe_number')), 'iframe_number'],
        [Sequelize.fn('AVG', Sequelize.col('img_number')), 'img_number'],
        [Sequelize.fn('AVG', Sequelize.col('link_number')), 'link_number'],
        [Sequelize.fn('AVG', Sequelize.col('css_number')), 'css_number'],
        [Sequelize.fn('AVG', Sequelize.col('doms_number')), 'doms_number'],
        [Sequelize.fn('AVG', Sequelize.col('resources_fetch_number')), 'resources_fetch_number'],
        [Sequelize.fn('AVG', Sequelize.col('script_number')), 'script_number'],
        [Sequelize.fn('AVG', Sequelize.col('external_script_number')), 'external_script_number'],
        [Sequelize.fn('AVG', Sequelize.col('html_size')), 'html_size'],
        [Sequelize.fn('AVG', Sequelize.col('html_size')), 'html_size'],
        [Sequelize.fn('COUNT', Sequelize.col('app_id')), 'count'],
      ],
      raw: true
    })
  }

  async getAveragePagesClient(param) {
    const {
      appId: app_id
    } = param;
    return WebPagesClient.findAll({
      where: {
        app_id
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('cpu_concurrency')), 'cpu_concurrency'],
        [Sequelize.fn('AVG', Sequelize.col('round_trip_time')), 'round_trip_time'],
        [Sequelize.fn('AVG', Sequelize.col('downlink')), 'downlink'],
        [Sequelize.fn('COUNT', Sequelize.col('app_id')), 'count'],
      ],
      raw: true
    })
  }
}

module.exports = new AppService()
  