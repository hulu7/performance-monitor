//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import {
    SYSTEM
} from '../config'
const router = new KoaRouter()

// 统计页面cookie打点标识
router.post('/reportPerformance', controllers.dataReport.reportPerformance);

// 统计页面cookie打点标识
router.get('/reportMark', controllers.dataReport.setMarkCookies);
// 页面poage|资源数据上报
router.post('/reportResource', controllers.dataReport.getPageResources);
// 用户系统上报
router.get('/reportSystem',controllers.dataReport.getSystemPerformDatas);
// 错误上报
router.post('/reportErrorMsg', controllers.dataReport.getErrorMsg)

// 注册用户信息
router.post('/api/user/userRegister', controllers.login.userRegister)
// 用户登录
router.post('/api/user/userLogin', controllers.login.userLogin)
// 退出登录
router.post('/api/user/loginOut', controllers.login.loginOut)

//----------------------------SYSTEMS--------------------------------------
// 新增应用
router.post('/api/system/addSystem', controllers.system.addSystem)
// 修改应用
router.post('/api/system/updateSystem', controllers.system.updateSystem)
// 请求某个应用详情
router.post('/api/system/getItemSystem', controllers.system.getItemSystem)
//获得系统列表
router.post('/api/system/getSystemList', controllers.system.getSystemList)
// 设置系统是否需要统计数据
router.post('/api/system/isStatisData', controllers.system.isStatisData)

//----------------------------Apps--------------------------------------
// 获得page列表
router.post('/api/apps/getAppsList', controllers.pages.getAppsList)
// 获得page概览
router.post('/api/apps/getAppAverage', controllers.pages.getAppAverage)
// 获得page详情性能信息
router.post('/api/apps/getPageItemDetail', controllers.pages.getPageItemDetail)
// 根据ID获得page详情性能信息
router.post('/api/apps/getPageItemForId', controllers.pages.getPageItemForId)

//----------------------------AJAX--------------------------------------
//获得ajax页面列表
router.post('/api/ajax/getajaxlist', controllers.ajax.getajaxlist)
// 根据url查询ajax列表
router.post('/api/ajax/getPageItemDetail', controllers.ajax.getAjaxMsgForUrl)
// 根据name字段查询ajax列表信息
router.post('/api/ajax/getAjaxListForName', controllers.ajax.getAjaxListForName)

//----------------------------慢页面--------------------------------------
// 获取慢页面加载列表
router.post('/api/slowpages/getSlowpagesList', controllers.slowpages.getSlowpagesList)
// 根据url参数获取慢加载页面
router.post('/api/slowpages/getSlowPageItem', controllers.slowpages.getSlowPageItem)
// 根据id获得慢页面详情
router.post('/api/slowpages/getslowPageItemForId', controllers.slowpages.getslowPageItemForId)


//----------------------------慢资源--------------------------------------
// 根据url参数获取慢资源加载
router.post('/api/slowresources/getSlowResourcesItem', controllers.slowresources.getSlowResourcesItem)
// 获得慢资源分类列表
router.post('/api/slowresources/getSlowresourcesList', controllers.slowresources.getSlowresourcesList)
// 根据name参数获取慢资源加载
router.post('/api/slowresources/getSlowResourcesForName', controllers.slowresources.getSlowResourcesForName)

//----------------------------页面资源--------------------------------------
// 根据markPage获得页面资源信息
router.post('/api/sources/getSourcesForMarkPage', controllers.sources.getSourcesForMarkPage)

//----------------------------SYSTEM表--------------------------------------
router.post('/api/environment/getDataForEnvironment', controllers.environment.getDataForEnvironment)

//----------------------------httptest--------------------------------------
// router.post('/api/httptest/getHttpResponseData', controllers.httptest.getHttpResponseData)

//----------------------------webpagetest--------------------------------------
router.post('/api/webpagetest/getWebHttpResponseData', controllers.webpagetest.getWebHttpResponseData)

//----------------------------search--------------------------------------
router.post('/api/search', controllers.system.search)

//----------------------------help--------------------------------------
router.get('/help-doc', controllers.help.getHelpDoc);

module.exports = router






