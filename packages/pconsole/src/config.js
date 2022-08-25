// 系统配置
export const SYSTEM = {

	//允许调用接口的域名，用来检测防盗链
	ORIGIN: 'http://127.0.0.1:18088',

	PRODORIGIN: '166.111.130.99:15566',

	// 单点登录入口
	SSODOMAIN: '',

	// 单点登录appKey
	APPKEY: '',

	// 单点登录appToken
	APPTOKEN: '',

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
	login: {
		title: '登录'
	},

	user: {
		title: '用户管理'
	},

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
		name: 'login',
		paths: ['/login']  //登录页面
	},  {
		name: 'user',
		paths: ['/user']  //用户管理页面
	}, {
		name: 'add',
		paths: ['/add']  //新增应用
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
		boomerang: '//dev.ki3.org.cn/js/boomerang/boomerang-1.0.0.min.js',
		history: '//dev.ki3.org.cn/js/boomerang/history.min.js',
		reportApi: 'http://dev.ki3.org.cn/reportPerformance',
		appid: 'CCC840F35CD94965C8C4AD578150FA60'
	},
	pre: {
		boomerang: '//dev.ki3.org.cn/js/boomerang/boomerang-1.0.0.min.js',
		history: '//dev.ki3.org.cn/js/boomerang/history.min.js',
		reportApi: 'http://dev.ki3.org.cn/reportPerformance',
		appid: '7BDED93854F1A5ABC4EE5344DDA57B84'
	},
	prd: {
		boomerang: '//166.111.130.99:15566/js/boomerang/boomerang-1.0.0.min.js',
		history: '//166.111.130.99:15566/js/boomerang/history.min.js',
		reportApi: 'http://166.111.130.99:15566/reportPerformance',
		appid: 'B6775BDB4A88ADD7F743B42C55772AF2'
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
		'/js/md5.js'
	]
}
