
new Vue({
    el: '#app',
    data: function(){
        return{
            listdata: [],
            pageNo: 1,
            pageSize: config.pageSize,
            total: 0,
            currentPage: 1,
            isLoading: false,
            systemId: ''
        }
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
                url: `${config.baseApi}api/system/detail`,
                data: {
                    systemId: this.systemId
                },
                success: data => {
                    this.systemInfo = data.data || {};
                    this.listdata = pages.data.data;
                    this.total = pages.data.total;
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
                url: `${config.baseApi}api/apps/list`,
                data: {
                    systemId: util.queryParameters('systemId'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                },
                success: resps => {
                    this.isLoading = false;
                    if(!resps.data.data && !resps.data.data.length) {
                        return;
                    }
                    this.getDetail(resps);
                }
            })
        },
        gotodetail(item){
            location.href=`/app/overview?systemId=${this.systemId}&appId=${item.appId}`;
        }
    }
})