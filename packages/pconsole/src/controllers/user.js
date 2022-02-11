import {
    SYSTEM
} from '../config'
import {
    util,
} from '../tool'
import UserService from '../services/userService'

class User {
    //初始化对象
    constructor() {};

    // 登录
    async login(ctx) {
        try {
            const {
                userName: name,
                passWord: password
            } = ctx.request.body;
            let data = {};
            if (!name || !password) {
                ctx.body = util.result({
                    data
                });
                return 
            }
            const resp = await UserService.getUserByName(name);
            if (resp.length) {
                const {
                    id,
                    user_name: userName,
                    password: userPassword,
                    login_expire_time: expireTime,
                    is_permit,
                    token
                } = resp[0].dataValues;
                const now = new Date().valueOf();
                const expire = new Date(expireTime).valueOf();
                if (userPassword !== password) {
                    await UserService.updateUser(id, {
                        token: '',
                        login_expire_time: now
                    })
                    ctx.body = util.result({
                        code: 1004,
                        desc: '密码不正确！'
                    });
                    return;
                }

                if (is_permit === 1) {
                    ctx.body = util.result({
                        code: 1005,
                        desc: '已禁止访问！'
                    });
                    return;
                }

                const newToken = util.convert2Md5(`${userName}${now}${userPassword}`);
                const newExpireTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
                if(expire < now) {
                    await UserService.updateUser(id, {
                        token: newToken,
                        login_expire_time: newExpireTime,
                    })
                }
                const cookieOptions = {
                    domain: '.jdcloud.com',
                    path: '/',
                    httpOnly: true,
                    secure: SYSTEM.PROTOCOL === 'https',
                    maxAge: 86400000,
                    overwrite: false
                }

                ctx.cookies.set('performance.monitor.user', id, cookieOptions);
                ctx.cookies.set('performance.monitor.token', expire < now ? newToken : token, cookieOptions);
                const returnUrl = ctx.request.header.referer.split('ReturnUrl=')[1];
                ctx.body = util.result({
                    data: {
                        returnUrl
                    }
                });
                return
            }
            ctx.body = util.result({
                code: 1003,
                desc: '用户不存在!'
            });
        } catch (err) {
            console.error(err);
            ctx.body = util.result({
                code: 1001,
                desc: '登录失败!'
            });
            return '';
        }
    }

    // 新增用户
    async register(ctx) {
        try {
            const {
                userName,
                userPassword,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                systemIds,
                level
            } = ctx.request.body;
            if(!userName || !userPassword) {
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            // 判断用户名是否存在
            const resp = await UserService.getUserByName(user_name);
            if(resp.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '用户已存在，请重新填写!'
                });
                return
            }

            const create_time = new Date(new Date().getTime()).toISOString();
            // 插入数据
            const data = {
                create_time,
                user_name: userName,
                password: userPassword,
                user_img: userImg,
                user_phone: userPhone,
                user_email: userEmail,
                is_permit: isPermit || 0,
                system_ids: systemIds || '',
                level: level || 1
            }

            await UserService.createUser(data);
            
            const result = await UserService.getUserByName(userName);
            if (result.length) {
                ctx.body = util.result({
                    data: result[0].dataValues
                });
                return
            }

            ctx.body = util.result({
                code: 1002,
                desc: '添加用户失败，请重新添加!',
                err
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

    // 登出
    async logout(ctx) {
        try {
            const cookieOptions = {
                maxAge: -1,
            }
            ctx.cookies.set('performance.monitor.user', '', cookieOptions);
            ctx.cookies.set('performance.monitor.token', '', cookieOptions);
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

    // 更新用户信息
    async update(ctx) {
        try {
            const {
                userName,
                userPassword,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                systemIds,
                level
            } = ctx.request.body;

            if(!userName || !userPassword) {
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            const resp = await UserService.getUserByName(userName);
            const { id } = resp[0].dataValues;
            // 插入数据
            const data = {
                user_name: userName,
                password: userPassword,
                user_img: userImg,
                user_phone: userPhone,
                user_email: userEmail,
                is_permit: isPermit || 0,
                system_ids: systemIds || '',
                level: level || 1
            }

            await UserService.updateUser(id, data);

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

    // 获取用户详情
    async userInfo(ctx) {
        const {
            cookie
        } = ctx.request.header;
        try {
            const userId = util.getCookie('performance.monitor.user', cookie);
            const resp = await UserService.getUserById(userId);
            if (resp && resp.length) {
                const {
                    user_name: userName,
                    user_img: userImg,
                    system_ids: systemIds,
                    level
                } = resp[0].dataValues;
                const data = {
                    userName,
                    userImg,
                    systemIds,
                    level
                }
                ctx.body = util.result({
                    data
                });
                return
            }
            ctx.body = util.result({
                code: 1003,
                desc: '用户不存在!'
            });
        } catch (err) {
            console.error(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
        }
    }
}

module.exports = new User();

