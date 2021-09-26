import sql from 'node-transform-mysql'
import moment from 'moment'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
} from '../tool'
import { result } from 'underscore';

class pages {
    //初始化对象
    constructor() {

    };

    // 获得pages页面列表
    async getPageList(ctx) {
        try {
            let systemId    = ctx.request.body.systemId;
            let pageNo      = ctx.request.body.pageNo || 1;
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE;
            let beginTime   = ctx.request.body.beginTime || '';
            let endTime     = ctx.request.body.endTime || '';
            let isAllAvg    = ctx.request.body.isAllAvg || true;
            let url         = ctx.request.body.url;

            // 公共参数
            let data = {
                system_id: systemId
            };

            if(isAllAvg === 'false') {
                if(!url) {
                    ctx.body = util.result({
                        code: 1001,
                        desc: 'url参数有误!'
                    });
                    return
                }
                data.page_id = util.getPageId(decodeURIComponent(url));
            }

            if (beginTime && endTime) {
                data.create_time = {
                    egt: beginTime,
                    elt: endTime
                };
            }
            let totalNum = 0;
            if (isAllAvg != 'false') {
                let sqlTotal = sql.field('count(1) as count').table('web_pages_basic').where(data).group('page_id').select(); 
                let total = await mysql(sqlTotal);
                if(total.length) {
                    totalNum = total.length;
                }
            }

            // 请求页面基础信息数据
            const sqlPageIds = sql.field(`page_id,
                    count(page_id) as count
                    `)
            .table('web_pages_basic')
            .group('page_id')
            .order('count desc')
            .page(pageNo, pageSize)
            .where(data)
            .select();
            const result = await mysql(sqlPageIds);
            const performanceDataQuery = result.map(async (page) => {
                const data = {
                    page_id: page.page_id
                };
                const sqlPageTiming = sql.field(`page_id,
                            avg(load_time) as load_time,
                            avg(request_time) as request_time,
                            avg(white_time) as white_time
                            `)
                    .table('web_pages_timing')
                    .group('page_id')
                    .where(data)
                    .select();
                return mysql(sqlPageTiming);
            });

            const basicQuery = result.map(async (page) => {
                const sqlBasic = sql
                    .table('web_pages_basic')
                    .where({ page_id: page.page_id })
                    .limit(0, 1)
                    .select()

                return mysql(sqlBasic);
            });

            const performanceData = await Promise.all(performanceDataQuery);
            const basicData = await Promise.all(basicQuery);

            result.forEach(item => {
                const performance = performanceData.find(i => i[0].page_id === item.page_id);
                const basic = basicData.find(i => i[0].page_id === item.page_id);
                const { load_time: loadTime, request_time: requestTime, white_time: whiteTime } = performance[0];
                const { url } = basic[0];
                Object.assign(item, { loadTime, requestTime, whiteTime, url, pageId: util.getPageId(decodeURIComponent(url)) });
            });

            let valjson = {}
            if(isAllAvg=='false') {
                if (result.length) {
                    const {
                        load_time: loadTime,
                        white_time: whiteTime,
                        request_time: requestTime,
                        url
                    } = result;
                    Object.assign(valjson, { loadTime, whiteTime, requestTime, url });
                }
            } else {
                valjson.totalNum = totalNum;
                valjson.datalist = result
            }

            ctx.body = util.result({
                data: valjson
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
    // 获得page页面概览
    async getPageAverage(ctx){
        try {
            const pagesInstance = new pages();
            const systemId    = ctx.request.body.systemId;
            const pageNo      = ctx.request.body.pageNo || 1;
            const pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE;
            const beginTime   = ctx.request.body.beginTime || '';
            const endTime     = ctx.request.body.endTime || '';
            const isAllAvg    = ctx.request.body.isAllAvg || true;
            const pageId         = ctx.request.body.pageId;

            // 公共参数
            let data = {};

            if(isAllAvg === 'false') {
                if(!pageId) {
                    ctx.body = util.result({
                        code: 1001,
                        desc: 'url参数有误!'
                    });
                    return
                }
                data.page_id = pageId;
            }

            if(beginTime && endTime) {
                data.create_time = {
                    egt: beginTime,
                    elt: endTime
                };
            }
            let totalNum = 0
            if(isAllAvg != 'false'){
                let sqlTotal = sql.field('count(1) as count').table('web_pages_basic').where(data).group('url').select(); 
                let total = await mysql(sqlTotal);
                if(total.length) totalNum = total.length
            }


            // 请求性能表格数据
            const sqlPagesTiming = sql.field(`page_id,
                        avg(load_time) as load_time,
                        avg(white_time) as white_time,
                        avg(first_paint) as first_paint,
                        avg(first_contentful_paint) as first_contentful_paint,
                        avg(visually_ready_time) as visually_ready_time,
                        avg(perceived_load_time) as perceived_load_time,
                        avg(dom_time) as dom_time,
                        avg(analysis_dom_time) as analysis_dom_time,
                        avg(dns_time) as dns_time,
                        avg(tcp_time) as tcp_time,
                        avg(redirect_time) as redirect_time,
                        avg(unload_time) as unload_time,
                        avg(request_time) as request_time,
                        avg(ready_time) as ready_time,
                        avg(sum_load_times) as sum_load_times,
                        avg(additional_timers) as additional_timers,
                        count(page_id) as count
                        `)
                .table('web_pages_timing')
                .group('page_id')
                .order('count desc')
                .page(pageNo, pageSize)
                .where(data)
                .select();

            // 请求资源表格数据
            const sqlPagesResources = sql.field(`page_id,
                        avg(body_size) as body_size,
                        avg(encoded_body_size) as encoded_body_size,
                        avg(redirect_count) as redirect_count,
                        avg(transfer_size) as transfer_size,
                        avg(unique_domains_number) as unique_domains_number,
                        avg(iframe_number) as iframe_number,
                        avg(img_number) as img_number,
                        avg(link_number) as link_number,
                        avg(css_number) as css_number,
                        avg(doms_number) as doms_number,
                        avg(resources_fetch_number) as resources_fetch_number,
                        avg(script_number) as script_number,
                        avg(external_script_number) as external_script_number,
                        avg(html_size) as html_size,
                        count(page_id) as count
                        `)
                .table('web_pages_resources')
                .group('page_id')
                .order('count desc')
                .page(pageNo, pageSize)
                .where(data)
                .select();

            // 请求客户端表格数据
            const sqlPagesClient = sql.field(`page_id,
                        avg(cpu_concurrency) as cpu_concurrency,
                        avg(round_trip_time) as round_trip_time,
                        avg(downlink) as downlink,
                        count(page_id) as count
                        `)
                .table('web_pages_client')
                .group('page_id')
                .order('count desc')
                .page(pageNo, pageSize)
                .where(data)
                .select();

            const resultPagesTiming = await mysql(sqlPagesTiming);
            const resultPagesResources = await mysql(sqlPagesResources);
            const resultPagesClient = await mysql(sqlPagesClient);

            let valjson = {}

            const queryPageId = sql
                .table('web_pages_basic')
                .where({ page_id: pageId })
                .limit(0, 1)
                .select()

            const pageIds = await mysql(queryPageId);
            if(isAllAvg === 'false') {
                if (resultPagesTiming.length) {
                    const {
                        load_time: loadTime,
                        white_time: whiteTime,
                        first_paint: firstPaint,
                        first_contentful_paint: firstContentfulPaint,
                        visually_ready_time: visuallyReadyTime,
                        perceived_load_time: perceivedLoadTime,
                        dom_time: domTime,
                        analysis_dom_time: analysisDomTime,
                        dns_time: dnsTime,
                        tcp_time: tcpTime,
                        redirect_time: redirectTime,
                        unload_time: unloadTime,
                        request_time: requestTime,
                        ready_time: readyTime,
                        sum_load_times: sumLoadTimes,
                        additional_timers: additionalTimers,
                        url
                    } = resultPagesTiming[0];

                    const {
                        body_size: bodySize,
                        encoded_body_size: encodedBodySize,
                        redirect_count: redirectCount,
                        transfer_size: transferSize,
                        unique_domains_number: uniqueDomainsNumber,
                        iframe_number: iframeNumber,
                        img_number: imgNumber,
                        link_number: linkNumber,
                        css_number: cssNumber,
                        doms_number: domsNumber,
                        resources_fetch_number: resourcesFetchNumber,
                        script_number: scriptNumber,
                        external_script_number: externalScriptNumber,
                        html_size: htmlSize,
                        count
                    } = resultPagesResources[0];

                    const {
                        cpu_concurrency: cpuConcurrency,
                        round_trip_time: roundTripTime,
                        downlink,
                    } = resultPagesClient[0];

                    Object.assign(valjson, { loadTime, whiteTime, firstPaint, firstContentfulPaint,     visuallyReadyTime, count,
                        perceivedLoadTime, domTime, analysisDomTime, dnsTime, tcpTime, redirectTime, unloadTime, requestTime,
                        readyTime, sumLoadTimes, additionalTimers, bodySize, encodedBodySize, redirectCount, transferSize,
                        uniqueDomainsNumber, iframeNumber, imgNumber, linkNumber, cssNumber, domsNumber, resourcesFetchNumber,
                        scriptNumber, externalScriptNumber, htmlSize, cpuConcurrency, roundTripTime, downlink, url
                    });
                }
            } else {
                valjson.totalNum = totalNum;
                valjson.datalist = result
            }

            if (pageIds && pageIds.length) {
                Object.assign(valjson, { url: pageIds[0].url });
            }

            ctx.body = util.result({
                data: valjson
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
    // 页面性能详情
    async getPageItemDetail(ctx) {
        try {
            const pagesInstance = new pages();
            const pageNo      = ctx.request.body.pageNo || 1;
            const pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE;
            const beginTime   = ctx.request.body.beginTime || '';
            const endTime     = ctx.request.body.endTime || '';
            const pageId      = ctx.request.body.pageId || '';
            const userId      = ctx.request.body.userId || '';
            const isSearching = ctx.request.body.isSearching || 'false';

            if(!pageId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'pageId参数有误!'
                });
                return
            }

            // 请求参数
            let data = (isSearching === 'true' && userId) ? { page_id: pageId, user_id: userId } : { page_id: pageId };
            if(beginTime && endTime) {
                data.create_time = {
                    egt: beginTime,
                    elt: endTime
                };
            }

            // 获得总条数
            const sqlTotal = sql.field('count(1) as count').table('web_pages_basic').where(data).select() 
            const total = await mysql(sqlTotal);
            let totalNum = 0;
            if(total.length) {
                totalNum = total[0].count;
            }

            // 获得列表
            const sqlstr_web_pages_basic = sql
                .table('web_pages_basic')
                .where(data)
                .order('create_time desc')
                .page(pageNo, pageSize)
                .select()
            let result = await mysql(sqlstr_web_pages_basic);

            if(result && result.length) {
                const queryList = [];
                result.forEach(item => {
                    item.dateTime = moment(new Date(item.create_time)).format('YYYY-MM-DD HH:mm:ss');
                    queryList.push(pagesInstance.queryPageTimingById(item.id));
                })
                const queryResult = await Promise.all(queryList);
                result = result.map(item => {
                    const {
                        user_id: userId,
                        id,
                        page_id: pageId,
                        system_id: systemId,
                        url,
                        create_time: createTime,
                        app,
                    } = item;
                    const target = queryResult.find(i => i.monitorId === item.id);
                    Object.assign(item, target);
                    Object.assign(item, { pageId, systemId, createTime, userId });
                    return item;
                });
            }

            ctx.body = util.result({
                data: {
                    totalNum: totalNum,
                    datalist: result
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

    // 页面基本信息
    async queryPageBasicById(id) {
        let valjson = {};
        if (!id) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_pages_basic')
            .where({ id })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                user_id: userId,
                id,
                page_id: pageId,
                system_id: systemId,
                url,
                create_time: createTime,
                app,
            } = result[0];
            Object.assign(valjson, { id, pageId, systemId, url, createTime, app, userId });
        }
        return valjson;
    }

    // 提取主子应用数据
    extractAppData(restiming) {
        const result = {
            totalCount: 0,
            totalDuration: 0,
            apps: []
        };
        const categories = {};
        if (restiming && JSON.parse(restiming).length > 0) {
            const dups = {};
            const restimings = JSON.parse(restiming);
            result.totalCount = restimings.length;
            restimings.forEach((item, index) => {
                const key = util.convert2Md5(item.app);
                const dat = {
                    name: item.name,
                    value: item.responseEnd - item.startTime
                };
                if (!categories[key]) {
                    Object.assign(categories, {
                        [key]: {
                            static: [],
                            api: [],
                            dups: [],
                            app: item.app,
                            count: 1,
                            start: undefined,
                            end: undefined,
                            duration: 0
                        }
                    });
                    Object.assign(dups, {
                        [key]: []
                    });
                } else {
                    categories[key].count += 1;
                }

                if (util.isStaticSource(item.name)) {
                    categories[key].static.push(dat);
                } else {
                    categories[key].api.push(dat);
                }
                if (dups[key].indexOf(item.name) !== -1) {
                    const target = categories[key].dups.find(i => i.url === item.name);
                    if (target) {
                        (categories[key].dups[categories[key].dups.indexOf(target)]).count = target.count + 1;
                    } else {
                        categories[key].dups.push({
                            url: item.name,
                            count: 1
                        });
                    }
                } else {
                    dups[key].push(item.name);
                }

                if (!categories[key].start || (categories[key].start > item.startTime)) {
                    categories[key].start = item.startTime;
                }

                if (!categories[key].end || (categories[key].end < item.responseEnd)) {
                    categories[key].end = item.responseEnd;
                    categories[key].duration = categories[key].end - categories[key].start;
                    if (result.totalDuration < categories[key].end) {
                        result.totalDuration = categories[key].end;
                    }
                }
            });
        }
        for (let key in  categories) {
            const sortedApi = categories[key].api.sort((pre, post) => post.value - pre.value);
            const sortedStatic = categories[key].static.sort((pre, post) => post.value - pre.value);
            const sortedDups = categories[key].dups.sort((pre, post) => post.count - pre.count);
            const { count, start, end, duration } = categories[key];
            const data = {
                app: categories[key].app,
                api: {
                    names: sortedApi.map(i => i.name),
                    values: sortedApi.map(i => i.value)
                },
                static: {
                    names: sortedStatic.map(i => i.name),
                    values: sortedStatic.map(i => i.value)
                },
                dups: sortedDups,
                count,
                start,
                end,
                duration,
                key
            };
            result.apps.push(data);
        }

        return result;
    }

    // 页面时间相关性能参数
    async queryPageTimingById(monitorId) {
        let valjson = {};
        if (!monitorId) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_pages_timing')
            .where({ monitor_id: monitorId })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                monitor_id: monitorId,
                page_id: pageId,
                url,
                load_time: loadTime,
                white_time: whiteTime,
                first_paint: firstPaint,
                first_contentful_paint: firstContentfulPaint,
                visually_ready_time: visuallyReadyTime,
                perceived_load_time: perceivedLoadTime,
                dom_time: domTime,
                analysis_dom_time: analysisDomTime,
                dns_time: dnsTime,
                tcp_time: tcpTime,
                redirect_time: redirectTime,
                unload_time: unloadTime,
                request_time: requestTime,
                ready_time: readyTime
            } = result[0];
            Object.assign(valjson, { monitorId, pageId, url, loadTime, whiteTime,
                firstPaint, firstContentfulPaint, visuallyReadyTime, perceivedLoadTime,
                domTime, analysisDomTime, dnsTime, tcpTime, redirectTime, unloadTime, 
                requestTime, readyTime
            });
        }
        return Promise.resolve(valjson);
    }

    // 页面瀑布流数据
    async queryPageRestimingById(monitorId) {
        let valjson = {};
        if (!monitorId) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_pages_restiming')
            .where({ monitor_id: monitorId })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                monitor_id: monitorId,
                restiming: restiming
            } = result[0];
            Object.assign(valjson, { monitorId, restiming: util.decompress(restiming) });
        }
        return Promise.resolve(valjson);
    }

    // 页面资源信息
    async queryPageResourcesById(monitorId) {
        let valjson = {};
        if (!monitorId) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_pages_resources')
            .where({ monitor_id: monitorId })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                monitor_id: monitorId,
                page_id: pageId,
                url,
                body_size: bodySize,
                encoded_body_size: encodedBodySize,
                redirect_count: redirectCount,
                transfer_size: transferSize,
                doms_number: domsNumber,
                script_number: scriptNumber,
                external_script_number: externalScriptNumber,
                resources_fetch_number: resourcesFetchNumber,
                html_size: htmlSize,
                img_number: imgNumber,
                link_number: linkNumber,
                css_number: cssNumber,
                iframe_number: iframeNumber,
                unique_domains_number: uniqueDomainsNumber,
                total_js_heap_size: totalJSHeapSize,
                js_heap_size_limit: jsHeapSizeLimit,
                used_js_heap_size: usedJSHeapSize,
                used_local_storage_size: usedLocalStorageSize,
                used_local_storage_keys: usedLocalStorageKeys
            } = result[0];
            Object.assign(valjson, { monitorId, pageId, url, bodySize, encodedBodySize, redirectCount,
                transferSize, domsNumber, scriptNumber, externalScriptNumber, resourcesFetchNumber,
                htmlSize, imgNumber, linkNumber, cssNumber, iframeNumber, uniqueDomainsNumber,
                totalJSHeapSize, jsHeapSizeLimit, usedJSHeapSize, usedLocalStorageSize, usedLocalStorageKeys
            });
        }
        return Promise.resolve(valjson);
    }

    // 客户端信息
    async queryPageClientById(monitorId) {
        let valjson = {};
        if (!monitorId) {
            return valjson
        }
        // 获得列表
        const sqlstr = sql
            .table('web_pages_client')
            .where({ monitor_id: monitorId })
            .select()
        
        let result = await mysql(sqlstr);
        if (result.length) {
            const {
                monitor_id: monitorId,
                page_id: pageId,
                url,
                appin,
                navigation_type: navigationType,
                next_hop_protocol: nextHopProtocol,
                system,
                browser,
                cpu_concurrency: cpuConcurrency,
                screen_color_depth: screenColorDepth,
                screen_orientation: screenOrientation,
                screen_size: screenSize,
                http_initiator: httpInitiator,
                effective_type: effectiveType,
                downlink,
                round_trip_time: roundTripTime
            } = result[0];
            Object.assign(valjson, { monitorId, pageId, url, appin, navigationType, nextHopProtocol,
                system, browser, cpuConcurrency, screenColorDepth, screenOrientation, screenSize, httpInitiator,
                effectiveType, downlink, roundTripTime
            });
        }
        return Promise.resolve(valjson);
    }

    // 根据ID获得page详情性能信息
    async getPageItemForId(ctx) {
        try {
            const pagesInstance = new pages();
            let id       = ctx.request.body.id

            if(!id){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'id参数有误!'
                });
                return
            }
            let valjson = {}

            const [
                resultPageBasic,
                resultPageTiming,
                resultPageRestiming,
                resultPageResources,
                resultPageClient
            ] = await Promise.all([
                pagesInstance.queryPageBasicById(id),
                pagesInstance.queryPageTimingById(id),
                pagesInstance.queryPageRestimingById(id),
                pagesInstance.queryPageResourcesById(id),
                pagesInstance.queryPageClientById(id)
            ]);

            const addInfo = pagesInstance.extractAppData(resultPageRestiming.restiming);
            Object.assign(valjson, resultPageBasic, resultPageTiming,
                resultPageRestiming, resultPageResources, resultPageClient);
            Object.assign(valjson, {
                add: addInfo,
            });
            ctx.body = util.result({
                data: valjson
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

