import moment from 'moment';
import {
    util,
} from '../tool';
const imgsrc = 'success';
import ReportService from '../services/reportService';
import SystemService from '../services/systemService';

class data {
    //初始化对象
    constructor() {};

    async reportPerformance(ctx) {
        ctx.set('Access-Control-Allow-Origin','*');
        try {
            const dataInstance = new data();
            const resourceDatas = ctx.request.body || {};
            const { uuid } = resourceDatas;
            if(!uuid) {
                ctx.body=imgsrc;
                return;
            };

            const systems = await SystemService.getSystemByUUID(uuid);
        
            if(!systems || !systems.length){
                ctx.body=imgsrc;
                return; 
            };
            const systemItem = systems[0]
            if(systemItem.is_use !== 0){
                ctx.body=imgsrc;
                return;
            };
            console.log('---start store performance data--');
            const createTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');

            //存储页面page性能
            await dataInstance.storePagePerformance(createTime, resourceDatas, systemItem);
            ctx.body=imgsrc;
            return;
        } catch(err) {
            console.log(err)
            ctx.body=imgsrc
        }  
    }

    async storePagePerformance(createTime, resourceDatas, systemItem) {
        if(systemItem.is_monitor_pages === 0){
            const {
                mob, c, rt, vis, ua, dom, mem, scr, cpu, http, pt,
                nocookie,
                restiming,
                app,
                appin,
                user_id,
                additional_info,
                is_main,
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
                img: img,
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
            let img_number
            if (img && (Object.prototype.toString.call(img) === '[object Array]')) {
                img_number = img[0];
            } else {
                img_number = img
            }
            const decodedUrl = decodeURIComponent(url || '');
            const page_id = util.getPageId(decodedUrl);
            const app_id = util.convert2Md5(`${systemItem.id}_${app || 'unknown'}`);

            //基本信息
            const basicData = {
                user_id: user_id || '',
                page_id,
                is_main: is_main ? '0' : '1',
                url: decodedUrl || '',
                system_id: systemItem.id,
                create_time: createTime || '',
                mark_page: pageMark || '',
                app_id,
                app_name: app || 'unknown',
                additional_info: additional_info || ''
            };

            // 性能信息
            const time_to_interactive = Object.keys(tti).find(key => tti[key] === true);
            const timingData = {
                page_id,
                app_id,
                url: decodedUrl || '',
                load_time: load_time || '0',
                white_time: white_time || '0',
                first_paint: first_paint || '0',
                first_contentful_paint: first_contentful_paint || '0',
                time_to_interactive: time_to_interactive || '0',
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
            
            // 瀑布流数据
            const restimingData = {
                restiming: util.compress(restiming) || ''
            };

            // 基本性能数据
            const navigationData = {
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
    
            // 资源数据
            const resourcesData = {
                app_id,
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
    
            // 客户端信息
            const clientData = {
                app_id,
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
    
            // 探针信息
            const probeData = {
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

            const param = {
                basicData, timingData, restimingData, navigationData,
                resourcesData, clientData, probeData
            };

            await ReportService.storePerformanceData(param);
        }
    }
}

module.exports = new data();
