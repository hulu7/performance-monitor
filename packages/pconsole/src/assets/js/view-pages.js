new Vue({
    el: '#pages',
    data: function(){
        return{
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            slow:util.getQueryString('type'),
            beginTime:'',
            endTime:'',
            isLoadend:false,
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
        goHome() {
            window.location.href = '/';
        },
        getinit(){
            this.systemId = util.queryParameters('systemId');
            this.isLoadend=false;
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
                    this.isLoadend=true;
                    if(!data.data.datalist&&!data.data.datalist.length)return;
                    this.listdata = data.data.datalist;
                    new Page({
                         parent: $("#copot-page"),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                             this.pageNo = nowPage;
                             this.getinit();
                         }
                     });
                }
            })
        },
        gotodetail(item){
            if(this.slow && this.slow=='slow'){
                location.href=`/slowpages/detail?systemId=${this.systemId}`;
            } else {
                location.href=`/pages/detail?systemId=${this.systemId}&&url=${item.url}`;
            }
        }
    }
})