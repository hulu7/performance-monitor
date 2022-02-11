//前端路由
import KoaRouter from 'koa-router'
import {
    RENDER,
	RUN
} from '../config.js'
const router = new KoaRouter()

RENDER.routers.forEach(route => {
	router.get(route.paths, async(ctx, next) => {
		await ctx.render(route.name, {
			render: RENDER[route.name],
			run: RUN
		})
	});
});

module.exports = router
