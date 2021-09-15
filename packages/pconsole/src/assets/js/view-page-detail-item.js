new Vue({
    el: '#pagesDetail',
    data(){
        return{
            id: util.getQueryString('id'),
            type: util.getQueryString('type'),
            pagesItemData: {},
            sourceslist: [],
            systemId: '',
            pageId: '',
            url: ''
        }
    },
    filters: {
        toFloat1: (input) => {
            return input ? parseFloat(input).toFixed(1) : 0.0;
        },
        toInit: (input) => {
            return input ? Math.floor(input) : 0;
        },
        toFixed: window.Filter.toFixed,
        toSize: window.Filter.toSize,
        date: window.Filter.date,
        limitTo: window.Filter.limitTo
    },
    beforeMount(){
        this.init();
        this.getPageItemForId();
    },
    mounted(){
    },
    methods: {
        init() {
            this.systemId = util.queryParameters('systemId');
            this.pageId = util.getQueryString('pageId');
        },
        goHome() {
            window.location.href = '/';
        },
        goToPages() {
            window.location.href = `/pages?systemId=${this.systemId}`;
        },
        goToPageHistory() {
            window.location.href = `/pages/detail?systemId=${this.systemId}&pageId=${this.pageId}`;
        },
        emptyHint(id) {
            const e = document.getElementById(id);
            if (!e) {
                return;
            }
            const label = document.createElement("label");
            label.innerHTML = '暂无数据';
            e.appendChild(label);
        },
        drawNetworkStream(restiming) {
            if (restiming && JSON.parse(restiming).length > 0) {
                const apps = {};
                const restimings = JSON.parse(restiming);
                restimings.forEach(item => {
                    const key = hex_md5(item.app);
                    if (!apps[key]) {
                        apps[key] = {
                            app: item.app,
                            restiming: [item]
                        };
                    } else {
                        apps[key].restiming.push(item);
                    }
                });
                
                util.drawWaterfall('all-data', restimings);
                const parent = document.getElementById('network-stream');
                for (let key in apps) {
                    const title = document.createElement('h2');
                    const oText = document.createTextNode(`${apps[key].app === 'other' ? '其他' : apps[key].app + ' 应用'}`);
                    title.setAttribute('class', 'waterfall-title');
                    title.appendChild(oText);
                    const content = document.createElement('div');
                    content.setAttribute('class', 'waterfall-content');
                    content.setAttribute('id', key);
                    parent.appendChild(title);
                    parent.appendChild(content);
                    util.drawWaterfall(key, apps[key].restiming);
                }
            }
        },
        // 获得页面请求性能详情
        getPageItemForId(){
            const api = `api/${this.type && this.type === 'slow' ? 'slowpages/getslowPageItemForId' : 'pages/getPageItemForId'}`;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}${api}`,
                data: {
                    id
                },
                success: data => {
                    this.pagesItemData = data.data;
                    this.url = this.pagesItemData.url;
                    this.drawNetworkStream(this.pagesItemData.restiming);
                }
            })
        },
    }
})