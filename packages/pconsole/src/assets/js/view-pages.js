
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
        getDetail(pages) {
            util.ajax({
                url: `${config.baseApi}api/system/getItemSystem`,
                data: {
                    systemId: this.systemId
                },
                success: data => {
                    this.systemInfo = data.data || {};
                    const { subSystems } = this.systemInfo;
                    const subs = JSON.parse(subSystems);

                    pages.data.datalist.forEach(page => {
                        page.url = util.getPageUrl(page.url);
                        Object.assign(page, { app: '主应用' });
                        for (let item of subs) {
                            if (page.url.search(item.rule) !== -1) {
                                page.app = item.name;
                                break;
                            }
                        }
                    });
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
            
            let api = '';

            if(this.slow && this.slow == 'slow') {
                api = 'api/slowpages/getSlowpagesList'
            }else{
                api = 'api/pages/getPageList'
            }

            util.ajax({
                url: `${config.baseApi}${api}`,
                data: {
                    systemId: util.queryParameters('systemId'),
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    beginTime: this.beginTime ,
                    endTime: this.endTime ,
                },
                success: data => {
                    this.isLoading = false;
                    if(!data.data.datalist&&!data.data.datalist.length) {
                        return;
                    }
                    this.getDetail(data);
                }
            })
        },
        gotodetail(item){
            if(this.slow && this.slow=='slow'){
                location.href=`/slowpages/detail?systemId=${this.systemId}`;
            } else {
                location.href=`/pages/detail?systemId=${this.systemId}&pageId=${item.pageId}&app=${item.app}`;
            }
        }
    }
})