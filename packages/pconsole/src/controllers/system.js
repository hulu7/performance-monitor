import { Client } from 'elasticsearch'
import {
    SYSTEM
} from '../config'
import {
    util,
} from '../tool'
import SystemService from '../services/systemService'

class System {
    //初始化对象
    constructor() {};

    // 查询应用list
    async getSystemList(ctx){
        try {
            let valArr = [];
            const resps = await SystemService.getAllSystems()
            resps.forEach(item => {
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
                } = item.dataValues;
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

    // 根据系统ID查询系统详情
    async getItemSystem(ctx){
        try {
            const { systemId } = ctx.request.body;
            let data = {};
            if (!systemId) {
                ctx.body = util.result({
                    data
                });
                return 
            }
            const resps = await SystemService.getSystemById(systemId);
            if (resps.length) {
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
                } = resps[0].dataValues;
                Object.assign(data, { id, systemDomain, systemName, script,
                    isUse, createTime, slowPageTime, slowJsTime, slowCssTime, slowImgTime,
                    slowAjaxTime, uuid, isMonitorPages, isMonitorPages, isMonitorAjax, isMonitorResource,
                    isMonitorSystem
                });
            }
            ctx.body = util.result({
                data
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
                slowPageTime,
                slowJsTime,
                slowCssTime,
                slowImgTime,
            } = ctx.request.body;
            if(!system_name || !system_domain) {
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }
            const create_time = new Date(new Date().getTime()).toISOString();

            // 判断应用是否存在
            const systemNameResps = await SystemService.getSystemByName(system_name);
            if(systemNameResps.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '应用名称已存在!'
                });
                return
            }

            // 判断域名是否存在
            const systemDomainResps = await SystemService.getSystemByDomain(system_domain);
            if(systemDomainResps.length) {
                ctx.body = util.result({
                    code: 1001,
                    desc: '此域名已存在!'
                });
                return
            }

            const timestamp = new Date().getTime();
            const token = util.signwx({
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
                        beacon_url: "${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}/reportPerformance",
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
                system_name,
                system_domain,
                script,
                uuid: token,
                create_time
            }

            if(slowPageTime) data.slow_page_time = slowPageTime;
            if(slowJsTime) data.slow_js_time = slowJsTime;
            if(slowCssTime) data.slow_css_time = slowCssTime;
            if(slowImgTime) data.slow_img_time = slowImgTime;
    
            await SystemService.createSystem(data);

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
            const { systemId: id, key, value } = ctx.request.body

            let data = {};
            if (key === 'isUse') {
                data['is_use'] = value;
            }
            if (!key || !value || !id) {
                throw new Error(`Invalid parameter: id: ${id}, key: ${key}, value: ${value}`);
            }
            const result = await SystemService.updateSystem(id, data);

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
                slowAjaxTime: slow_ajax_time,
                isUse: is_use,
                uuid
            } = ctx.request.body;

            if(!system_domain || !system_name || !id){
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
                        beacon_url: "${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}/reportPerformance",
                        uuid:"${uuid}",
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
            const data = {
                system_name,
                system_domain,
                slow_page_time,
                slow_js_time,
                slow_css_time,
                slow_img_time,
                slow_ajax_time,
                is_use,
                uuid,
                script
            };
            await SystemService.updateSystem(id, data);

            ctx.body = util.result({
                code: 200,
                desc: '更新成功!'
            });
        } catch (err) {
            console.error(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
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

module.exports = new System();

