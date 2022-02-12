new Vue({
    el: '#user',
    data: function(){
        return{
            list: '',
            formItems: {
                userName: '',
                userPassword: '',
                systemIds: '',
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
            dialogTitle: '',
            mode: 'config',
            selectedUser: {},
            isAdmin: false
        }
    },
    beforeMount() {
        this.getUserInfo();
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
        getUserInfo() {
            util.ajax({
                url: `${config.baseApi}api/user/info`,
                data:{},
                success: resp => {
                    if(resp && resp.data) {
                        this.isAdmin = resp.data.level === 1;
                        if (this.isAdmin) {
                            this.getUserList();
                        }
                    }
                }
            })
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
        action() {
            this.mode === 'add' ? this.addUser() : this.updateUser();
        },
        addUser() {
            if(!this.formItems.userName){
                this.$message({
                    message: '请正确填写用户名称!',
                    type: 'warning',
                    offset: 60
                });
                return false;
            }
            if(!this.formItems.userPassword) {
                this.$message({
                    message: '请正确填写用户密码!',
                    type: 'warning',
                    offset: 60
                });
                return false;
            }
            const userPassword = hex_md5(this.formItems.userPassword);
            const {
                userName,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                systemIds,
                level,
            } = this.formItems;
            const data = {
                userName,
                userPassword: hex_md5(userPassword),
                systemIds,
                userImg: userImg,
                userPhone: userPhone,
                userEmail: userEmail,
                isPermit: isPermit ? 0 : 1,
                level: level || 0,
            };
            util.ajax({
                url: `${config.baseApi}api/user/register`,
                data,
                success: resp => {
                    this.getUserList();
                    this.$message({
                        message: '用户添加成功！',
                        type: 'success',
                        offset: 60
                      });
                    this.showDialog = false;
                }
            })
        },
        config(user) {
            this.mode = 'config';
            this.dialogTitle = '编辑用户';
            this.selectedUser = user;
            const {
                userName,
                userPassword,
                systemIds,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                level,
            } = this.selectedUser;
            this.formItems = {
                userName,
                userPassword,
                systemIds,
                userImg,
                userPhone,
                userEmail,
                isPermit: isPermit === 0,
                level,
            };
            this.showDialog = true;
        },
        add() {
            this.mode = 'add';
            this.formItems = {
                userName: '',
                userPassword: '',
                systemIds: '',
                userImg: '',
                userPhone: '',
                userEmail: '',
                isPermit: true,
                level: 0,
            };

            this.dialogTitle = '新增用户';
            this.showDialog = true;
        },
        updateUser() {
            const {
                userName,
                userPassword,
                systemIds,
                userImg,
                userPhone,
                userEmail,
                isPermit,
                level,
            } = this.formItems;
            if (!userPassword) {
                this.$message({
                    message: '用户密码不能为空！',
                    type: 'error',
                    offset: 60,
                    offset: 60
                  });
            }
            const data = {
                userName,
                userPassword: hex_md5(userPassword),
                systemIds,
                userImg,
                userPhone,
                userEmail,
                isPermit: isPermit ? 0 : 1,
                level,
            };
            util.ajax({
                url: `${config.baseApi}api/user/update`,
                data,
                success: resp => {
                    this.getUserList();
                    this.$message({
                        message: '用户信息更新成功！',
                        type: 'success',
                        offset: 60
                      });
                    this.showDialog = false;
                }
            })
        },
    }
})