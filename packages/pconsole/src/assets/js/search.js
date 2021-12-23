new Vue({
    el: '#search',
    data: () => {
        return{
            listdata:[],
            pageSize: 10,
            total: 0,
            isLoading: false,
            systemId: '',
            currentPage: 1,
            keys: ''
        }
    },
    filters:{
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
    mounted(){
        this.init();
    },
    methods:{
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.search();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.search();
        },
        search() {
            const { keys } = this;
            if (!keys) {
                return;
            }
            this.isLoading = true;
            util.ajax({
                url: `${config.baseApi}api/search`,
                data: {
                    keys,
                    from: (this.currentPage - 1) * this.pageSize,
                    size: this.pageSize
                },
                success: (response) => {
                    const { total, data } = response;
                    this.total = total;
                    this.listdata = data;
                    this.isLoading = false;
                }
            });
        },
        goHome() {
            window.location.href = '/';
        },
        init() {
            this.systemId = util.queryParameters('systemId');
        },
        gotoDetail(item) {
            window.open(`/app/detail/item?systemId=${this.systemId}&&id=${item.id}`, `_blank`);
        }
    }
})