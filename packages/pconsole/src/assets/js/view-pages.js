
new Vue({
    el: '#pages',
    data: function(){
        return{
            listdata: [],
            pageNo: 1,
            pageSize: config.pageSize,
            total: 0,
            currentPage: 1,
            beginTime: '',
            endTime: '',
            isLoading: false,
            systemId: ''
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
    },
    mounted(){
        this.getinit();
    },
    methods:{
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getinit();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getinit();
        },
        goHome() {
            window.location.href = '/';
        },
        getDetail(pages) {
            util.ajax({
                url: `${config.baseApi}api/system/getItemSystem`,
                data: {
                    systemId: this.systemId
                },
                success: data => {
                    this.systemInfo = data.data || {};
                    this.listdata = pages.data.datalist;
                    this.total = pages.data.totalNum;
                }
            });
        },
        getinit() {
            this.systemId = util.queryParameters('systemId');
            this.isLoading = true;
            let times = util.getSearchTime();
            this.beginTime = times.beginTime;
            this.endTime = times.endTime;

            util.ajax({
                url: `${config.baseApi}api/apps/getAppsList`,
                data: {
                    systemId: util.queryParameters('systemId'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    beginTime: this.beginTime,
                    endTime: this.endTime
                },
                success: data => {
                    this.isLoading = false;
                    if(!data.data.datalist && !data.data.datalist.length) {
                        return;
                    }
                    this.getDetail(data);
                }
            })
        },
        gotodetail(item){
            location.href=`/apps/detail?systemId=${this.systemId}&appId=${item.appId}`;
        }
    }
})