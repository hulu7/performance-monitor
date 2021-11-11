import moment from 'moment'
import sql from 'node-transform-mysql'
import SqlString from 'sqlstring'
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
                .order('create_time desc')
                .select();
            const result = await mysql(sqlstr);

            result.forEach(item => {
                const {
                    id,
                    system_domain: systemDomain,
                    system_name: systemName,
                    script,
                    is_use: isUse,
                    create_time: createTime,
                    slow_page_time: slowPageTime,
                    slow_js_time: slowJsTime,
                    slow_css_time: slowCssTime,
                    slow_img_time: slowImgTime,
                    slow_ajax_time: slowAjaxTime,
                    uuid,
                    is_monitor_pages: isMonitorPages,
                    is_monitor_ajax: isMonitorAjax,
                    is_monitor_resource: isMonitorResource,
                    is_monitor_system: isMonitorSystem
                } = item;
                valArr.push({
                    id, systemDomain, systemName, script,
                    isUse, createTime, slowPageTime, slowJsTime, slowCssTime, slowImgTime,
                    slowAjaxTime, uuid, isMonitorPages, isMonitorPages, isMonitorAjax, isMonitorResource,
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

    // 根据系统ID查应用
    async querySystemById(id) {
        let valjson = {};
        if (!id) {
            return valjson
        }
        // 获得列表
        const safeId = SqlString.escape(id)
        let sqlstr = sql
            .table('web_system')
            .where({ id: safeId })
            .select()
        sqlstr = util.formatSqlstr(sqlstr, safeId);
        const result = await mysql(sqlstr);
        if (result.length) {
            const {
                id,
                system_domain: systemDomain,
                system_name: systemName,
                script,
                is_use: isUse,
                create_time: createTime,
                slow_page_time: slowPageTime,
                slow_js_time: slowJsTime,
                slow_css_time: slowCssTime,
                slow_img_time: slowImgTime,
                slow_ajax_time: slowAjaxTime,
                uuid,
                is_monitor_pages: isMonitorPages,
                is_monitor_ajax: isMonitorAjax,
                is_monitor_resource: isMonitorResource,
                is_monitor_system: isMonitorSystem
            } = result[0];
            Object.assign(valjson, { id, systemDomain, systemName, script,
                isUse, createTime, slowPageTime, slowJsTime, slowCssTime, slowImgTime,
                slowAjaxTime, uuid, isMonitorPages, isMonitorPages, isMonitorAjax, isMonitorResource,
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
                system_name,
                system_domain,
                slow_page_time,
                slow_js_time,
                slow_css_time,
                slow_img_time,
            } = ctx.request.body;
            const create_time = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
            const safeSystemName = SqlString.escape(system_name);
            const safeSystemDomain = SqlString.escape(system_domain);
            const safeSlowPageTime = SqlString.escape(slow_page_time);
            const safeSlowJsTime = SqlString.escape(slow_js_time);
            const safeSlowCssTime = SqlString.escape(slow_css_time);
            const safeSlowImgTime = SqlString.escape(slow_img_time);

            if(!safeSystemName || !safeSystemDomain){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }
            // 判断应用是否存在
            let sqlstr1 = sql
                .table('web_system')
                .where({ system_name: safeSystemName })
                .select()
            sqlstr1 = util.formatSqlstr(sqlstr1, safeSystemName);
            const systemNameMsg = await mysql(sqlstr1);
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
                .where({ system_domain: safeSystemDomain })
                .select()
            sqlstr2 = util.formatSqlstr(sqlstr2, safeSystemDomain);
            const systemDomainMsg = await mysql(sqlstr2);
            if(systemDomainMsg.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '此域名已存在!'
                });
                return
            }

            const timestamp = new Date().getTime();
            const token = util.signwx({
                system_name: safeSystemName,
                system_domain: safeSystemDomain,
                timestamp,
                random: util.randomString()
            }).paySign;
            const protocol = `http${SYSTEM.IS_HTTPS === 'TRUE' ? 's' : ''}`;
            const script =
                `<script src="${protocol}://${SYSTEM.PRODORIGIN}/js/boomerang/boomerang-1.0.0.min.js"><\/script>
                <script src="${protocol}://${SYSTEM.PRODORIGIN}/js/boomerang/history.min.js"><\/script>
                <script>
                    BOOMR.init({
                        beacon_url: "${protocol}://${SYSTEM.PRODORIGIN}/reportPerformance",
                        uuid:"${token}",
                        autorun: false,
                        History: {
                            enabled: true,
                            auto: true,
                            monitorReplaceState: true
                        },
                        apps_map_callback: window.apps_map_callback,
                        additional_info_callback: window.additional_info_callback,
                        get_user_id_callback: window.get_user_id_callback
                    });
                </script>`;

            // 插入数据
            const data = {
                system_name: safeSystemName,
                system_domain: safeSystemDomain,
                script,
                uuid: token,
                create_time
            }

            if(safeSlowPageTime) data.slow_page_time = safeSlowPageTime;
            if(safeSlowJsTime) data.slow_js_time = safeSlowJsTime;
            if(safeSlowCssTime) data.slow_css_time = safeSlowCssTime;
            if(safeSlowImgTime) data.slow_img_time = safeSlowImgTime;
            
            const sqlstr3 = sql
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
            const id    = SqlString.escape(ctx.request.body.systemId);
            const key   = SqlString.escape(ctx.request.body.key);
            const value = SqlString.escape(ctx.request.body.value);

            let data = {};
            data[key] = value;

            let sqlstr = sql
                .table('web_system')
                .data(data)
                .where({ id })
                .update();
            sqlstr = util.formatSqlstr(sqlstr, id);
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
                system_name,
                system_domain,
                slow_page_time,
                slow_js_time,
                slow_css_time,
                slow_img_time,
                slow_ajax_time,
                is_use,
                uuid
            } = ctx.request.body;

            const safeSystemName = SqlString.escape(system_name);
            const safeSystemDomain = SqlString.escape(system_domain);
            const safeSlowPageTime = SqlString.escape(slow_page_time);
            const safeSlowJsTime = SqlString.escape(slow_js_time);
            const safeSlowCssTime = SqlString.escape(slow_css_time);
            const safeSlowImgTime = SqlString.escape(slow_img_time);
            const safeSlowAjaxTime = SqlString.escape(slow_ajax_time);
            const safeId = SqlString.escape(id);
            const safeuuid = SqlString.escape(uuid);
            const safeIsUse = SqlString.escape(isUse);

            if(!safeSystemDomain || !safeSystemName){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            const protocol = `http${SYSTEM.IS_HTTPS === 'TRUE' ? 's' : ''}`;
            const script =
                `<script src="${protocol}://${SYSTEM.PRODORIGIN}/js/boomerang/boomerang-1.0.0.min.js"><\/script>
                <script src="${protocol}://${SYSTEM.PRODORIGIN}/js/boomerang/history.min.js"><\/script>
                <script>
                    BOOMR.init({
                        beacon_url: "${protocol}://${SYSTEM.PRODORIGIN}/reportPerformance",
                        uuid:${safeuuid},
                        autorun: false,
                        History: {
                            enabled: true,
                            auto: true,
                            monitorReplaceState: true
                        },
                        apps_map_callback: window.apps_map_callback,
                        additional_info_callback: window.additional_info_callback,
                        get_user_id_callback: window.get_user_id_callback
                    });
                </script>`;
            let sqlstr = sql
                .table('web_system')
                .data({
                    system_name: safeSystemName,
                    system_domain: safeSystemDomain,
                    slow_page_time: safeSlowPageTime,
                    slow_js_time: safeSlowJsTime,
                    slow_css_time: safeSlowCssTime,
                    slow_img_time: safeSlowImgTime,
                    slow_ajax_time: safeSlowAjaxTime,
                    is_use: safeIsUse,
                    uuid: safeuuid,
                    script
                })
                .where({ id: safeId })
                .update()
            sqlstr = util.formatSqlstr(sqlstr, safeSystemName);
            sqlstr = util.formatSqlstr(sqlstr, safeSystemDomain);
            sqlstr = util.formatSqlstr(sqlstr, safeSlowPageTime);
            sqlstr = util.formatSqlstr(sqlstr, safeSlowJsTime);
            sqlstr = util.formatSqlstr(sqlstr, safeSlowCssTime);
            sqlstr = util.formatSqlstr(sqlstr, safeSlowImgTime);
            sqlstr = util.formatSqlstr(sqlstr, safeSlowAjaxTime);
            sqlstr = util.formatSqlstr(sqlstr, safeIsUse);
            sqlstr = util.formatSqlstr(sqlstr, safeuuid);
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
        return
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

