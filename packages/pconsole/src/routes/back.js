//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
const router = new KoaRouter()

// 上报性能数据
router.post('/reportPerformance', controllers.dataReport.reportPerformance);

//----------------------------SYSTEMS--------------------------------------
// 新增应用
router.post('/api/system/add', controllers.system.addSystem)
// 修改应用
router.post('/api/system/update', controllers.system.updateSystem)
// 请求某个系统详情
router.post('/api/system/detail', controllers.system.getItemSystem)
//获得系统列表
router.post('/api/system/list', controllers.system.getSystemList)
// 设置系统是否需要统计数据
router.post('/api/system/required', controllers.system.isStatisData)

//----------------------------Apps--------------------------------------
// 获得page列表
router.post('/api/apps/list', controllers.app.getAppsList)
// 获得page概览
router.post('/api/apps/average', controllers.app.getAppAverage)
// 获得page详情性能信息
router.post('/api/apps/history', controllers.app.getAppHistory)
// 根据ID获得page详情性能信息
router.post('/api/apps/detail', controllers.app.getAppDetail)
// 根据ID获得page基本信息
router.post('/api/apps/basic', controllers.app.getWebPageBasicInfo)
// 根据ID获得page基本信息
router.post('/api/apps/clients', controllers.app.getWebPageClientsInfo)
// 根据ID获得page基本信息
router.post('/api/apps/resources', controllers.app.getWebPageResourcesInfo)
// 根据ID获得page基本信息
router.post('/api/apps/restimings', controllers.app.getWebPageRestimingsInfo)
// 根据ID获得page基本信息
router.post('/api/apps/timing', controllers.app.getWebPageTimingInfo)

//----------------------------Environment--------------------------------------
router.post('/api/environment/detail', controllers.environment.getDataForEnvironment)
router.post('/api/environment/history', controllers.environment.queryIPGeoHistory)

//----------------------------search--------------------------------------
router.post('/api/search', controllers.system.search)

//----------------------------User--------------------------------------
// 用户注册
router.post('/api/user/register', controllers.user.register);
// 用户登录
router.post('/api/user/login', controllers.user.login);
// 用户登出
router.post('/api/user/logout', controllers.user.logout);
// 用户信息更新
router.post('/api/user/update', controllers.user.update);
// 获取用户信息
router.post('/api/user/info', controllers.user.userInfo);
// 获取用户列表
router.post('/api/user/list', controllers.user.getUserList);

//----------------------------help--------------------------------------
router.get('/help-doc', controllers.help.getHelpDoc);

module.exports = router






