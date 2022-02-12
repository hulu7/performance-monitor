new Vue({
    el: '#header',
    data: function() {
        return{
            isAdmin: false,
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init() {
            await this.getUserInfo();
        },
        getUserInfo() {
            util.ajax({
                url: `${config.baseApi}api/user/info`,
                data:{},
                success: resp => {
                    if(resp && resp.data) {
                        this.isAdmin = resp.data.level === 1;
                    }
                }
            })
        },
        logout() {
            util.ajax({
                url: `${config.baseApi}api/user/logout`,
                data:{},
                success: resp => {
                    this.$message({
                        message: '成功退出登录！',
                        type: 'success',
                        offset: 60
                      });
                    window.location.href = '/login';
                }
            })
        }
    }
})