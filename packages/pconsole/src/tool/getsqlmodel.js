// import sql from 'sql'

//config配置
class getsqlmodel {
    constructor() {
        sql.setDialect('mysql');
    }

    /* sql预处理工具：https://github.com/brianc/node-sql */

    system() {
        // return sql.define({
        //     name: 'web_system',
        //     columns: [
        //         'id', 'uuid', 'system_domain', 'system_name',
        //         'script', 'is_use', 'create_time', 'slow_page_time',
        //         'slow_js_time', 'slow_css_time', 'slow_img_time',
        //         'slow_ajax_time', 'is_monitor_pages', 'is_monitor_ajax',
        //         'is_monitor_resource', 'is_monitor_system'
        //     ]
        // });
    };

    basic() {
        // return sql.define({
        //     name: 'web_pages_basic',
        //     columns: [
        //         'id', 'page_id', 'system_id', 'app_id',
        //         'user_id', 'app_name', 'is_main', 'url',
        //         'create_time', 'mark_page', 'additional_info'
        //     ]
        // });
    };
}

module.exports = new getsqlmodel();