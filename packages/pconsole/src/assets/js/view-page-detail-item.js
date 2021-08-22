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
                    if(this.pagesItemData.mainRestiming && JSON.parse(this.pagesItemData.mainRestiming).length > 0) {
                        util.drawWaterfall('main-app', JSON.parse(this.pagesItemData.mainRestiming));
                    } else {
                        this.emptyHint('main-app');
                    }
                    if (this.pagesItemData.restiming && JSON.parse(this.pagesItemData.restiming).length > 0) {
                        util.drawWaterfall('sub-app', JSON.parse(this.pagesItemData.restiming));
                    } else {
                        this.emptyHint('sub-app');
                    }
                }
            })
        },
    }
})