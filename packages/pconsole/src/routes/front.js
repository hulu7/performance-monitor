//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import fs from 'fs'
import path from 'path'
const router = new KoaRouter()

// 请求接口校验中间件
const checkfn = controllers.common.checkRequestUrl;

/*-------------------------------------首页相关-----------------------------------------------*/

/*首页页面*/
router.get(['/'], async(ctx, next) => {
	let datas = {
		title:'前端性能分析',
	}

	await ctx.render('system',{
		datas
	}); 
});

//新增应用
router.get(['/addSystem'], async(ctx, next) => {
	let datas = {
		title:'新增应用',
	}

	await ctx.render('addSystem',{
		datas
	}); 
});

//应用性能分析
router.get(['/apps'], async(ctx, next) => {
	let datas = {
		title:'前端性能分析',
	}
	await ctx.render('apps',{
		datas
	}); 
});

//搜索页面
router.get(['/search'], async(ctx, next) => {
	let datas = {
		title: '历史搜索',
	}
	await ctx.render('search',{
		datas
	}); 
});

// 应用概览
router.get(['/app/overview'], async(ctx, next) => {
	let datas = {
		title:'应用概览',
	}
	await ctx.render('appsOverview',{
		datas
	}); 
});

router.get(['/app/detail'], async(ctx, next) => {
	let datas = {
		title:'应用详情',
	}
	await ctx.render('appDetail',{
		datas
	}); 
});

// 系统设置
router.get(['/setting'], async(ctx, next) => {
	let datas = {
		title:'系统设置',
	}
	await ctx.render('setting',{
		datas
	}); 
});

// httptest
router.get(['/httptest'], async(ctx, next) => {
	let datas = {
		title:'HTTP测试分析',
	}
	await ctx.render('httptest',{
		datas
	}); 
});

//帮助文档页面
router.get(['/help'], async(ctx, next) => {
	let datas = {
		title:'帮助文档',
	}
	await ctx.render('help',{
		datas
	}); 
});

/*-------------------------------------其他相关处理-----------------------------------------------*/
router.get(['/.well-known/pki-validation/fileauth.txt'], async(ctx, next) => {
	let string = fs.readFileSync(path.resolve(__dirname, '../assets/other/fileauth.txt')).toString()
	ctx.body=string
})

module.exports = router






