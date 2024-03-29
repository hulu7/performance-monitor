new Vue({
    el: '#appDetail',
    data() {
        return {
            id: util.getQueryString('id'),
            type: util.getQueryString('type'),
            pagesItemData: {
                basic: {},
                timing: {},
                restiming: {},
                client: {},
                resources: {}
            },
            sourceslist: [],
            systemId: '',
            appId: '',
            url: '',
            totalRequestCount: 0,
            totalDuration: 0,
            isLoadingBasic: false,
            isLoadingClients: false,
            isLoadingResources: false,
            isLoadingRestimings: false,
            isLoadingTiming: false
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
    beforeMount() {
        this.init();
        this.getWebPageBasic();
        this.getWebPageRestimings();
        this.getWebPageClients();
        this.getWebPageResources();
        this.getWebPageTiming();
    },
    mounted() { },
    methods: {
        init() {
            this.systemId = util.queryParameters('systemId');
            this.appId = util.getQueryString('appId');
        },
        goHome() {
            window.location.href = '/';
        },
        goToPages() {
            window.location.href = `/apps?systemId=${this.systemId}`;
        },
        goToPageHistory() {
            window.location.href = `/app/overview?systemId=${this.systemId}&appId=${this.appId}`;
        },
        copy() {
            if (this.pagesItemData.basic.url && util.copy(this.pagesItemData.basic.url)) {
                this.$message({
                    message: '已拷贝至剪贴板!',
                    type: 'success',
                    offset: 60
                });
            } else {
                this.$message.error('拷贝失败! 请重试');
            }
        },
        gotopage() {
            window.open(`${this.pagesItemData.basic.url}`, `_blank`);
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
                            restiming: [item],
                            isMain: item.is_main
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
                    const title = document.createElement('h2');
                    const oText = document.createTextNode(`${apps[key].isMain ? '主应用'
                        : (apps[key].app === 'unknown' ? '其他资源' : '子应用')}${apps[key].app === 'unknown' ? '' : apps[key].app}数据 (${count[key]})`);
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
        getWebPageBasic() {
            this.isLoadingBasic = true;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}api/apps/basic`,
                data: {
                    id
                },
                success: resps => {
                    this.isLoadingBasic = false;
                    this.pagesItemData.basic = resps.data;
                    this.url = this.pagesItemData.basic.url;
                }
            })
        },
        getWebPageRestimings() {
            this.isLoadingRestimings = true;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}api/apps/restimings`,
                data: {
                    id
                },
                success: resps => {
                    this.isLoadingRestimings = false;
                    this.pagesItemData.restiming = resps.data;
                    setTimeout(() => {
                        this.drawNetworkStream(this.pagesItemData.restiming.restiming);
                        this.drawAddInfo(this.pagesItemData.restiming.add);
                    }, 100);
                }
            })
        },
        getWebPageClients() {
            this.isLoadingClients = true;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}api/apps/clients`,
                data: {
                    id
                },
                success: resps => {
                    this.isLoadingClients = false;
                    this.pagesItemData.client = resps.data;
                }
            })
        },
        getWebPageResources() {
            this.isLoadingResources = true;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}api/apps/resources`,
                data: {
                    id
                },
                success: resps => {
                    this.isLoadingResources = false;
                    this.pagesItemData.resources = resps.data;
                }
            })
        },
        getWebPageTiming() {
            this.isLoadingTiming = true;
            const { id } = this;
            util.ajax({
                url: `${config.baseApi}api/apps/timing`,
                data: {
                    id
                },
                success: resps => {
                    this.isLoadingTiming = false;
                    this.pagesItemData.timing = resps.data;
                }
            })
        },
    }
})