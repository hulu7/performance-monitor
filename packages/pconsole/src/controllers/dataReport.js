import moment from 'moment';
import sql from 'node-transform-mysql';
import UAParser from 'ua-parser-js';
import url from 'url';
import querystring from 'querystring';
import {
    util,
    mysql
} from '../tool';
const imgsrc = 'console.log(0)';

class data {
    //初始化对象
    constructor() {};
    // 页面打cookie
    async setMarkCookies(ctx) {
        try {
            const cookies = ctx.cookie;
            let timestamp = new Date().getTime();
            let markUser,mark_page,IP;
            let maxAge = 864000000;  //cookie超时时间

            if(cookies && cookies.markUser){}else{
                // 第一次访问
                markUser = util.signwx({
                    mark:'markUser',
                    timestamp:timestamp,
                    random:util.randomString()
                }).paySign;
                ctx.cookies.set('markUser',markUser)
            }

            // 每次页面标识
            mark_page = util.signwx({
                mark:'mark_page',
                timestamp:timestamp,
                random:util.randomString()
            }).paySign;
            ctx.cookies.set('mark_page',mark_page)

            // 用户IP标识
            let userSystemInfo = {}
            // if(cookies && cookies.IP){}else{
            //     function getUserIpMsg(){
            //         return new Promise(function(resolve, reject) {
            //             let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
            //             userSystemInfo.ip = ip;
            //             axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`).then(function (response) {
            //                 resolve(response.data)
            //             }).catch(function (error) {
            //                 console.log(error)
            //                 resolve(null)
            //             });
            //         })
            //     }
            //     let datas = await getUserIpMsg();
            //     if(datas.code == 0) userSystemInfo = datas.data;
            //     IP = userSystemInfo.ip
            //     // 设置页面cookie
            //     ctx.cookies.set('IP',userSystemInfo.ip,{maxAge:maxAge})
            //     ctx.cookies.set('isp',encodeURIComponent(userSystemInfo.isp),{maxAge:maxAge})
            //     ctx.cookies.set('country',encodeURIComponent(userSystemInfo.country),{maxAge:maxAge})
            //     ctx.cookies.set('region',encodeURIComponent(userSystemInfo.region),{maxAge:maxAge})
            //     ctx.cookies.set('city',encodeURIComponent(userSystemInfo.city),{maxAge:maxAge})
            // }
            
            // 获得markUser值
            if(!markUser&&cookies&&cookies.markUser){
                markUser = cookies.markUser
            }
            // 获得用户IP等信息
            if(!IP && cookies && cookies.IP){
                userSystemInfo.ip = decodeURIComponent(cookies.IP)
                userSystemInfo.isp = decodeURIComponent(cookies.isp)
                userSystemInfo.country = decodeURIComponent(cookies.country)
                userSystemInfo.region = decodeURIComponent(cookies.region)
                userSystemInfo.city = decodeURIComponent(cookies.city)
            }

            let script = `if(window.getCookies){
                getCookies({
                    mark_page:'${mark_page}',
                    mark_user:'${markUser}',
                    IP:'${userSystemInfo.ip}',
                    isp:'${userSystemInfo.isp}',
                    county:'${userSystemInfo.country}',
                    province:'${userSystemInfo.region}',
                    city:'${userSystemInfo.city}',
                });}`

            ctx.body=script

        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }
    }
    // 用户系统信息上报
    async getSystemPerformDatas(ctx) {
        try{
            //------------校验token是否存在-----------------------------------------------------   
            let appId = ctx.query.appId
            if(!appId){
                ctx.body=imgsrc;
                return; 
            }; 
            let sqlstr = sql
                .table('web_system')
                .field('is_use,id')
                .where({ app_id: appId })
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.is_use !== 0 || systemItem.isStatisiSystem!==0){
                ctx.body=imgsrc;
                return; 
            };

            // 获取userAgent
            let userAgent   = ctx.request.header['user-agent']

            // var address = require('address');
            // console.log(address.ip());   // '192.168.0.2'
            // console.log(address.ipv6()); // 'fe80::7aca:39ff:feb0:e67d'
            // address.mac(function (err, addr) {
            //   console.log(addr); // '78:ca:39:b0:e6:7d'
            // });

            // 检测用户UA相关信息
            let parser = new UAParser();
            parser.setUA(userAgent);
            let result = parser.getResult();

            // environment表数据
            let environment={
                systemId: systemItem.id,
                IP: ctx.query.IP||'',
                isp: ctx.query.isp||'',
                county: ctx.query.county||'',
                province: ctx.query.province||'',
                city: ctx.query.city||'',
                browser: result.browser.name||'',
                borwserVersion: result.browser.version||'',
                system: result.os.name||'',
                systemVersion: result.os.version||'',
                markUser: ctx.query.markUser||'',
                mark_page: ctx.query.markPage||'',
                url: decodeURIComponent(ctx.query.url)||'',
                create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
            }

            let sqlstr1 = sql
                .table('web_environment')
                .data(environment)
                .insert()
            let result1 = await mysql(sqlstr1);  

            ctx.body=imgsrc 
        }catch(err){
            ctx.body=imgsrc
        }
    }

    async getPagePerformance(ctx) {
        ctx.set('Access-Control-Allow-Origin','*');
        try {
            const dataInstance = new data();
            const resourceDatas = ctx.request.body || {};
            const { app_id } = resourceDatas;
            if(!app_id) {
                ctx.body=imgsrc;
                return;
            }; 
            let systems = await dataInstance.querySystems(app_id);
            if(!systems || !systems.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systems[0]
            if(systemItem.is_use !== 0){
                ctx.body=imgsrc;
                return;
            };
            console.log('---start store performance data--');
            let createTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
            //----------------------------------------存储页面page性能----------------------------------------
            await dataInstance.storePagePerformance(createTime, resourceDatas, systemItem);
            ctx.body=imgsrc;
            return;
        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }  
    }

    // 页面性能及其资源上报
    async getPageResources(ctx) {
        ctx.set('Access-Control-Allow-Origin','*');
        try{
            //------------校验token是否存在----------------------------------------------------- 
            let resourceDatas = ctx.request.body?JSON.parse(ctx.request.body):{}  
            let appId = resourceDatas.appId
            if(!appId){
                ctx.body=imgsrc;
                return; 
            }; 
            let sqlstr = sql
                .table('web_system')
                .field('is_use,id,slow_page_time,isStatisiPages,slow_js_time,slow_css_time,slow_img_time,isStatisiAjax,isStatisiResource')
                .where({ app_id:appId })
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.is_use !== 0){
                ctx.body=imgsrc;
                return; 
            };
            
            let createTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');

            //----------------------------------------存储页面page性能----------------------------------------
            if(systemItem.isStatisiPages === 0) {
                let pageTimes = resourceDatas.pageTimes || {}
                let datas={
                    load_time: pageTimes.loadTime,
                    dns_time: pageTimes.dnsTime,
                    tcp_time: pageTimes.tcpTime,
                    dom_time: pageTimes.domTime,
                    white_time: pageTimes.whiteTime,
                    redirect_time: pageTimes.redirectTime,
                    unload_time: pageTimes.unloadTime,
                    request_time: pageTimes.requestTime,
                    analysis_dom_time: pageTimes.analysisDomTime,
                    ready_time: pageTimes.readyTime,
                    resourceTime: pageTimes.resourceTime,
                    preUrl: pageTimes.preUrl,
                    url: decodeURIComponent(resourceDatas.url),
                    markUser: resourceDatas.markUser,
                    mark_page: resourceDatas.markPage,
                    create_time: createTime,
                    systemId: systemItem.id
                }

                let table = 'web_pages';
                // 判断是否存入慢表
                if((pageTimes.loadTime+pageTimes.resourceTime) >= systemItem.slow_page_time*1000) table = 'web_slowpages';

                const sqlstr1 = sql
                    .table(table)
                    .data(datas)
                    .insert()
                await mysql(sqlstr1);  
            }

            //----------------------------------------存储页面资源性能----------------------------------------

            let datas = {
                systemId:systemItem.id,
                mark_page:resourceDatas.markPage,
                markUser:resourceDatas.markUser,
                callUrl:decodeURIComponent(resourceDatas.url),
                create_time:createTime,
            }
            resourceDatas.list.forEach(async item=>{
                let duration = 0;
                let table = ''
                let items = JSON.parse(JSON.stringify(datas));
                items.name=item.name
                items.duration=item.duration
                items.decodedBodySize=item.decodedBodySize
                items.method = item.method

                if(item.type === 'script'){
                    duration = systemItem.slow_js_time
                }else if(item.type === 'link'||item.type === 'css'){
                    duration = systemItem.slow_css_time
                }else if(item.type === 'xmlhttprequest'){
                    let newurl      = url.parse(item.name)
                    let newName     = newurl.protocol+'//'+newurl.host+newurl.pathname
                    let querydata   = newurl.query?querystring.parse(newurl.query):{}

                    items.querydata = JSON.stringify(querydata)
                    items.name      = newName
                    item.querydata  = querydata
                    item.name       = newName

                    duration = systemItem.slowAajxTime
                    table = 'web_ajax' 

                }else if(item.type === 'img'){
                    duration = systemItem.slow_img_time
                }
                if(parseInt(item.duration) >= duration*1000){
                    table = 'web_slowresources'
                }


                // 判断是否存储 ajax 和 慢资源
                if(table&&table==='web_ajax'&&systemItem.isStatisiAjax===0){
                    let sqlstr2 = sql.table(table).data(items).insert()
                    await mysql(sqlstr2)
                }else if(table&&table==='web_slowresources'&&systemItem.isStatisiResource===0){
                    let sqlstr2 = sql.table(table).data(items).insert()
                    await mysql(sqlstr2)
                }
            })

            // 存储页面所有资源
            if(systemItem.isStatisiResource !== 0){
                ctx.body=imgsrc;
                return;
            };

            datas.resourceDatas = JSON.stringify(resourceDatas.list)
            let sqlstr3 = sql.table('web_sources').data(datas).insert()
            await mysql(sqlstr3)

            ctx.body=imgsrc;
            return;
        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }  
    }
    // 页面错误上报收集
    async getErrorMsg(ctx) {
        ctx.set('Access-Control-Allow-Origin','*');
        try{
            //------------校验token是否存在----------------------------------------------------- 
            let resourceDatas = ctx.request.body?JSON.parse(ctx.request.body):{}  
            let appId = resourceDatas.appId
            let reportDataList = resourceDatas.reportDataList
            if(!reportDataList.length) return;
            if(!appId){
                ctx.body=imgsrc;
                return; 
            }; 
            let sqlstr = sql
                .table('web_system')
                .field('is_use,id')
                .where({ app_id: appId })
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.is_use !== 0){
                ctx.body=imgsrc;
                return; 
            };

            if(systemItem.isStatisiError === 0){
                reportDataList.forEach(async item=>{
                    let newurl      = url.parse(item.data.resourceUrl)
                    let newName     = ''
                    if(newurl.protocol) newName=newurl.protocol+'//'
                    if(newurl.host) newName=newName+newurl.host
                    if(newurl.pathname) newName=newName+newurl.pathname
                    let querydata   = newurl.query?querystring.parse(newurl.query):{}

                    let datas={
                        useragent:item.a||'',
                        msg:item.msg||'',
                        category:item.data.category||'',
                        pageUrl:item.data.pageUrl||'',
                        resourceUrl:newName,
                        querydata:JSON.stringify(querydata),
                        target:item.data.target||'',
                        type:item.data.type||'',
                        status:item.data.status||'',
                        text:item.data.text||'',
                        col:item.data.col||'',
                        line:item.data.line||'',
                        method:item.method,
                        fullurl:item.data.resourceUrl,
                        create_time:moment(new Date(item.t)).format('YYYY-MM-DD HH:mm:ss'),
                        systemId:systemItem.id
                    }

                    console.log(datas)

                    let sqlstr1 = sql
                        .table('web_error')
                        .data(datas)
                        .insert()
                    let result1 = await mysql(sqlstr1);  
                })
            }

            ctx.body=imgsrc
        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }  
    }

    async querySystems(appId) {
        let sqlstr = sql
        .table('web_system')
        .field('id,'+ 
               'system_domain,'+
               'system_name,'+
               'sub_systems,'+
               'script,'+
               'is_use,'+
               'create_time,'+
               'slow_page_time,'+
               'slow_js_time,'+
               'slow_css_time,'+
               'slow_img_time,'+
               'slow_ajax_time,'+
               'app_id,'+
               'is_monitor_pages,'+
               'is_monitor_ajax,'+
               'is_monitor_resource,'+
               'is_monitor_system')
        .where({ app_id: appId })
        .select()
        return mysql(sqlstr);
    }
    
    async storePagePerformance(createTime, resourceDatas, systemItem) {
        if(systemItem.is_monitor_pages === 0){
            const {
                mob, c, rt, vis, ua, dom, mem, scr, cpu, http, pt,
                nocookie,
                restiming,
                app,
                appin,
                u: url, 
                v: boomerang_version, 
                sm: boomerang_snippet_method, 
                pid: pageMark,
                n: beacon_number,
                t_resp: back_time,
                t_page: front_time, 
                t_done: perceived_load_time,
                t_other: additional_timers,
                nt_nav_st: navigation_start,
                nt_fet_st: fetch_start,
                nt_dns_st: domain_lookup_start,
                nt_dns_end: domain_lookup_end,
                nt_con_st: connect_start,
                nt_con_end: connect_end,
                nt_req_st: request_start,
                nt_res_st: response_start,
                nt_res_end: response_end,
                nt_domloading: dom_loading,
                nt_domint: dom_interactive,
                nt_domcontloaded_st: dom_content_loaded_event_start,
                nt_domcontloaded_end: dom_content_loaded_event_end,
                nt_domcomp: dom_complete,
                nt_load_st: load_event_start,
                nt_load_end: load_event_end,
                nt_unload_st: unload_event_start,
                nt_unload_end: unload_event_end,
                nt_dns: dns_time,
                nt_tcp: tcp_time,
                nt_white: white_time,
                nt_dom: dom_time,
                nt_load: load_time,
                nt_ready: ready_time,
                nt_redirect: redirect_time,
                nt_unload: unload_time,
                nt_request: request_time,
                nt_analysisdom: analysis_dom_time,
                nt_dec_size: body_size,
                nt_enc_size: encoded_body_size,
                nt_nav_type: navigation_type,
                nt_protocol: next_hop_protocol,
                nt_red_cnt: redirect_count,
                nt_trn_size: transfer_size,
            } = resourceDatas;
    
            const {
                etype: effective_type,
                dl: downlink,
                rtt: round_trip_time
            } = mob ? mob : {};
    
            const {
                e: continuity_epoch,
                lb: continuity_last_beacon,
                tti
            } = c ? c : {};
            const {
                m: time_to_interactive_method,
                vr: visually_ready_time
            } = tti ? tti : {};
            const {
                start: trigger_method,
                si: session_id,
                ss: session_start,
                sl: session_length,
                bmr: boomer_time,
                tstart: trigger_start,
                bstart: boomerang_start_time,
                end: boomerang_end_time,
                tt: sum_load_times,
                obo: no_load_pages_number
            } = rt ? rt : {};
            const {
                plt: system,
                vnd: browser
            } = ua ? ua : {};
            const {
                doms: unique_domains_number,
                ln: doms_number,
                sz: html_size,
                ck: cookies_size,
                img: img_number,
                script,
                iframe: iframe_number,
                link,
                res: resources_fetch_number
            } = dom ? dom : {};
            const [link_number, css] = link ? link : [];
            const { css: css_number } = css ? css : {};
            const [script_number, ext] = script ? script : [];
            const { ext: external_script_number } = ext ? ext : {};
            const { st: page_visibility } = vis ? vis : {};
            const {
                total: total_js_heap_size,
                limit: js_heap_size_limit,
                used: used_js_heap_size,
                lsln: used_local_storage_keys,
                ssln: used_session_storage_keys,
                lssz: used_local_storage_size,
                sssz: used_session_storage_size
            } = mem ? mem : {};
            const {
                xy: screen_size,
                bpp: screen_color_depth,
                orn: screen_orientation
            } = scr ? scr : {};
            const {
                cnc: cpu_concurrency
            } = cpu ? cpu : {};
            const {
                initiator
            } = http ? http : {};
            const {
                fp: first_paint,
                fcp: first_contentful_paint
            } = pt ? pt : {};
            const decodedUrl = decodeURIComponent(url || '');
            const page_id = util.getPageId(decodedUrl);
            const web_pages_basic_data = {
                page_id,
                url: decodedUrl || '',
                system_id: systemItem.id,
                create_time: createTime || '',
                mark_page: pageMark || '',
                app: app || ''
            };
    
            const storePagesBasicSqlStr = sql
                .table('web_pages_basic')
                .data(web_pages_basic_data)
                .insert();
            const operationResult = await mysql(storePagesBasicSqlStr);
            const { insertId: monitor_id } = operationResult;
            const web_pages_timing_data = {
                monitor_id,
                page_id,
                url: decodedUrl || '',
                load_time: load_time || '0',
                white_time: white_time || '0',
                first_paint: first_paint || '0',
                first_contentful_paint: first_contentful_paint || '0',
                visually_ready_time: visually_ready_time || '0',
                perceived_load_time: perceived_load_time || '0',
                dom_time: dom_time || '0',
                analysis_dom_time: analysis_dom_time || '0',
                dns_time: dns_time || '0',
                tcp_time: tcp_time || '0',
                redirect_time: redirect_time || '0',
                unload_time: unload_time || '0',
                request_time: request_time || '0',
                ready_time: ready_time || '0',
                boomerang_start_time: boomerang_start_time || '',
                boomerang_end_time: boomerang_end_time || '',
                no_load_pages_number: no_load_pages_number || '0',
                session_id: session_id || '',
                session_length: session_length || '0',
                session_start: session_start || '0',
                sum_load_times: sum_load_times || '0',
                additional_timers: additional_timers || '',
                front_time: front_time || '0',
                back_time: back_time || '0'
            };
    
            const web_pages_restiming_data = {
                monitor_id,
                restiming: util.compress(restiming) || ''
            };

            const web_pages_navigation_data = {
                monitor_id,
                connect_end: connect_end || '0',
                connect_start: connect_start || '0',
                domain_lookup_end: domain_lookup_end || '0',
                domain_lookup_start: domain_lookup_start || '0',
                dom_complete: dom_complete || '0',
                dom_content_loaded_event_end: dom_content_loaded_event_end || '0',
                dom_content_loaded_event_start: dom_content_loaded_event_start || '0',
                dom_interactive: dom_interactive || '0',
                dom_loading: dom_loading || '0',
                fetch_start: fetch_start || '0',
                load_event_end: load_event_end || '0',
                load_event_start: load_event_start || '0',
                navigation_start: navigation_start || '0',
                request_start: request_start || '0',
                response_end: response_end || '0',
                response_start: response_start || '0',
                unload_event_end: unload_event_end || '0',
                unload_event_start: unload_event_start || '0'
            };
    
            const web_pages_resources_data = {
                monitor_id,
                page_id,
                url: decodedUrl || '',
                body_size: body_size || '0',
                encoded_body_size: encoded_body_size || '0',
                redirect_count: redirect_count || '0',
                transfer_size: transfer_size || '0',
                doms_number: doms_number || '0',
                script_number: script_number || '0',
                external_script_number: external_script_number || '0',
                resources_fetch_number: resources_fetch_number || '0',
                html_size: html_size || '0',
                img_number: img_number || '0',
                link_number: link_number || '0',
                css_number: css_number || '0',
                iframe_number: iframe_number || '0',
                unique_domains_number: unique_domains_number || '0',
                cookies_size: cookies_size || '0',
                total_js_heap_size: total_js_heap_size || '0',
                js_heap_size_limit: js_heap_size_limit || '0',
                used_js_heap_size: used_js_heap_size || '0',
                used_local_storage_size: used_local_storage_size || '0',
                used_local_storage_keys: used_local_storage_keys || '0',
                used_session_storage_size: used_session_storage_size || '0',
                used_session_storage_keys: used_session_storage_keys || '0',
                nocookie: nocookie || '0'
            };
    
            const web_pages_client_data = {
                monitor_id,
                page_id,
                url: decodedUrl || '',
                appin: appin || '',
                navigation_type: navigation_type || '0',
                next_hop_protocol: next_hop_protocol || '',
                system: system || '',
                browser: browser || '',
                cpu_concurrency: cpu_concurrency || '0',
                screen_color_depth: screen_color_depth || '',
                screen_orientation: screen_orientation || '',
                screen_size: screen_size || '',
                http_initiator: initiator || '',
                effective_type: effective_type || '',
                downlink: downlink || '0',
                round_trip_time: round_trip_time || '0'
            };
    
            const web_pages_probe_data = {
                monitor_id,
                boomerang_snippet_method: boomerang_snippet_method || '',
                time_to_interactive_method: time_to_interactive_method || '',
                trigger_method: trigger_method || '',
                trigger_start: trigger_start || '0',
                boomer_time: boomer_time || '',
                continuity_epoch: continuity_epoch || '',
                continuity_last_beacon: continuity_last_beacon || '',
                beacon_number: beacon_number || '0',
                boomerang_version: boomerang_version || '',
                page_visibility: page_visibility || ''
            };

            const dataMap = {
                web_pages_timing_data,
                web_pages_restiming_data,
                web_pages_navigation_data,
                web_pages_resources_data,
                web_pages_client_data,
                web_pages_probe_data
            };

            const tables = [
                'web_pages_timing',
                'web_pages_restiming',
                'web_pages_navigation',
                'web_pages_resources',
                'web_pages_client',
                'web_pages_probe'
            ]

            const storePerformanceData = tables.map(table => {
                    const sqlStr = sql
                        .table(table)
                        .data(dataMap[`${table}_data`])
                        .insert();
                    return mysql(sqlStr);
                });
            return Promise.all(storePerformanceData);
        }
    }    
}

module.exports = new data();
