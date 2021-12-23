new Vue({
    el: '#sideMainNav',
    data: function() {
        return{
            systemId: '',
            systemName: ''
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init() {
            var href = location.href;
            var liobjs = $('#side-main-nav').find('li')
            for(var i=0,len=liobjs.length;i<len;i++){
                var attrr = $(liobjs[i]).attr('data-mark')
                if(href.indexOf(attrr)!= -1){
                    liobjs.removeClass('active')
                    $(liobjs[i]).addClass('active')
                }
            }
            this.systemId = util.queryParameters('systemId');
            await this.getDetail();
        },
        goHome() {
            window.location.href = `/apps?systemId=${this.systemId}`;
        },
        getDetail() {
            util.ajax({
                url: `${config.baseApi}api/system/detail`,
                data:{
                    systemId: this.systemId
                },
                success:data=>{
                    this.systemName = data.data.systemName || '';
                }
            })
        },
        goToPagesList() {
            window.location.href = `/apps?systemId=${this.systemId}`;
        },
        goToSearch() {
            window.location.href = `/search?systemId=${this.systemId}`;
        },
        goToHttpTest() {
            window.location.href = `/httptest?systemId=${this.systemId}`;
        },
        goToWebPageTest() {
            window.location.href = `/webpagetest?systemId=${this.systemId}`;
        },
        goToSetting() {
            window.location.href = `/setting?systemId=${this.systemId}`;
        }
    }
})