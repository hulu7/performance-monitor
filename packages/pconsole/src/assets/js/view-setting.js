new Vue({
    el: '#setting',
    data: function(){
        return{
            table: 1,
            setting: {
                systemName: '',
                systemDomain: '',
                slowPageTime: '',
                slowJsTime: '',
                slowCssTime: '',
                slowImgTime: ''
            },
            systemInfo: {},
            systemId: '',
            enable: true
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
    },
    mounted(){
        this.getDetail();
    },
    methods:{
        goHome() {
            window.location.href = '/';
        },
        getDetail() {
            this.systemId = util.queryParameters('systemId');
            util.ajax({
                url: `${config.baseApi}api/system/getItemSystem`,
                data:{
                    systemId: this.systemId
                },
                success:data=>{
                    this.systemInfo = data.data || {};
                    this.enable = this.systemInfo.isUse === 0;
                    this.pagexingneng();
                }
            });
        },
        // 设置项目是否接收数据
        settingIsUse() {
            const { systemId } = this;
            util.ajax({
                url: `${config.baseApi}api/system/isStatisData`,
                data: {
                    systemId,
                    key:'isUse',
                    value: this.enable ? 0 : 1
                },
                success: data => {
                    popup.miss({title:'操作成功!'})
                }
            });
        },
        updateSystem() {
            if(!this.systemInfo.systemName){ popup.alert({title: '请正确填写应用名称!'});  return false; }
            if(!this.systemInfo.systemDomain){ popup.alert({title: '请正确填写应用域名!'}); return false; }
            util.ajax({
                url:config.baseApi + 'api/system/updateSystem',
                data:this.systemInfo,
                success:data=>{
                    popup.miss({title:"操作成功！"});
                }
            })
        },
        changeTable(number){
            this.table = number
        },
        // 页面性能指标
        pagexingneng(){
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch-item'));
            elems.forEach((html,index)=>{
                switch(index){
                    case 0:
                        html.checked = this.systemInfo.isStatisiPages==0?true:false;
                        break;
                    case 1:
                        html.checked = this.systemInfo.isStatisiAjax==0?true:false;
                        break;
                    case 2:
                        html.checked = this.systemInfo.isStatisiResource==0?true:false;
                        break;
                    case 3:
                        html.checked = this.systemInfo.isStatisiSystem==0?true:false;
                        break;
                    case 4:
                        html.checked = this.systemInfo.isStatisiError==0?true:false;
                        break;
                }
                var switchery = new Switchery(html,{ color: '#2077ff'});
                html.onchange = ()=> {
                    let value = html.checked?0:1
                    switch(index){
                        case 0:
                            this.setDatas('isStatisiPages',value)
                            break;
                        case 1:
                            this.setDatas('isStatisiAjax',value)
                            break;
                        case 2:
                            this.setDatas('isStatisiResource',value)
                            break;
                        case 3:
                            this.setDatas('isStatisiSystem',value)
                            break;
                        case 4:
                            this.setDatas('isStatisiError',value)
                            break;
                    }
                }

            });
        },
        setDatas(key,value){
            util.ajax({
                url:config.baseApi+'api/system/isStatisData',
                data:{
                    key:key,
                    value:value
                },
                success:data=>{
                    popup.miss({title:'操作成功!'})
                }
            }) 
        }
        
    }
})