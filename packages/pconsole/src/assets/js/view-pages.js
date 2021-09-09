new Vue({
    el: '#pages',
    data: function(){
        return{
            listdata: [],
            pageNo: 1,
            pageSize: config.pageSize,
            total: 0,
            currentPage: 1,
            slow: util.getQueryString('type'),
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
        getinit(){
            this.systemId = util.queryParameters('systemId');
            this.isLoading = true;
            let times = util.getSearchTime();
            this.beginTime = times.beginTime;
            this.endTime = times.endTime;
            
            let api = '';

            if(this.slow && this.slow == 'slow') {
                api = 'api/slowpages/getSlowpagesList'
            }else{
                api = 'api/pages/getPageList'
            }

            util.ajax({
                url: `${config.baseApi}${api}`,
                data:{
                    systemId: util.queryParameters('systemId'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    beginTime: this.beginTime ,
                    endTime: this.endTime ,
                },
                success:data => {
                    this.isLoading = false;
                    if(!data.data.datalist&&!data.data.datalist.length) {
                        return;
                    }
                    data.data.datalist.forEach(page => {
                        page.url = util.getPageUrl(page.url);
                    });
                    this.listdata = data.data.datalist;
                    this.total = data.data.totalNum;
                }
            })
        },
        gotodetail(item){
            if(this.slow && this.slow=='slow'){
                location.href=`/slowpages/detail?systemId=${this.systemId}`;
            } else {
                location.href=`/pages/detail?systemId=${this.systemId}&pageId=${item.pageId}`;
            }
        }
    }
})