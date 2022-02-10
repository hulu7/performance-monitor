// 系统配置
export const SYSTEM = {

	//允许调用接口的域名，用来检测防盗链
	ORIGIN: 'http://127.0.0.1:18088',

	PRODORIGIN: 'local.dev.jdcloud.com',

	// 单点登录入口
	SSODOMAIN: 'http://test.ssa.jd.com',

	// 单点登录appKey
	APPKEY: 'test3',

	// 单点登录appToken
	APPTOKEN: '347c6161e79f4b6a8873202dd5fe7e8f',

	// HTTP服务器端口号
	PROT: 18088,

	// 分页条数
	PAGESIZE: 50,

	DEBUG: false,

	PROTOCOL: 'http'
}

export const DB = {
	// 服务器地址
	HOST: 'localhost',

	// 数据库端口号     
	PROT: 3306,

	// 数据库用户名              
	USER: 'root',

	// 数据库密码    
	PASSWORD: '123456',

	// 数据库名称    
	DATABASE: 'web_performance',

	// 默认"api_"
	PREFIX: 'web_',

	// 是否等待链接
	WAITFORCONNECTIONS: true,

	// 连接池数量
	POOLLIMIT: 1000,

	// 排队限制数量
	QUEUELIMIT: 1000,
}

// 系统配置
export const RENDER = {
	system: {
		title: '前端性能监控系统'
	},

	add: {
		title: '新增应用'
	},

	apps: {
		title: '应用列表'
	},

	search: {
		title: '历史搜索'
	},

	appsOverview: {
		title: '应用概览'
	},

	appDetail: {
		title: '应用详情'
	},

	setting: {
		title: '系统设置',
	},

	help: {
		title: '帮助文档'
	},

	routers: [{
		name: 'system',
		paths: ['/']  //首页页面
	}, {
		name: 'addSystem',
		paths: ['/addSystem']  //新增应用
	}, {
		name: 'apps',
		paths: ['/apps'] //应用性能分析
	}, {
		name: 'search',
		paths: ['/search']  //搜索页面
	}, {
		name: 'appsOverview',
		paths: ['/app/overview'] // 应用概览
	}, {
		name: 'appDetail',
		paths: ['/app/detail'] // 应用详情
	}, {
		name: 'setting',
		paths: ['/setting'] // 系统设置
	}, {
		name: 'help',
		paths: ['/help'] // 帮助文档
	}]

}

// 运行时
export const RUN = {
	env: 'dev',
	dev: {
		boomerang: '//local.dev.jdcloud.com/js/boomerang/boomerang-1.0.0.min.js',
		history: '//local.dev.jdcloud.com/js/boomerang/history.min.js',
		reportApi: 'http://local.dev.jdcloud.com/reportPerformance',
		appid: 'ED0B3A18CDABE3E3CF22D5DE868E0CC2'
	},
	pre: {
		boomerang: '//performance-monitor-stag.jdcloud.com/js/boomerang/boomerang-1.0.0.min.js',
		history: '//performance-monitor-stag.jdcloud.com/js/boomerang/history.min.js',
		reportApi: 'http://performance-monitor-stag.jdcloud.com/reportPerformance',
		appid: '7BDED93854F1A5ABC4EE5344DDA57B84'
	},
	prd: {
		boomerang: '//performance-monitor.jdcloud.com/js/boomerang/boomerang-1.0.0.min.js',
		history: '//performance-monitor.jdcloud.com/js/boomerang/history.min.js',
		reportApi: 'https://performance-monitor.jdcloud.com/reportPerformance',
		appid: '65194598DE4C11ACAB5366B9E2DB0ECF'
	},
	links: [{
		src: '/images/common/favicon.ico',
		type: 'image/x-icon',
		rel: 'icon'
	}, {
		src: '/css/base.css',
		type: '',
		rel: 'stylesheet'
	}, {
		src: '/css/PopLayer.css',
		type: '',
		rel: 'stylesheet'
	}, {
		src: '/css/element-ui.css',
		type: '',
		rel: 'stylesheet'
	}],
	scripts: [
		'/js/polyfill.min.js',
		'/js/jquery.min.js',
		'/js/vue.min.js',
		'/js/echarts.min.js',
		'/js/element-ui.min.js',
		'/js/vue-filters.js',
		'/js/PopLayer.js',
		'/js/config.js',
		'/js/util.js',
		'/js/md5.js',
		'/js/http.js'
	]
}
