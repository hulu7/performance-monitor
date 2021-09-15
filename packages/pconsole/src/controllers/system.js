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
            let valArr = [];
            const sqlstr = sql
                .table('web_system')
                .select();
            const result = await mysql(sqlstr);

            result.forEach(item => {
                const {
                    id,
                    system_domain: systemDomain,
                    system_name: systemName,
                    sub_systems: subSystems,
                    script,
                    is_use: isUse,
                    create_time: createTime,
                    slow_page_time: slowPageTime,
                    slow_js_time: slowJsTime,
                    slow_css_time: slowCssTime,
                    slow_img_time: slowImgTime,
                    slow_ajax_time: slowAjaxTime,
                    app_id: appId,
                    is_monitor_pages: isMonitorPages,
                    is_monitor_ajax: isMonitorAjax,
                    is_monitor_resource: isMonitorResource,
                    is_monitor_system: isMonitorSystem
                } = item;
                valArr.push({
                    id, systemDomain, systemName, subSystems, script,
                    isUse, createTime, slowPageTime, slowJsTime, slowCssTime, slowImgTime,
                    slowAjaxTime, appId, isMonitorPages, isMonitorPages, isMonitorAjax, isMonitorResource,
                    isMonitorSystem
                });
            })

            ctx.body = util.result({
                data: valArr
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

    // 页面主应用流水线
    async querySystemById(id) {
        let valjson = {};
        if (!id) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_system')
            .where({ id })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                id,
                system_domain: systemDomain,
                system_name: systemName,
                sub_systems: subSystems,
                script,
                is_use: isUse,
                create_time: createTime,
                slow_page_time: slowPageTime,
                slow_js_time: slowJsTime,
                slow_css_time: slowCssTime,
                slow_img_time: slowImgTime,
                slow_ajax_time: slowAjaxTime,
                app_id: appId,
                is_monitor_pages: isMonitorPages,
                is_monitor_ajax: isMonitorAjax,
                is_monitor_resource: isMonitorResource,
                is_monitor_system: isMonitorSystem
            } = result[0];
            Object.assign(valjson, { id, systemDomain, systemName, subSystems, script,
                isUse, createTime, slowPageTime, slowJsTime, slowCssTime, slowImgTime,
                slowAjaxTime, appId, isMonitorPages, isMonitorPages, isMonitorAjax, isMonitorResource,
                isMonitorSystem
            });
        }
        return valjson;
    }

    //查询某个应用
    async getItemSystem(ctx){
        try {
            const { systemId } = ctx.request.body;
            const instance = new user()
            const result = await instance.querySystemById(systemId)
            ctx.body = util.result({
                data: result
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
            const {
                systemName: system_name,
                systemDomain: system_domain,
                slowPageTime: slow_page_time,
                slowJsTime: slow_js_time,
                slowCssTime: slow_css_time,
                slowImgTime: slow_img_time,
                subSystems: sub_systems
            } = ctx.request.body;
            const create_time = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
            
            if(!system_name || !system_domain){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            // 判断应用是否存在
            let sqlstr1 = sql
                .table('web_system')
                .where({ system_name })
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
                .where({ system_domain })
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
                system_name,
                system_domain,
                timestamp,
                random: util.randomString()
            }).paySign;
            const script =
                `<script src="//${SYSTEM.PRODORIGIN}/js/boomerang/boomerang-1.0.0.min.js"><\/script>
                <script src="//${SYSTEM.PRODORIGIN}/js/boomerang/history.min.js"><\/script>
                <script>
                    BOOMR.init({
                        beacon_url: "http${SYSTEM.IS_HTTPS === 'TRUE' ? 's' : ''}://${SYSTEM.PRODORIGIN}/reportPerformance",
                        app_id:"${token}",
                        autorun: false,
                        History: {
                            enabled: true,
                            auto: true,
                            monitorReplaceState: true
                        },
                        routers: ${sub_systems},
                        restiming_map_callback: window.restiming_map_callback
                    });
                </script>`;

            // 插入数据
            const data = {
                system_name,
                system_domain,
                sub_systems,
                script,
                app_id: token,
                create_time
            }

            if(slow_page_time) data.slow_page_time = slow_page_time;
            if(slow_js_time) data.slow_js_time = slow_js_time;
            if(slow_css_time) data.slow_css_time = slow_css_time;
            if(slow_img_time) data.slow_img_time = slow_img_time;
            
            let sqlstr3 = sql
                .table('web_system')
                .data(data)
                .insert()
            await mysql(sqlstr3);

            ctx.body = util.result({
                data: {
                    script: script,
                    token: token
                }
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!',
                err
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
            const {
                id,
                systemName: system_name,
                systemDomain: system_domain,
                slowPageTime: slow_page_time,
                slowJsTime: slow_js_time,
                slowCssTime: slow_css_time,
                slowImgTime: slow_img_time,
                subSystems: sub_systems,
                slowAjaxTime: slow_ajax_time,
                isUse: is_use,
                appId: app_id
            } = ctx.request.body;

            if(!system_domain || !system_name){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            const script =
                `<script src="//${SYSTEM.PRODORIGIN}/js/boomerang/boomerang-1.0.0.min.js"><\/script>
                <script src="//${SYSTEM.PRODORIGIN}/js/boomerang/history.min.js"><\/script>
                <script>
                    BOOMR.init({
                        beacon_url: "http${SYSTEM.IS_HTTPS === 'TRUE' ? 's' : ''}://${SYSTEM.PRODORIGIN}/reportPerformance",
                        app_id:"${app_id}",
                        autorun: false,
                        History: {
                            enabled: true,
                            auto: true,
                            monitorReplaceState: true
                        },
                        routers: ${sub_systems},
                        restiming_map_callback: window.restiming_map_callback
                    });
                </script>`;
            const sqlstr = sql
                .table('web_system')
                .data({
                    system_name, system_domain, slow_page_time, slow_js_time, slow_css_time,
                    slow_img_time, sub_systems, slow_ajax_time, is_use, app_id, script
                })
                .where({ id })
                .update()

            const result = await mysql(sqlstr);

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
                host: 'dev.db.local:8081',
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

