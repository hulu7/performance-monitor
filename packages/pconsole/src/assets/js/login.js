new Vue({
    el: '#login',
    data: function(){
        return{
            username: '',
            password: ''
        }
    },
    mounted(){},
    methods:{
        login(){
            if(!this.username) {
               this.$message.error('用户名有误!');
               return false;
            }
            if(!this.password){
                this.$message.error('用户密码有误!');
                return false;
            }
            util.ajax({
                url: `${config.baseApi}api/user/login`,
                data: {
                    userName: this.username,
                    passWord: hex_md5(this.password)
                },
                success: resp => {
                    this.$message({
                        message: '登录成功！',
                        type: 'success',
                        offset: 60
                      });
                    window.location.href = resp.data.returnUrl;
                }
            })
        }
    }
})