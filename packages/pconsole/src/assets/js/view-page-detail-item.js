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
            mainDups: [],
            subDups: [],
            mainDuration: 0,
            subDuration: 0
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
        drawApiRank(restiming) {
            if (restiming && JSON.parse(restiming).length > 0) {
                let mainStart = 0;
                let subStart = 0;
                let mainEnd = 0;
                let subEnd = 0;
                var categories = {};
                var dups = {};
                const restimings = JSON.parse(restiming);
                restimings.forEach(item => {
                    if (item.app !== 'other') {
                        const key = hex_md5(item.app);
                        const dat = {
                            name: item.name,
                            value: item.responseEnd - item.startTime
                        };
                        if (!categories[key]) {
                            Object.assign(categories, {
                                [key]: {
                                    static: [],
                                    api: [],
                                    dups: [],
                                    app: item.app
                                }
                            });
                            Object.assign(dups, {
                                [key]: [item.name]
                            });
                        }
                        if (util.isStaticSource(item.name)) {
                            categories[key].static.push(dat);
                        } else {
                            categories[key].api.push(dat);
                        }
                        if (dups[key].indexOf(item.name) !== -1) {
                            const target = categories[key].dups.find(i => i.url === item.name);
                            if (target) {
                                (categories[key].dups[categories[key].dups.indexOf(target)]).count = target.count + 1;
                            } else {
                                categories[key].dups.push({
                                    url: item.name,
                                    count: 1
                                });
                            }
                        } else {
                            dups[key].push(item.name);
                        }
                        if (item.app === 'main') {
                            if (item.startTime < mainStart) {
                                mainStart = item.startTime
                            }
                            if (mainEnd < item.responseEnd) {
                                mainEnd = item.responseEnd
                            }
                        } else {
                            if (item.startTime < subStart) {
                                subStart = item.startTime
                            }
                            if (subEnd < item.responseEnd) {
                                subEnd = item.responseEnd
                            }
                        }
                    }
                });
                this.mainDuration = mainEnd - mainStart;
                this.subDuration = subEnd - subStart;
            }
            for (let app in  categories) {
                categories[app].api.sort((pre, post) => post.value - pre.value);
                categories[app].static.sort((pre, post) => post.value - pre.value);
                categories[app].dups.sort((pre, post) => post.count - pre.count);
            }
            for (let app in  categories) {
                if (categories[app].app === 'main') {
                    const staticCategory = {
                        names: [],
                        values: []
                    };
                    const apiCategory = {
                        names: [],
                        values: []
                    };
                    staticCategory.names = categories[app].static.map(i => i.name);
                    staticCategory.values = categories[app].static.map(i => i.value);
                    util.drawApiRank('main-static-rank', staticCategory);
                    apiCategory.names = categories[app].api.map(i => i.name);
                    apiCategory.values = categories[app].api.map(i => i.value);
                    util.drawApiRank('main-api-rank', apiCategory);
                    this.mainDups = categories[app].dups;
                } else {
                    const subStaticCategory = {
                        names: [],
                        values: []
                    };
                    const subApiCategory = {
                        names: [],
                        values: []
                    };
                    subStaticCategory.names = categories[app].static.map(i => i.name);
                    subStaticCategory.values = categories[app].static.map(i => i.value);
                    util.drawApiRank('sub-static-rank', subStaticCategory);
                    subApiCategory.names = categories[app].api.map(i => i.name);
                    subApiCategory.values = categories[app].api.map(i => i.value);
                    util.drawApiRank('sub-api-rank', subApiCategory);
                    this.subDups = categories[app].dups;
                }
            }
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
                    if (apps[key].app === 'other') {
                        continue;
                    }
                    const title = document.createElement('h2');
                    const oText = document.createTextNode(`${apps[key].app === 'main' ? '主' : '子'}应用数据`);
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
                    this.drawApiRank(this.pagesItemData.restiming);
                }
            })
        },
    }
})