import moment from 'moment';
import sql from 'node-transform-mysql';
import UAParser from 'ua-parser-js';
import url from 'url';
import md5 from 'md5';
import querystring from 'querystring';
import {
    util,
    mysql
} from '../tool';
const imgsrc = 'console.log(0)';
const querySystems = (appId) => {
    let sqlstr = sql
    .table('web_system')
    .field('id,'+ 
           'systemDomain,'+
           'systemName,'+
           'subSystems,'+
           'script,'+
           'isUse,'+
           'createTime,'+
           'slowPageTime,'+
           'slowJsTime,'+
           'slowCssTime,'+
           'slowImgTime,'+
           'slowAjaxTime,'+
           'appId,'+
           'isMonitorPages,'+
           'isMonitorAjax,'+
           'isMonitorResource,'+
           'isMonitorSystem')
    .where({appId})
    .select()
    return mysql(sqlstr);
}

const storePagePerformance = (createTime, resourceDatas, systemItem) => {
    if(systemItem.isMonitorPages === 0){
        const {
            mob, c, rt, vis, ua, dom, mem, scr, cpu, http, pt,
            nocookie,
            restiming,
            app,
            appin,
            u: url, 
            v: boomerangVersion, 
            sm: boomerangSnippetMethod, 
            pid: pageMark,
            n: beaconNumber,
            t_resp: backTime,
            t_page: frontTime, 
            t_done: perceivedLoadTime,
            t_other: additionalTimers,
            main_restiming: mainRestiming,
            nt_nav_st: navigationStart,
            nt_fet_st: fetchStart,
            nt_dns_st: domainLookupStart,
            nt_dns_end: domainLookupEnd,
            nt_con_st: connectStart,
            nt_con_end: connectEnd,
            nt_req_st: requestStart,
            nt_res_st: responseStart,
            nt_res_end: responseEnd,
            nt_domloading: domLoading,
            nt_domint: domInteractive,
            nt_domcontloaded_st: domContentLoadedEventStart,
            nt_domcontloaded_end: domContentLoadedEventEnd,
            nt_domcomp: domComplete,
            nt_load_st: loadEventStart,
            nt_load_end: loadEventEnd,
            nt_unload_st: unloadEventStart,
            nt_unload_end: unloadEventEnd,
            nt_dns: dnsTime,
            nt_tcp: tcpTime,
            nt_white: whiteTime,
            nt_dom: domTime,
            nt_load: loadTime,
            nt_ready: readyTime,
            nt_redirect: redirectTime,
            nt_unload: unloadTime,
            nt_request: requestTime,
            nt_analysisdom: analysisDomTime,
            nt_dec_size: bodySize,
            nt_enc_size: encodedBodySize,
            nt_nav_type: navigationType,
            nt_protocol: nextHopProtocol,
            nt_red_cnt: redirectCount,
            nt_trn_size: transferSize,
        } = resourceDatas;

        const {
            etype: effectiveType,
            dl: downlink,
            rtt: roundTripTime
        } = mob ? mob : {};

        const {
            e: continuityEpoch,
            lb: continuityLastBeacon,
            tti
        } = c ? c : {};
        const {
            m: timeToInteractiveMethod,
            vr: visuallyReadyTime
        } = tti ? tti : {};
        const {
            start: triggerMethod,
            si: sessionId,
            ss: sessionStart,
            sl: sessionLength,
            bmr: boomerTime,
            tstart: triggerStart,
            bstart: boomerangStartTime,
            end: boomerangEndTime,
            tt: sumLoadTimes,
            obo: noLoadPagesNumber
        } = rt ? rt : {};
        const {
            plt: system,
            vnd: browser
        } = ua ? ua : {};
        const {
            doms: uniqueDomainsNumber,
            ln: domsNumber,
            sz: htmlSize,
            ck: cookiesSize,
            img: imgNumber,
            script,
            iframe: iframeNumber,
            link,
            res: resourcesFetchNumber
        } = dom ? dom : {};
        const [linkNumber, css] = link ? link : [];
        const { css: cssNumber } = css ? css : {};
        const [scriptNumber, ext] = script ? script : [];
        const { ext: externalScriptNumber } = ext ? ext : {};
        const { st: pageVisibility } = vis ? vis : {};
        const {
            total: totalJSHeapSize,
            limit: jsHeapSizeLimit,
            used: usedJSHeapSize,
            lsln: usedLocalStorageKeys,
            ssln: usedSessionStorageKeys,
            lssz: usedLocalStorageSize,
            sssz: usedSessionStorageSize
        } = mem ? mem : {};
        const {
            xy: screenSize,
            bpp: screenColorDepth,
            orn: screenOrientation
        } = scr ? scr : {};
        const {
            cnc: cpuConcurrency
        } = cpu ? cpu : {};
        const {
            initiator
        } = http ? http : {};
        const {
            fp: firstPaint,
            fcp: firstContentfulPaint
        } = pt ? pt : {};
        const decodedUrl = decodeURIComponent(url) || '/';
        const pageId = md5(decodedUrl);

        const dat = {
            systemId: systemItem.id,
            createTime: createTime || null,
            url: decodedUrl || null,
            markPage: pageMark || null,
            loadTime: loadTime || '0',
            dnsTime: dnsTime || '0',
            tcpTime: tcpTime || '0',
            domTime: domTime || '0',
            whiteTime: whiteTime || '0',
            redirectTime: redirectTime || '0',
            unloadTime: unloadTime || '0',
            requestTime: requestTime || '0',
            analysisDomTime: analysisDomTime || '0',
            readyTime: readyTime || '0',
            connectEnd: connectEnd || '0',
            connectStart: connectStart || '0',
            bodySize: bodySize || '0',
            domainLookupStart: domainLookupStart || '0',
            domainLookupEnd: domainLookupEnd || '0',
            domComplete: domComplete || '0',
            domContentLoadedEventStart: domContentLoadedEventStart || '0',
            domContentLoadedEventEnd: domContentLoadedEventEnd || '0',
            domInteractive: domInteractive || '0',
            encodedBodySize: encodedBodySize || '0',
            fetchStart: fetchStart || '0',
            loadEventStart: loadEventStart || '0',
            loadEventEnd: loadEventEnd || '0',
            navigationStart: navigationStart || '0',
            navigationType: navigationType || '0',
            nextHopProtocol: nextHopProtocol || null,
            redirectCount: redirectCount || '0',
            requestStart: requestStart || '0',
            responseEnd: responseEnd || '0',
            responseStart: responseStart || '0',
            unloadEventEnd: unloadEventEnd || '0',
            unloadEventStart: unloadEventStart || '0',
            boomerTime: boomerTime || null,
            continuityEpoch: continuityEpoch || null,
            continuityLastBeacon: continuityLastBeacon || null,
            timeToInteractiveMethod: timeToInteractiveMethod || null,
            cpuConcurrency: cpuConcurrency || '0',
            visuallyReadyTime: visuallyReadyTime || '0',
            cookiesSize: cookiesSize || '0',
            uniqueDomainsNumber: uniqueDomainsNumber || '0',
            iframeNumber: iframeNumber || '0',
            imgNumber: imgNumber || '0',
            linkNumber: linkNumber || '0',
            cssNumber: cssNumber || '0',
            domsNumber: domsNumber || '0',
            resourcesFetchNumber: resourcesFetchNumber || '0',
            scriptNumber: scriptNumber || '0',
            externalScriptNumber: externalScriptNumber || '0',
            htmlSize: htmlSize || '0',
            httpInitiator: initiator || 'cache',
            downlink: downlink || null,
            effectiveType: effectiveType || null,
            roundTripTime: roundTripTime || null,
            totalJSHeapSize: totalJSHeapSize || '0',
            jsHeapSizeLimit: jsHeapSizeLimit || '0',
            usedJSHeapSize: usedJSHeapSize || '0',
            usedLocalStorageSize: usedLocalStorageSize || '0',
            usedLocalStorageKeys: usedLocalStorageKeys || '0',
            usedSessionStorageSize: usedSessionStorageSize || '0',
            usedSessionStorageKeys: usedSessionStorageKeys || '0',
            beaconNumber: beaconNumber || '0',
            nocookie: nocookie || null,
            pageId,
            firstContentfulPaint: firstContentfulPaint || '0',
            firstPaint: firstPaint || '0',
            restiming: restiming || null,
            appin: appin || null,
            mainRestiming: mainRestiming || null,
            app: app || null,
            boomerangStartTime: boomerangStartTime || null,
            boomerangEndTime: boomerangEndTime || null,
            noLoadPagesNumber: noLoadPagesNumber || '0',
            sessionId: sessionId || null,
            sessionLength: sessionLength || '0',
            sessionStart: sessionStart || '0',
            triggerMethod: triggerMethod || null,
            triggerStart: triggerStart || '0',
            sumLoadTimes: sumLoadTimes || '0',
            screenColorDepth: screenColorDepth || null,
            screenOrientation: screenOrientation || null,
            screenSize: screenSize || null,
            boomerangSnippetMethod: boomerangSnippetMethod || null,
            perceivedLoadTime: perceivedLoadTime || '0',
            additionalTimers: additionalTimers || null,
            frontTime: frontTime || '0',
            backTime: backTime || '0',
            system: system || null,
            browser: browser || null,
            boomerangVersion: boomerangVersion || null,
            pageVisibility: pageVisibility || null,
            transferSize: transferSize || '0'
        }
        console.log('-----------monitor data-----------', dat);
        const sqlstr1 = sql
            .table('web_pages')
            .data(dat)
            .insert()
        return mysql(sqlstr1);
    }
}

const queryIsUse = (appId) => {
    const sqlstr = sql
        .table('web_system')
        .where({ appId })
        .select();
    return mysql(sqlstr);
}

class data {
    //初始化对象
    constructor() {};
    // 页面打cookie
    async setMarkCookies(ctx) {
        try {
            const cookies = ctx.cookie;
            let timestamp = new Date().getTime();
            let markUser,markPage,IP;
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
            markPage = util.signwx({
                mark:'markPage',
                timestamp:timestamp,
                random:util.randomString()
            }).paySign;
            ctx.cookies.set('markPage',markPage)

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
                    markPage:'${markPage}',
                    markUser:'${markUser}',
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
                .field('isUse,id,isStatisiSystem')
                .where({appId:appId})
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.isUse !== 0 || systemItem.isStatisiSystem!==0){
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
                systemId:systemItem.id,
                IP:ctx.query.IP||'',
                isp:ctx.query.isp||'',
                county:ctx.query.county||'',
                province:ctx.query.province||'',
                city:ctx.query.city||'',
                browser:result.browser.name||'',
                borwserVersion:result.browser.version||'',
                system:result.os.name||'',
                systemVersion:result.os.version||'',
                markUser:ctx.query.markUser||'',
                markPage:ctx.query.markPage||'',
                url:decodeURIComponent(ctx.query.url)||'',
                createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
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
            const resourceDatas = ctx.request.body || {};
            const appId = resourceDatas.appId;
            if(!appId) {
                ctx.body=imgsrc;
                return;
            }; 
            let systems = await querySystems(appId);
            if(!systems || !systems.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systems[0]
            if(systemItem.isUse !== 0){
                ctx.body=imgsrc;
                return;
            };
            console.log('---start store performance data--');
            let createTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
            //----------------------------------------存储页面page性能----------------------------------------
            await storePagePerformance(createTime, resourceDatas, systemItem);
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
                .field('isUse,id,slowPageTime,isStatisiPages,slowJsTime,slowCssTime,slowImgTime,isStatisiAjax,isStatisiResource')
                .where({appId:appId})
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.isUse !== 0){
                ctx.body=imgsrc;
                return; 
            };
            
            let createTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');

            //----------------------------------------存储页面page性能----------------------------------------
            if(systemItem.isStatisiPages === 0) {
                let pageTimes = resourceDatas.pageTimes || {}
                let datas={
                    loadTime:pageTimes.loadTime,
                    dnsTime:pageTimes.dnsTime,
                    tcpTime:pageTimes.tcpTime,
                    domTime:pageTimes.domTime,
                    whiteTime:pageTimes.whiteTime,
                    redirectTime:pageTimes.redirectTime,
                    unloadTime:pageTimes.unloadTime,
                    requestTime:pageTimes.requestTime,
                    analysisDomTime:pageTimes.analysisDomTime,
                    readyTime:pageTimes.readyTime,
                    resourceTime:pageTimes.resourceTime,
                    preUrl:pageTimes.preUrl,
                    url:decodeURIComponent(resourceDatas.url),
                    markUser:resourceDatas.markUser,
                    markPage:resourceDatas.markPage,
                    createTime:createTime,
                    systemId:systemItem.id
                }

                let table = 'web_pages';
                // 判断是否存入慢表
                if((pageTimes.loadTime+pageTimes.resourceTime) >= systemItem.slowPageTime*1000) table = 'web_slowpages';

                const sqlstr1 = sql
                    .table(table)
                    .data(datas)
                    .insert()
                await mysql(sqlstr1);  
            }

            //----------------------------------------存储页面资源性能----------------------------------------

            let datas = {
                systemId:systemItem.id,
                markPage:resourceDatas.markPage,
                markUser:resourceDatas.markUser,
                callUrl:decodeURIComponent(resourceDatas.url),
                createTime:createTime,
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
                    duration = systemItem.slowJsTime
                }else if(item.type === 'link'||item.type === 'css'){
                    duration = systemItem.slowCssTime
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
                    duration = systemItem.slowImgTime
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
    async getErrorMsg(ctx){
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
                .field('isUse,id,isStatisiError')
                .where({appId:appId})
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.isUse !== 0){
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
                        createTime:moment(new Date(item.t)).format('YYYY-MM-DD HH:mm:ss'),
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
}

module.exports = new data();
