new Vue({
    el: '#user',
    data: function(){
        return{
            list: '',
            formItems: {
                userName: '',
                userPassword: '',
                systemIds: [],
                userImg: '',
                userPhone: '',
                userEmail: '',
                isPermit: false,
                level: '',
            },
            list: [],
            pageNo: 1,
            pageSize: config.pageSize,
            total: 0,
            currentPage: 1,
            isLoading: false,
            showDialog: false,
        }
    },
    beforeMount() {
        this.getUserList()
    },
    mounted(){},
    methods:{
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getUserList();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getUserList();
        },
        getUserList() {
            this.isLoading = true;
            util.ajax({
                url: `${config.baseApi}api/user/list`,
                data: {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                },
                success: resp => {
                    this.isLoading = false;
                    this.list = [];
                    this.total = 0;
                    if (resp && resp.data) {
                        this.list = resp.data.list;
                        this.total = resp.data.total;
                    }
                }
            })
        },
        addUser() {
            if(!this.formItems.userName){
                this.$message({
                    message: '请正确填写用户名称!',
                    type: 'warning'
                });
                return false;
            }
            if(!this.formItems.userPassword) {
                this.$message({
                    message: '请正确填写用户密码!',
                    type: 'warning'
                });
                return false;
            }
            const userPassword = hex_md5(this.formItems.userPassword);
            const systemIds = this.formItems.systemIds.join(',');
            const {
                userName,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                level,
            } = this.formItems;
            util.ajax({
                url: `${config.baseApi}api/user/register`,
                data: {
                    userName,
                    userPassword,
                    systemIds,
                    userImg: userImg,
                    userPhone: userPhone,
                    userEmail: userEmail,
                    isPermit: isPermit ? 0 : 1,
                    level: level || 0,
                },
                success: resp => {
                    this.$message({
                        message: '用户添加成功！',
                        type: 'success'
                      });
                      this.showDialog = false;
                    this.getUserList();
                }
            })
        },
        update(user) {
            this.showDialog = true;
        },
        updateUser(data) {
            util.ajax({
                url: `${config.baseApi}api/user/update`,
                data,
                success: resp => {
                    this.$message({
                        message: '用户信息更新成功！',
                        type: 'success'
                      });
                }
            })
        },
    }
})