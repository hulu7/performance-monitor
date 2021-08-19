import moment from 'moment'
import sql from 'node-transform-mysql'
import { Client } from 'elasticsearch'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
} from '../tool'

class user {
    //初始化对象
    constructor() {};

    // 查询应用list
    async getSystemList(ctx){
        try {
            let sqlstr = sql
                .table('web_system')
                .select()
            let result = await mysql(sqlstr);

            ctx.body = util.result({
                data: result
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

    //查询某个应用
    async getItemSystem(ctx){
        try {
            const { systemId } = ctx.request.body;
            const sqlstr = sql
                .table('web_system')
                .where({ id: systemId })
                .select();

            const result = await mysql(sqlstr);
            ctx.body = util.result({
                data: result&&result.length?result[0]:{}
            });

        } catch (err) {
            console.error(err);
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }

    // 新增应用
    async addSystem(ctx){
        try {
            let systemName      = ctx.request.body.systemName;
            let systemDomain    = ctx.request.body.systemDomain;
            let slowPageTime    = ctx.request.body.slowPageTime;
            let slowJsTime      = ctx.request.body.slowJsTime;
            let slowCssTime     = ctx.request.body.slowCssTime;
            let slowImgTime     = ctx.request.body.slowImgTime;
            let subSystems      = ctx.request.body.subSystems;
            let createTime      = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
            
            if(!systemName || !systemDomain){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            // 判断应用是否存在
            let sqlstr1 = sql
                .table('web_system')
                .where({systemName})
                .select()
            let systemNameMsg = await mysql(sqlstr1);
            if(systemNameMsg.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '应用名称已存在!'
                });
                return
            }

            // 判断域名是否存在
            let sqlstr2 = sql
                .table('web_system')
                .where({systemDomain})
                .select()
            let systemDomainMsg = await mysql(sqlstr2);
            if(systemDomainMsg.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '此域名已存在!'
                });
                return
            }

            let timestamp = new Date().getTime();
            let token = util.signwx({
                systemName,
                systemDomain,
                timestamp,
                random:util.randomString()
            }).paySign;
            let script = `<script src="//${SYSTEM.PRODORIGIN}/js/boomerang/boomerang-1.0.0.min.js"><\/script><script src="//${SYSTEM.PRODORIGIN}/js/boomerang/history.min.js"><\/script><script >BOOMR.init({beacon_url: "http${SYSTEM.IS_HTTPS === 'TRUE' ? 's' : ''}://${SYSTEM.PRODORIGIN}/reportPerformance",AppId:"${token}",History: {enabled: true,auto: true,monitorReplaceState: true,},Routers: ${subSystems},});</script>`;

            // 插入数据
            let data={
                systemName,
                systemDomain,
                subSystems,
                script,
                appId: token,
                createTime
            }
            if(slowPageTime) data.slowPageTime = slowPageTime;
            if(slowJsTime) data.slowJsTime = slowJsTime;
            if(slowCssTime) data.slowCssTime = slowCssTime;
            if(slowImgTime) data.slowImgTime = slowImgTime;
            
            let sqlstr3 = sql
                .table('web_system')
                .data(data)
                .insert()
            let datas = await mysql(sqlstr3);

            ctx.body = util.result({
                data:{
                    script:script,
                    token:token
                }
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
    // 设置系统是否需要统计数据
    async isStatisData(ctx){
        try {
            const id    = ctx.request.body.systemId
            const key   = ctx.request.body.key
            const value = ctx.request.body.value

            let data = {};
            data[key] = value;

            const sqlstr = sql
                .table('web_system')
                .data(data)
                .where({ id })
                .update();

            const result = await mysql(sqlstr);

            ctx.body = util.result({
                data: result
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
    // 修改应用
    async updateSystem(ctx) {
        try {
            let id              = ctx.request.body.id
            let slowPageTime    = ctx.request.body.slowPageTime
            let slowJsTime      = ctx.request.body.slowJsTime
            let slowCssTime     = ctx.request.body.slowCssTime
            let slowImgTime     = ctx.request.body.slowImgTime
            let slowAajxTime    = ctx.request.body.slowAajxTime
            let systemDomain    = ctx.request.body.systemDomain
            let systemName      = ctx.request.body.systemName

            if(!systemDomain || !systemName){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            let sqlstr = sql
                .table('web_system')
                .data({
                    slowPageTime:slowPageTime,
                    slowJsTime:slowJsTime,
                    slowCssTime:slowCssTime,
                    slowImgTime:slowImgTime,
                    slowAajxTime:slowAajxTime,
                    systemDomain:systemDomain,
                    systemName:systemName,
                })
                .where({id:id})
                .update()

            let result = await mysql(sqlstr);

            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.error(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }

    async search(ctx) {
        const { keys, from, size } = ctx.request.body;
        try {
            const client = new Client({
                host: '10.0.2.15:8081',
                //将日志信息显示在控制台，默认level:"console"
                log: 'trace'
                //将日志信息写入文件中
                // log:{
                //     type:'file',
                //     level:"trace",
                //     path:"url"
                // }
                //设置不同等级输出到不同的地方
                // log:[
                //     {
                //         type:'console',
                //         level:"error",
                //     },
                //     {
                //         type:"file",
                //         level:"trace",
                //         path:"url"
                //     }
                // ]
            });
    
            const response = await client.search({
                    index: 'test_index',
                    body: {
                        query:{
                            match:{
                                url: keys
                            }
                        }
                    },
                    from,
                    size,
                    sort: ['createTime:desc'] //按createTime降序排序
                });
            let result = [];
            let total = 0;
            if (response && response.hits && response.hits.hits) {
                total = response.hits.total.value;
                result = response.hits.hits.map(hit => {
                    const {
                        id,
                        url,
                        bodySize,
                        analysisDomTime,
                        createTime,
                        dnsTime,
                        domTime,
                        loadTime,
                        readyTime,
                        redirectTime,
                        requestTime,
                        systemId,
                        tcpTime,
                        whiteTime,
                        visuallyReadyTime,
                        perceivedLoadTime,
                        sumLoadTimes } = hit._source;
                    return {
                        id,
                        url,
                        bodySize,
                        analysisDomTime,
                        createTime,
                        dnsTime,
                        domTime,
                        loadTime,
                        readyTime,
                        redirectTime,
                        requestTime,
                        systemId,
                        tcpTime,
                        whiteTime,
                        visuallyReadyTime,
                        perceivedLoadTime,
                        sumLoadTimes
                    };
                });
            }
            ctx.body = util.result({
                total,
                data: result
            });
        } catch (err) {
            console.error(err)
            ctx.body = util.result({
                code: 1002,
                desc: '搜索服务出错!'
            });
            return '';
        }
    }
}

module.exports = new user();

