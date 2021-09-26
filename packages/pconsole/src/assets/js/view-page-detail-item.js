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
            url: '',
            app: '',
            totalRequestCount: 0,
            totalDuration: 0,
            isLoading: true
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
            this.app = util.getQueryString('app');
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
        drawAddInfo(addInfo) {
            this.totalRequestCount = addInfo.totalCount;
            this.totalDuration = addInfo.totalDuration;
            for (let app of addInfo.apps) {
                util.drawApiRank(`${app.key}-static-rank`, app.static);
                util.drawApiRank(`${app.key}-api-rank`, app.api);
            }
        },
        drawNetworkStream(restiming) {
            if (restiming && JSON.parse(restiming).length > 0) {
                const apps = {};
                const count = {};
                const restimings = JSON.parse(restiming);
                restimings.forEach(item => {
                    const key = hex_md5(item.app);
                    if (!apps[key]) {
                        apps[key] = {
                            app: item.app,
                            restiming: [item]
                        };
                        count[key] = 1;
                    } else {
                        apps[key].restiming.push(item);
                        count[key] += 1;
                    }
                });
                
                util.drawWaterfall('all-data', restimings);
                const parent = document.getElementById('network-stream');
                for (let key in apps) {
                    if (apps[key].app === 'other') {
                        continue;
                    }
                    const title = document.createElement('h2');
                    const oText = document.createTextNode(`${apps[key].app === 'main' ? '主' : '子'}应用数据 (${count[key]})`);
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
        getPageItemForId() {
            this.isLoading = true;
            const api = `api/${this.type && this.type === 'slow' ? 'slowpages/getslowPageItemForId' : 'pages/getPageItemForId'}`;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}${api}`,
                data: {
                    id
                },
                success: data => {
                    this.isLoading = false;
                    data.data.add.apps.reverse();
                    this.pagesItemData = data.data;
                    this.url = this.pagesItemData.url;
                    this.drawNetworkStream(this.pagesItemData.restiming);
                    setTimeout(() => {
                        this.drawAddInfo(this.pagesItemData.add);
                    }, 100);
                }
            })
        },
    }
})