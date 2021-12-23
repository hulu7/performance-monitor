new Vue({
    el: '#index',
    data: function(){
        return{
            datalist:[]
        }
    },
    beforeMount(){
        this.getDataList()
    },
    methods:{
        getDataList() {
            let _this = this;
            util.ajax({
                url: `${config.baseApi}api/system/list`,
                success(data){
                    _this.datalist=data.data
                }
            })
        },
        getDetail(item) {
            location.href=`/apps?systemId=${item.id}`
        },
        goToSetting(item) {
            location.href=`/setting?systemId=${item.id}`
        }
    }
})