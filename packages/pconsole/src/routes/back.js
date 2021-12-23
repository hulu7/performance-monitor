//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import {
    SYSTEM
} from '../config'
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

//----------------------------SYSTEM表--------------------------------------
router.post('/api/environment/detail', controllers.environment.getDataForEnvironment)

//----------------------------search--------------------------------------
router.post('/api/search', controllers.system.search)

//----------------------------help--------------------------------------
router.get('/help-doc', controllers.help.getHelpDoc);

module.exports = router






