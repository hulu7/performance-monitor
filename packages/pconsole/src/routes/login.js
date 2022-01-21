import axios from 'axios'

module.exports = function () {
    return async function (ctx, next) {
        console.log('---login check--',)
        const url = ctx.request.url;
        const user = ctx.session.user;
        const token = ctx.query.token
        console.log('+++++ctx.request+++++', ctx.request)
        console.log('+++++next.request+++++', next)
        if (url === '/favicon.ico') {
            return
        }
        if (user) {//1、有自己的session，则直接通过
            console.log('-- session exists.')
            return await next()
        }
        if (token) {
            //2、没有session，有凭证，则去验证下
            console.log('-- No session and ticket exists.')
            //后端发送http请求
            let data = await axios.get(`http://login.jdcloud.com/`)
            console.log('-- verify result: ', data)
            data = JSON.parse(data)
            if (data.code === 0) {//验证通过
                let userId = data.userId
                if (userId) {
                    ctx.session.user = userId
                    console.log('-- login successfully, start to render.')
                    return await next()
                } else {
                    ctx.redirect(`http://login.jdcloud.com/?redirectUrl=http://${ctx.request.header.host}${ctx.request.url}`)
                }
            } else {//验证失败，重新去登录
                ctx.redirect(`http://login.jdcloud.com/?redirectUrl=http://${ctx.request.header.host}${ctx.request.url}`)
            }
            return
        }
        console.log('-- not login, go to login page.')
        //3、啥都没有，那就去登录吧
        ctx.redirect(`http://login.jdcloud.com/?redirectUrl=http://${ctx.request.header.host}${ctx.request.url}`)
    }
}