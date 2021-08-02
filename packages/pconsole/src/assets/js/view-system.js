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
        getDataList(){
            let _this = this;
            util.ajax({
                url: `${config.baseApi}api/system/getSystemList`,
                success(data){
                    _this.datalist=data.data
                }
            })
        },
        getDetail(item){
            util.setStorage('local','systemMsg', JSON.stringify(item))
            location.href=`/pages?systemId=${item.id}`
        },
        goToSetting(item){
            util.setStorage('local','systemMsg', JSON.stringify(item))
            location.href=`/setting?systemId=${item.id}`
        }
    }
})