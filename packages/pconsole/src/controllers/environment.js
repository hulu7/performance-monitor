import {
    util,
} from '../tool'
import EnvironmentService from '../services/environmentService'

class Environment {
    //初始化对象
    constructor() {
    };
    // 根据url查询浏览器分类情况
    async getDataForEnvironment(ctx) {
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

            if(!type){
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
            environmentResults.map(item => {
                item.location = item.location ? JSON.parse(item.location) : {}
                if (type === 'boomerang_snippet_method') {
                    item.boomerang_snippet_method = boomerangSnippetMethodMap[item.boomerang_snippet_method]
                }
                if (type === 'http_initiator') {
                    item.http_initiator = httpInitiatorMap[item.http_initiator];
                }
            })

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

    async queryIPGeoHistory(ctx) {
        try {
            const { appId, beginTime, endTime } = ctx.request.body;

            if(!appId) {
                ctx.body = util.result({
                    code: 1001,
                    desc: 'appId参数有误!'
                });
                return
            }

            if(!beginTime || !endTime) {
                ctx.body = util.result({
                    code: 1001,
                    desc: '时间参数有误!'
                });
                return
            }

            const param = {
                appId,
                beginTime,
                endTime
            };

            const environmentResults = await EnvironmentService.queryIPGeoHistory(param);
            const results = []

            if (environmentResults && environmentResults.rows.length) {
                const httpInitiatorMap = {
                    spa: '应用内跳转',
                    spa_hard: '通过url访问'
                };

                environmentResults.rows.map(item => {
                    const {
                        url,
                        create_time: time,
                        'web_pages_client.ip': ip,
                        'web_pages_client.location': location,
                        'web_pages_client.appin': appin,
                        'web_pages_client.navigation_type': navigationType,
                        'web_pages_client.next_hop_protocol': nextHopProtocol,
                        'web_pages_client.system': system,
                        'web_pages_client.browser': browser,
                        'web_pages_client.cpu_concurrency': cpuConcurrency,
                        'web_pages_client.screen_color_depth': screenColorDepth,
                        'web_pages_client.screen_orientation': screenOrientation,
                        'web_pages_client.screen_size': screenSize,
                        'web_pages_client.http_initiator': httpInitiator,
                        'web_pages_client.effective_type': effectiveType,
                        'web_pages_client.downlink': downlink,
                        'web_pages_client.round_trip_time': roundTripTime,
                    } = item

                    results.push({
                        time,
                        ip,
                        location: location && location[0] === '{' ? JSON.parse(location) : {},
                        appin,
                        navigationType,
                        nextHopProtocol,
                        system,
                        browser,
                        cpuConcurrency,
                        screenColorDepth,
                        screenOrientation,
                        screenSize,
                        httpInitiator: httpInitiatorMap[httpInitiator],
                        effectiveType,
                        downlink,
                        roundTripTime
                    })
                })
            }
            ctx.body = util.result({
                data: results
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
