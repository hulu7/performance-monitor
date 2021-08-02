new Vue({
    el: '#pagesDetail',
    data(){
        return{
            id: util.getQueryString('id'),
            type: util.getQueryString('type'),
            pagesItemData: {},
            sourceslist: [],
            systemId: ''
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
        },
        emptyHint(id) {
            const label = document.createElement("label");
            label.innerHTML = '暂无数据';
            const e = document.getElementById(id);
            if (!e) {
                return;
            }
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