import os from 'os'
import Apisauce from 'apisauce'
import URL from 'url'
import crypto from 'crypto'
import { replace } from 'lodash'
import {
    SYSTEM
} from '../config'

function encryptWithMd5 (content) {
    const MD5 = crypto.createHash('md5');
    return MD5.update(content).digest('hex');
}

/**
 * 判断url是否是合法的JD域名，防止登录劫持
 * 
 * @function getSafeHostname
 * 
 * @param {String} url 链接
 * @return {Boolean} 
 * 
 */
function isSafeHostname (url) {
    try {
        const { hostname } = URL.parse(url);
        const isJDDomain = /^[\w-.]+\.jdcloud\.com$/i;
        return hostname && isJDDomain.test(hostname);
    } catch (err) {
        throw err;
    }
}

/**
 * 对url进行处理，检测是否合法url，及特殊字符处理
 * 
 * @function transformReturl
 * 
 * @param {String} url 链接
 * @return {String} url
 * 
 */
function transformReturl (url) {
    try {
        if (!url) {
            throw new Error('retUrl illega');
        }
        // 避免跳转到其他域名
        if (!isSafeHostname(url)) {
            throw new Error(`${url} path illegal.`);
        }
        return replace(decodeURIComponent(url), /\*\*\*/g, '&');
    } catch (err) {
        throw err;
    }
}

/**
 * 获取登录的url
 * 
 * @function getLoginUrl
 * 
 * @param {Object} config  配置参数
 * @param {String} country 国家
 * @param {String} retUrl  回调地址
 * @return {String} url
 * 
 */
function getLoginUrl (retUrl) {
    try {
        const return_url = transformReturl(retUrl);
        return `${SYSTEM.SSODOMAIN}/sso/login?ReturnUrl=${return_url}`;
    } catch (err) {
        throw err;
    }
}

function getIp() {
    const ifaces = os.networkInterfaces();
    let ip = Object.keys(ifaces)
        .map(interf => ifaces[interf].map(o => !o.internal && o.family === 'IPv4' && o.address))
        .reduce((a, b) => a.concat(b))
        .filter(o => o)[0];

    if (!ip) {
        ip = '127.0.0.1';
    }
    return ip;
}

/**
 * 结果处理
 * @function handleResult
 * 
 * @param {Boolean} ok 
 * @param {*} data 
 */
function handleResult (ok, data) {
    if (!ok && data === null) {
        throw new Error('请检查网络环境，测试环境请在办公网络下，不支持VPN；');
    }
    return data;
}

/**
 * 国内登录
 * @function getErpTicket
 * 
 * @param {Object} config       配置信息
 * @param {String} sso_cookie   sso.jd.com
 */
async function getErpTicket (sso_cookie) {
    const ip = getIp();

    const { ok, data } = await Apisauce.create({
        baseURL: `${SYSTEM.SSODOMAIN}/sso/ticket/verifyTicket`,
        timeout: 5000,
    }).get(`/?ticket=${sso_cookie}&url=${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}/&ip=${ip}`);
    return handleResult(ok, data);
}

/**
 * 非jd.com主域校验service_ticket
 * @function verifyTicket
 */
 async function verifyTicket (sso_cookie, return_url) {
    const ip = getIp();
    const requestTimestamp = new Date().valueOf();
    const sign = encryptWithMd5(SYSTEM.APPTOKEN + requestTimestamp + sso_cookie);

    const { ok, data } = await Apisauce.create({
        baseURL: `${SYSTEM.SSODOMAIN}/api/verifyTicket `,
        timeout: 5000,
    }).get(`/?ticket=${sso_cookie}
        &url=${return_url}
        &ip=${ip}
        &app=${SYSTEM.APPKEY}
        &time=${requestTimestamp}
        &sign=${sign}`);
    return handleResult(ok, data);
}


/**
 * 非jd.com主域获取token
 * @function getTicket
 */
 async function getTicket (sso_service_ticket, return_url) {
    const ip = getIp();
    const requestTimestamp = new Date().valueOf();
    const content = `${SYSTEM.APPTOKEN}${requestTimestamp}${sso_service_ticket}`;
    const sign = encryptWithMd5(content);

    const { ok, data } = await Apisauce.create({
        baseURL: `${SYSTEM.SSODOMAIN}/api/getTicket`,
        timeout: 5000,
    }).get(`/?sso_service_ticket=${sso_service_ticket}
        &url=${return_url}
        &ip=${ip}
        &app=${SYSTEM.APPKEY}
        &time=${requestTimestamp}
        &sign=${sign}`);
    return handleResult(ok, data);
}

/**
 * validate config params
 * 
 * @function LOGIN
 * 
 */
function LOGIN () {
    this.config = {
        credential: {
            app: SYSTEM.APPKEY,
            token: SYSTEM.APPTOKEN,
        },
        domain: `${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}`
    };
}

/**
 * LOGIN initial
 *
 * @function LOGIN.init
 * 
 * @param  {Object}   config   配置参数
 * @return {Object}   LOGIN      对象
 * 
 * @example
 * LOGIN.init({
 *   credential: {
 *     app: YOUR_APP,
 *     token: YOUR_SECRET_KEY
 *   },
 *   domain: 'YOUR DOMAIN'
 * })
 */
 LOGIN.init = function () {
    return new LOGIN();
}

/**
 * 获取登录的路径
 * 
 * @function LOGIN.getLoginUrl
 * 
 * @param  {String}   retUrl       erp登录完了后跳转地址
 * @return {String}   url          拿到该url后可在浏览器中跳转
 * 
 * @example
 * LOGIN.getLoginUrl(retUrl: '')
 */
 LOGIN.prototype.getLoginUrl = function (retUrl) {
    return getLoginUrl(retUrl);
}

/**
 * erp登录函数
 *
 * @function LOGIN.erpLogin
 * 
 * @param  {String}   sso_cookie   cookie字段 sso.jd.com
 * @return {Object}   data         根据sso_cookie查询返回当前用户基本信息
 * 
 * @example
 * LOGIN.erpLogin(sso_cookie: 'xxxxxxxxcccccccc')
 */
LOGIN.prototype.erpLogin = async function (sso_cookie) {
    console.log('sso_cookie', sso_cookie);
    try {
        if (!sso_cookie) {
            throw new Error('sso_cookie is required, cookies column sso.jd.com');
        }
        return await getErpTicket(sso_cookie);
    } catch (err) {
        throw err;
    }
}

/**
 * 获取指定的cookie
 * @param {String} key cookie的key
 * @returns {String}
 */
export function getCookie(key, cookie) {
    if (!cookie) {
        return undefined;
    }
    const cookies = cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cur = cookies[i].split('=');
        if (key === cur[0].replace(/(^\s*)|(\s*$)/g, '')) {
            return cur[1].replace(/(^\s*)|(\s*$)/g, '');
        }
    }
    return undefined;
}
  


module.exports = function () {
    return async function (ctx, next) {
        console.log('---login check: ',)
        const url = ctx.request.url;
        const cookie = getCookie('sso.jd.com', ctx.request.header.cookie);
        const ticket = ctx.query.sso_service_ticket;
        const login = LOGIN.init();
        const loginUrl = login.getLoginUrl(`${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}${url}`);
        console.log('---cookie: ', cookie);
        console.log('---ctx.request.header: ', ctx.request.header);
        console.log('---sso_service_ticket: ', ticket);
        if (url === '/favicon.ico') {
            return
        }
        if (cookie) {
            const data = await login.erpLogin(cookie)
            console.log('-- verify result: ', data)
            if (data.REQ_CODE === 1 && data.REQ_FLAG) {
                console.log('-- login successfully, start to render.')
                return await next();
            } else {
                console.log('-- check fail, go to login page.')
                ctx.redirect(loginUrl)
            }
            return
        }
        if (!cookie && ticket) {
            const resp = await getTicket(ticket, `${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}${url}`);
            console.log('-- getTicket', resp)
            if (resp.REQ_CODE === 1 && resp.REQ_FLAG) {
                console.log('-- login successfully, start to render.')
                ctx.cookies.set('sso.jd.com', cookie, {
                    domain: '.jdcloud.com',
                    path: '/',
                    httpOnly: `${SYSTEM.PROTOCOL === 'https'}`,
                    overwrite: false
                })
                ctx.body = 'set cookie success'
                return await next();
            } else {
                console.log('-- check fail, go to login page.')
                ctx.redirect(loginUrl)
            }
            return
        }
        console.log('-- not login, go to login page.')
        ctx.redirect(loginUrl)
    }
}
