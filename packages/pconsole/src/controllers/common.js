import {
    util
} from '../tool'

class common {
    constructor() {}

    // 验证来源 && 验证签名
    async checkRequestUrl(ctx, next) {
        let verSource = util.verSource(ctx)
        let checkSigin = util.checkSiginHttp(ctx);
        if (verSource && checkSigin) {
            return next();
        } else {
            console.log('域名来源验证有误')
        }
    };

    // 验证来源 && 验证签名 && 验证是否登录
    async checkIsLogin(ctx, next){
        let verSource = util.verSource(ctx)
        let checkSigin = util.checkSiginHttp(ctx);
        let username = ctx.cookies.get('userName');
        let secretKey = ctx.cookies.get('token');

        if(!username || !secretKey){
            ctx.body = util.result({
                code: 1004,
                desc: "该用户未登录！"
            });
        }
        
        if(!secretKey){
            ctx.body = util.result({
                code: 1004,
                desc: "用户登录异常，请重新登录！"
            });
            return;
        }
      
        /*⬆️⬆️⬆️⬆通过了登录验证️⬆️⬆️⬆️⬆️⬆️⬆️*/
        if (verSource && checkSigin) {
            return next();
        } else {
            ctx.body = util.result({
                code: 1001,
                desc: "验证有误！"
            });
            console.log('域名来源验证有误')
            return;
        }
    }

    // 验证登录是否有systemId
    async checkHaveSystemId(ctx, next){
        console.log(ctx);
        const cookies   = ctx.cookie;
        let systemId    = cookies&&cookies.systemId||''

        if(!(systemId+'')){
            ctx.body = util.result({
                code: 1003,
                desc: "systemId不能为空！"
            });
            return;
        }

        return next();
    }
}

module.exports = new common();

