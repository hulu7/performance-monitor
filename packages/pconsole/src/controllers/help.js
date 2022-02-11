import fs from 'fs'
import path from 'path'
import marked from 'marked'
import {
    util,
} from '../tool'

class Help {
    //初始化对象
    constructor() {
    };

    // 获得help.md
    async getHelpDoc(ctx) {
        try {
            const content = fs.readFileSync(path.resolve(__dirname, '../assets/other/help.md')).toString();
            const render = marked(content, { sanitize: true });
            ctx.body = util.result({
                data: render
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

module.exports = new Help();

