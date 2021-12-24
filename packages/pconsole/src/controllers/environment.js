import {
    util,
} from '../tool'
import EnvironmentService from '../services/environmentService'

class Environment {
    //初始化对象
    constructor() {
    };
    // 根据url查询浏览器分类情况
    async getDataForEnvironment(ctx){
        try {
            const { appId } = ctx.request.body;
            const type = ctx.request.body.type || 1

            if(!appId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'appId参数有误!'
                });
                return
            }

            if(!appId){
                ctx.body = util.result({
                    code: 1001,
                    desc: '环境类型有误!'
                });
                return
            }

            const param = {
                appId,
                type
            };

            const environmentResults = await EnvironmentService.getDataForEnvironment(param)

            const boomerangSnippetMethodMap = {
                i: 'iframe',
                if: 'preload',
                p: 'preload',
                s: 'src'
            };
            const httpInitiatorMap = {
                spa: '应用内跳转',
                spa_hard: '通过url访问'
            };
            if (type === 'boomerang_snippet_method') {
                environmentResults.forEach(item => {
                    item.boomerang_snippet_method = boomerangSnippetMethodMap[item.boomerang_snippet_method]
                });
            } else if (type === 'http_initiator') {
                environmentResults.forEach(item => {
                    item.http_initiator = httpInitiatorMap[item.http_initiator];
                });
            }

            ctx.body = util.result({
                data: environmentResults
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

module.exports = new Environment();
