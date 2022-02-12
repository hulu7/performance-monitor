import URL from 'url'
import { replace } from 'lodash'
import {
    SYSTEM
} from '../config'
import {
    util
} from '../tool'
import UserService from '../services/userService'

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
        return `${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}/login?ReturnUrl=${return_url}`;
    } catch (err) {
        throw err;
    }
}

/**
 * 校验tooken
 * @function verifyToken
 */
 async function verifyToken (user_id, user_token) {
    const resp = await UserService.getUserById(user_id);
    if (resp.length) {
        const {
            id,
            login_expire_time: expireTime,
            is_permit,
            token
        } = resp[0].dataValues;
        const now = new Date().valueOf();
        const expire = new Date(expireTime).valueOf();
        if (user_token !== token) {
            return false;
        }

        if (is_permit === 1) {
            return false;
        }

        if(expire < now) {
            await UserService.updateUser(id, {
                token: '',
                login_expire_time: now
            })
            return false;
        }
        return true;
    }
    return false;
}

/**
 * validate config params
 * 
 * @function LOGIN
 * 
 */
function LOGIN () {
    this.config = {
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
 * @param  {String}   retUrl       登录完了后跳转地址
 * @return {String}   url          拿到该url后可在浏览器中跳转
 * 
 * @example
 * LOGIN.getLoginUrl(retUrl: '')
 */
 LOGIN.prototype.getLoginUrl = function (retUrl) {
    return getLoginUrl(retUrl);
}

/**
 * 登录函数
 *
 * @function LOGIN.erpLogin
 * 
 * @param  {String}   user   cookie字段 performance.monitor.user
 * @param  {String}   token   cookie字段 performance.monitor.token
 * @return {Object}   data     根据sso_cookie查询返回当前用户基本信息
 * 
 * @example
 * LOGIN.erpLogin(user_id, token)
 */
LOGIN.prototype.login = async function (user_id, token) {
    try {
        if (!user_id) {
            throw new Error('cookie is required: user_id');
        }
        if (!token) {
            throw new Error('cookie is required: token');
        }
        return await verifyToken(user_id, token);
    } catch (err) {
        throw err;
    }
}

module.exports = function () {
    return async function (ctx, next) {
        console.log('---login check');
        const url = ctx.request.url;
        const user_id = util.getCookie('performance.monitor.user', ctx.request.header.cookie);
        const token = util.getCookie('performance.monitor.token', ctx.request.header.cookie);

        if ((url.includes('/login') && !token && !user_id) || url.includes('/js/') || url.includes('reportPerformance')) {
            return await next();
        }

        const login = LOGIN.init();
        const loginUrl = login.getLoginUrl(`${SYSTEM.PROTOCOL}://${SYSTEM.PRODORIGIN}${url}`);
        if (url === '/favicon.ico') {
            return
        }
        if (user_id && token) {
            const result = await login.login(user_id, token);
            if (result) {
                console.log('-- login successfully, start to render.')
                return await next();
            } else {
                console.log('-- check fail, go to login page.')
                ctx.redirect(loginUrl);
            }
            return
        }
        if (url.includes('ReturnUrl')) {
            return
        }
        console.log('-- not login, go to login page.')
        ctx.redirect(loginUrl);
    }
}
