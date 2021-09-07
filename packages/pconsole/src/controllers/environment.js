import sql from 'node-transform-mysql'
import {
    util,
    mysql,
} from '../tool'

class pages {
    //初始化对象
    constructor() {
    };
    // 根据url查询浏览器分类情况
    async getDataForEnvironment(ctx){
        try {
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let pageId         = ctx.request.body.pageId
            let type        = ctx.request.body.type || 1

            if(!pageId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'pageId参数有误!'
                });
                return
            }


            let field = `${type},count(1) as count`;
            let group = type;

            // 公共参数
            let data = { page_id: pageId };
            if(beginTime && endTime) {
                data.create_time = {
                    egt: beginTime,
                    elt: endTime
                };
            }
            // 请求列表数据
            let sqlstr = sql.field(field)
                .table('web_pages_client')
                .where(data)
                .group(group)
                .limit(0,6)
                .select();

            let result = await mysql(sqlstr);
            const boomerangSnippetMethodMap = {
                i: 'iframe',
                if: 'preload',
                p: 'preload',
                s: 'src'
            };
            const httpInitiatorMap = {
                cache: '页面缓存',
                spa: '应用内跳转',
                spa_hard: '通过url访问'
            };
            if (type === 'boomerangSnippetMethod') {
                result.forEach((item, index) => {
                    result[index].boomerangSnippetMethod = boomerangSnippetMethodMap[item.boomerang_snippet_method]
                });
            }
            if (type === 'httpInitiator') {
                result.forEach((item, index) => {
                    result[index].httpInitiator = httpInitiatorMap[item.http_initiator];
                });
            }
            ctx.body = util.result({
                data: result
            });
            console.log(result);
        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }
    // 根据markPage获取用户系统信息
    async getUserEnvironment(ctx){
        try {
            let markPage   = ctx.request.body.markPage

            if(!markPage){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'markPage参数有误!'
                });
                return
            }

            // 请求列表数据
            let sqlstr = sql
                .table('web_environment')
                .where({ markPage: markPage })
                .select()

            let result = await mysql(sqlstr);

            ctx.body = util.result({
                data: result && result.length ? result[0] : {}
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }

    
    
}

module.exports = new pages();

