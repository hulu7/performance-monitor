const {
  WebPagesBasic,
  WebPagesClient,
  WebPagesNavigation,
  WebPagesProbe,
  WebPagesResources,
  WebPagesRestiming,
  WebPagesTiming
} = require('../models/index')

class ReportService {
  // 获取应用列表
  async storePerformanceData(param) {
    const {
      basicData,
      timingData,
      restimingData,
      navigationData,
      resourcesData,
      clientData,
      probeData,
    } = param;

    const basic = await WebPagesBasic.create(basicData);
    if (basic && basic.id) {
      const monitor_id = basic.id;
      Object.assign(timingData, { monitor_id });
      Object.assign(restimingData, { monitor_id });
      Object.assign(navigationData, { monitor_id });
      Object.assign(resourcesData, { monitor_id });
      Object.assign(clientData, { monitor_id });
      Object.assign(probeData, { monitor_id });
    }
    return Promise.all([
      WebPagesClient.create(clientData),
      WebPagesNavigation.create(navigationData),
      WebPagesProbe.create(probeData),
      WebPagesResources.create(resourcesData),
      WebPagesRestiming.create(restimingData),
      WebPagesTiming.create(timingData),
      WebPagesTiming.create(timingData)
    ])
  }
}

module.exports = new ReportService()
  