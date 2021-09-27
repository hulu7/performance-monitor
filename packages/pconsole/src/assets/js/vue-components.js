let Component = {
    commonsearch:{
        template: `<div class="search">
            <a href="/addSystem"><el-button type='primary' class="cursor">+添加系统</el-button></a>
        </div>`,
        props:{
            done:{
                type:Function,
                default:()=>{}
            },
        },
        data:function(){
            return{
                timeText:'全部'
            }
        },
        mounted(){
            let _this=this;
            // 添加active样式
            let selecttimes = util.getStorage('local','userselectTime')||0
            let objs = $('.select-time li')
            for(let i=0,len=objs.length;i<len;i++){
                let times = $(objs[i]).attr('data-time')
                let text = $(objs[i]).attr('data-text')
                times = times*60*60*1000
                if(times == selecttimes){
                    _this.timeText = text
                    $(objs[i]).addClass('active')
                }
            }
            // active样式
            $('.times').on('click',(e) => {
                e.stopPropagation();
                $('.select-time').show();
            });
            $(document).on('click',function(e){
                $('.select-time').hide();
            });
            $('.select-time').click(function(e){
                e.stopPropagation();
            })
            $('.select-time li').on('click',function(e){
                $('.select-time li').removeClass('active')
                $(this).addClass('active')
                let time = $(this).attr('data-time')
                let text = $(this).attr('data-text')
                _this.timeText = text
                time = time*60*60*1000
                util.setStorage('local','userselectTime',time)
            })
        },
        methods:{
            timeSure(){
                $('.select-time').hide();
                this.done&&this.done()
            }
        },
    }
}
for(let n in Component){
    Vue.component(n, Component[n])
}








