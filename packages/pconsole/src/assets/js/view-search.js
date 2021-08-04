new Vue({
    el: '#search',
    data: () => {
        return{
            listdata:[],
            pageNo: 1,
            pageSize: 10,
            total: 0,
            isLoading: false,
            systemId: '',
            currentPage: 1,
            keys: ''
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
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
            this.isLoading = true;
            const { keys } = this;
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
            location.href=`/pages/detail?systemId=${this.systemId}&&url=${item.url}`;
        }
    }
})