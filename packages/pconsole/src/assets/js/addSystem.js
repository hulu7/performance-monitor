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
            uuid: ''
        }
    },
    beforeMount() {
        this.uuid = util.getQueryString('uuid')
        if(this.uuid){
            this.getDetail()
        }
    },
    mounted(){},
    methods:{
        getDetail(){
            let _this=this;
            util.ajax({
                url: `${config.baseApi}api/system/detail`,
                data: {
                    uuid: this.uuid
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
        addSystem() {
            let _this=this;
            if(!this.systemName){
                this.$message({
                    message: '请正确填写系统名称!',
                    type: 'warning'
                });
                return false;
            }
            if(!this.systemDomain || !util.isValidDomain(this.systemDomain)) {
                this.$message({
                    message: '请正确填写系统域名!',
                    type: 'warning'
                });
                return false;
            }
            util.ajax({
                url: `${config.baseApi}api/system/add`,
                data:{
                    systemName: this.systemName,
                    systemDomain: this.systemDomain,
                    slowPageTime: this.slowPageTime,
                    slowJsTime: this.slowJsTime,
                    slowCssTime: this.slowCssTime,
                    slowImgTime: this.slowImgTime
                },
                success(data) {
                    _this.scriptstr = data.data.script;
                    this.$message({
                        message: '系统添加成功！',
                        type: 'success'
                      });
                }
            })
        },
        copy() {
            if (this.scriptstr && util.copy(this.scriptstr)) {
                this.$message({
                    message: '已拷贝至剪贴板!',
                    type: 'success'
                  });
            } else {
                this.$message.error('拷贝失败! 请重试');
            }
        }
    }
})