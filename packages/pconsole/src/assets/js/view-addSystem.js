new Vue({
    el: '#addSystem',
    data: function(){
        return{
            systemDomain: '',
            systemName: '',
            scriptstr: '',
            slowPageTime: '',
            slowJsTime: '',
            slowCssTime: '',
            slowImgTime: '',
            appId: '',
            subSystems: [{
                name: 'main',
                rule: '/'
            }]
        }
    },
    beforeMount() {
        this.appId = util.getQueryString('appId')
        if(this.appId){
            this.getDetail()
        }
    },
    mounted(){
        
    },
    methods:{
        getDetail(){
            let _this=this;
            util.ajax({
                url: `${config.baseApi}api/system/getItemSystem`,
                data: {
                    appId:this.appId
                },
                success(data){
                    _this.systemDomain = data.data.systemDomain
                    _this.systemName = data.data.systemName
                    _this.scriptstr = data.data.script
                    _this.slowPageTime = data.data.slowPageTime
                    _this.slowJsTime = data.data.slowJsTime
                    _this.slowCssTime = data.data.slowCssTime
                    _this.slowImgTime = data.data.slowImgTime
                }
            })
        },
        addSystem(){
            let _this=this;
            if(!this.systemName){ popup.alert({title: '请正确填写应用名称!'});  return false; }
            if(!this.systemDomain){ popup.alert({title: '请正确填写应用地址!'}); return false; }
            if (!this.subSystems.length) {
                this.subSystems = [{
                    name: 'main',
                    rule: '/'
                }];
            }
            util.ajax({
                url: `${config.baseApi}api/system/addSystem`,
                data:{
                    systemName: this.systemName,
                    systemDomain: this.systemDomain,
                    slowPageTime: this.slowPageTime,
                    slowJsTime: this.slowJsTime,
                    slowCssTime: this.slowCssTime,
                    slowImgTime: this.slowImgTime,
                    subSystems: JSON.stringify(this.subSystems)
                },
                success(data) {
                    _this.scriptstr = data.data.script
                    popup.miss({title:"系统添加成功！"});
                }
            })
        },
        addNewSubsystem() {
            this.subSystems.push({
                name: '',
                rule: ''
            });
        },
        deleteSubsystem(index) {
            if (this.subSystems.length < 2) {
                return;
            }
            this.subSystems.splice(index, 1);
        },
        copy() {
            if (this.scriptstr && util.copy(this.scriptstr)) {
                popup.miss({title:'已拷贝至剪贴板!'})
            } else {
                popup.alert({ type: 'msg', title: '拷贝失败! 请重试' })
            }
        }
    }
})