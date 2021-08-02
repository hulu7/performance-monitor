new Vue({
    el: '#sideMainNav',
    data: function() {
        return{
            systemId:'',
        }
    },
    beforeMount() {
        this.appId = util.getQueryString('appId')
        if(this.appId){
            this.getDetail()
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
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
        },
        goToPagesList() {
            window.location.href = `/pages?systemId=${this.systemId}`;
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