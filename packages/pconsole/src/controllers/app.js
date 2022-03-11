import moment from 'moment'
import {
    SYSTEM
} from '../config'
import {
    util,
} from '../tool'
import AppService from '../services/appService'

class App {
    //初始化对象
    constructor() {
    };

    // 获得子应用列表
    async getAppsList(ctx) {
        try {
            const { systemId } = ctx.request.body;
            const pageNo      = ctx.request.body.pageNo || 1;
            const pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE;

            if(!systemId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'system Id 为空！'
                });
                return
            }

            const valjson = {
                total: 0,
                data: []
            }

            // 公共参数
            const param = {
                systemId,
                pageNo,
                pageSize
            };

            const resps = await AppService.getAppList(param);

            valjson.total = resps.count.length
            resps.rows.forEach(item => {
                const {
                    app_id: appId,
                    app_name: appName,
                    count,
                    is_main
                } = item;

                valjson.data.push({
                    appId,
                    appName,
                    count,
                    isMain: is_main === '0'
                })
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

    // 获得应用概览
    async getAppAverage(ctx) {
        try {
            const { appId, systemId } = ctx.request.body;
            if (!appId) {
                ctx.body = util.result({
                    code: 1001,
                    desc: 'app Id 为空！'
                });
                return
            }
            if (!systemId) {
                ctx.body = util.result({
                    code: 1001,
                    desc: 'system Id 为空！'
                });
                return
            }
            const param = {
                systemId,
                appId
            }

            const averagePageTimingResults = await AppService.getAveragePageTiming(param); // 性能数据
            const averagePageResourcesResults = await AppService.getAveragePageResources(param); // 请求资源表格数据
            const averagePageClientResults = await AppService.getAveragePagesClient(param); // 请求客户端表格数据

            const valjson = {}
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
                time_to_interactive: timeToInteractive
            } = averagePageTimingResults[0];

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
            } = averagePageResourcesResults[0];

            const {
                cpu_concurrency: cpuConcurrency,
                round_trip_time: roundTripTime,
                downlink,
            } = averagePageClientResults[0];

            Object.assign(valjson, { loadTime, whiteTime, firstPaint, firstContentfulPaint, visuallyReadyTime, count,
                perceivedLoadTime, domTime, analysisDomTime, dnsTime, tcpTime, redirectTime, unloadTime, requestTime,
                readyTime, sumLoadTimes, additionalTimers, bodySize, encodedBodySize, redirectCount, transferSize,
                uniqueDomainsNumber, iframeNumber, imgNumber, linkNumber, cssNumber, domsNumber, resourcesFetchNumber,
                scriptNumber, externalScriptNumber, htmlSize, cpuConcurrency, roundTripTime, downlink, timeToInteractive
            });

            const apps = await AppService.getSingleApp(param)
            if (apps && apps.length) {
                if (apps[0].url) {
                    Object.assign(valjson, { url: apps[0].url.split('?')[0], appName: apps[0].app_name });
                }
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

    // 页面性能历史
    async getAppHistory(ctx) {
        try {
            const pageNo = ctx.request.body.pageNo || 1;
            const pageSize = ctx.request.body.pageSize || SYSTEM.PAGESIZE;
            const beginTime = ctx.request.body.beginTime || '';
            const endTime = ctx.request.body.endTime || '';
            const appId = ctx.request.body.appId || '';
            const userId = ctx.request.body.userId || '';

            if(!appId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'app Id参数有误!'
                });
                return
            }

            // 请求参数
            const param = {
                appId, pageNo, pageSize, beginTime, endTime, userId
            };

            const appsHistoryResults = await AppService.getAppHistory(param);

            let result = [];
            if(appsHistoryResults.rows && appsHistoryResults.rows.length) {
                result = appsHistoryResults.rows.map((item) => {
                    const {
                        user_id: userId,
                        id,
                        page_id: pageId,
                        system_id: systemId,
                        url,
                        create_time: createTime,
                        is_main,
                        'web_pages_timing.load_time': loadTime,
                        'web_pages_timing.white_time': whiteTime,
                        'web_pages_timing.request_time': requestTime
                    } = item;

                    return {
                        id, url, pageId, systemId, createTime, userId,
                        loadTime, whiteTime, requestTime,
                        isMain: is_main === '0',
                        dateTime: moment(new Date(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
                    }
                });
            }

            ctx.body = util.result({
                data: {
                    total: appsHistoryResults.count,
                    data: result
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

    // 提取主子应用数据
    extractAppData(restiming) {
        console.log('----', restiming);
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
            const start = restimings[0].startTime;
            let end = 0;
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
                            isMain: item.is_main,
                            count: 1,
                            start: item.startTime,
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

                if (!categories[key].end || (categories[key].end < item.responseEnd)) {
                    categories[key].end = item.responseEnd;
                    categories[key].duration = categories[key].end - categories[key].start;
                    if (end < categories[key].end) {
                        end = categories[key].end;
                    }
                }
            });
            result.totalDuration = end > start ? (end - start) : 0;
        }
        for (let key in  categories) {
            const sortedApi = categories[key].api.sort((pre, post) => post.value - pre.value);
            const sortedStatic = categories[key].static.sort((pre, post) => post.value - pre.value);
            const sortedDups = categories[key].dups.sort((pre, post) => post.value - pre.value);
            const { count, start, end, duration } = categories[key];
            const data = {
                app: categories[key].app,
                isMain: categories[key].isMain,
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

    // 根据ID获得app详情性能信息
    async getAppDetail(ctx) {
        try {
            const { id } = ctx.request.body;

            if(!id) {
                ctx.body = util.result({
                    code: 1001,
                    desc: 'id参数有误!'
                });
                return
            }

            const appInstance = new App();
            const param = { id };
            const valjson = {
                basic: {},
                client: {},
                resources: {},
                restiming: {},
                timing: {}
            };

            const [
                basics,
                clients,
                resources,
                restimings,
                timings
            ] = await Promise.all([
                AppService.getWebPagesBasicById(param),
                AppService.getWebPagesClientById(param),
                AppService.getWebPagesResourcesById(param),
                AppService.getWebPagesRestimingById(param),
                AppService.getWebPagesTimingById(param),
            ]);

            if (basics && basics.length &&
                clients && clients.length &&
                resources && resources.length &&
                restimings && restimings.length &&
                timings && timings.length) {
                // 页面基本信息
                const {
                    id: monitorId,
                    app_id: appId,
                    app_name: appName,
                    url,
                    is_main,
                    create_time: createTime,
                    additional_info: additionalInfo
                } = basics[0];

                Object.assign(valjson.basic, {
                    monitorId,
                    url,
                    createTime,
                    additionalInfo,
                    appId,
                    appName,
                    isMain: is_main === '0'
                });

                // 客户端基本信息
                const {
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
                } = clients[0];

                Object.assign(valjson.client, { appin, navigationType, nextHopProtocol,
                    system, browser, cpuConcurrency, screenColorDepth, screenOrientation, screenSize, httpInitiator,
                    effectiveType, downlink, roundTripTime
                });

                // 页面资源信息
                const {
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
                } = resources[0];

                Object.assign(valjson.resources, { bodySize, encodedBodySize, redirectCount,
                    transferSize, domsNumber, scriptNumber, externalScriptNumber, resourcesFetchNumber,
                    htmlSize, imgNumber, linkNumber, cssNumber, iframeNumber, uniqueDomainsNumber,
                    totalJSHeapSize, jsHeapSizeLimit, usedJSHeapSize, usedLocalStorageSize, usedLocalStorageKeys
                });

                // 瀑布流数据
                const {
                    restiming: restiming
                } = restimings[0];
                const decodedRestiming = util.decompress(restiming);
                const add = appInstance.extractAppData(decodedRestiming);
                Object.assign(valjson.restiming, { restiming: decodedRestiming, add });    

                // 页面性能数据
                const {
                    load_time: loadTime,
                    white_time: whiteTime,
                    first_paint: firstPaint,
                    first_contentful_paint: firstContentfulPaint,
                    time_to_interactive: timeToInteractive,
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
                } = timings[0];
                Object.assign(valjson.timing, { loadTime, whiteTime,
                    firstPaint, firstContentfulPaint, visuallyReadyTime, perceivedLoadTime,
                    domTime, analysisDomTime, dnsTime, tcpTime, redirectTime, unloadTime, 
                    requestTime, readyTime, timeToInteractive
                });
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
}

module.exports = new App();
