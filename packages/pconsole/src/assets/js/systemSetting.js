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
                slowImgTime: '',
                enable: true
            },
            systemInfo: {},
            systemId: '',
        }
    },
    filters:{
        toFixed: window.Filter.toFixed
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
                url: `${config.baseApi}api/system/detail`,
                data: {
                    systemId: this.systemId
                },
                success: data => {
                    this.systemInfo = data.data || {};
                    const {
                        isUse, systemName, systemDomain
                    } = this.systemInfo;

                    Object.assign(this.setting, {
                        systemDomain,
                        systemName,
                        enable: isUse === 0
                    });
                }
            });
        },
        // 设置项目是否接收数据
        settingIsUse() {
            const { systemId } = this;
            util.ajax({
                url: `${config.baseApi}api/system/required`,
                data: {
                    systemId,
                    key:'isUse',
                    value: this.setting.enable ? 0 : 1
                },
                success: data => {
                    this.getDetail();
                    this.$message({
                        message: '操作成功!',
                        type: 'success',
                        offset: 60
                      });
                }
            });
        },
        updateSystem() {
            if(!this.systemInfo.systemName) {
                this.$message.error('请正确填写系统名称!');
                return false;
            }
            if(!this.systemInfo.systemDomain || !util.isValidDomain(this.systemInfo.systemDomain)) {
                this.$message.error('请正确填写系统域名!');
                return false;
            }
            const {
                systemDomain,
                systemName,
                enable
            } = this.setting;
            Object.assign(this.systemInfo, {
                systemDomain,
                systemName,
                isUse: enable ? 0 : 1
            });
            util.ajax({
                url: `${config.baseApi}api/system/update`,
                data: this.systemInfo,
                success: data => {
                    this.$message({
                        message: '操作成功!',
                        type: 'success',
                        offset: 60
                      });
                    this.getDetail();
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
        setDatas(key, value) {
            util.ajax({
                url: `${config.baseApi}api/system/required`,
                data: {
                    key,
                    value
                },
                success: data => {
                    this.getDetail();
                    this.$message({
                        message: '操作成功!',
                        type: 'success',
                        offset: 60
                      });
                }
            }) 
        },
        copy() {
            if (this.systemInfo.script && util.copy(this.systemInfo.script)) {
                this.$message({
                    message: '已拷贝至剪贴板!',
                    type: 'success',
                    offset: 60
                  });
            } else {
                this.$message.error('拷贝失败! 请重试');
            }
        }
    }
})