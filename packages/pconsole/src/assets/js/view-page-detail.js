new Vue({
    el: '#pagesDetail',
    data() {
        return {
            table: 1,
            listdata: [],
            listAjax: [],
            listslowpages: [],
            listresources: [],
            pageNo: 1,
            pageSize: config.pageSize,
            totalNum: 0,
            isLoadEnd: false,
            url: '',
            pagesItemData: {},
            isShowCharts: false,
            systemId: '',
        }
    },
    filters:{
        toFloat1: (input) => {
            return input ? parseFloat(input).toFixed(1) : 0.0;
        },
        toInit: (input) => {
            return input ? Math.floor(input) : 0;
        },
        toFixed: window.Filter.toFixed,
        toSize: window.Filter.toSize,
        date: window.Filter.date,
        limitTo: window.Filter.limitTo,
    },
    beforeMount(){
        this.init();
        if(this.url){
            this.getAverageValues()
        }
        this.changeTable(1);
        const statics = [
            'browser', //浏览器
            'system', //操作系统
            'effectiveType', //带宽类型
            'screenOrientation', //屏幕方向
            'screenSize', //屏幕尺寸
            'httpInitiator', //页面切换类型
        ];
        statics.map((type) => this.getDataForEnvironment(type));
    },
    mounted(){},
    methods:{
        goHome() {
            window.location.href = '/';
        },
        goToPages() {
            window.location.href = `/pages?systemId=${this.systemId}`;
        },
        init() {
            this.systemId = util.queryParameters('systemId');
            this.url = util.getQueryString('url');
        },
        gotoDetail(id) {
            location.href = `/pages/detail/item?systemId=${this.systemId}&&id=${id}`;
        },
        // 获得平均性能
        getAverageValues() {
            util.ajax({
                url: `${config.baseApi}api/pages/getPageList`,
                data: {
                    systemId: this.systemId,
                    url: this.url,
                    isAllAvg: false,
                },
                success: data => {
                    this.pagesItemData = data.data;
                }
            })
        },
        changeTable(number) {
            this.isLoadEnd  =false
            this.pageNo     = 1
            this.table      = number
            let api         = ''
            let pageName    = ''
            switch(number){
                case 1:
                    if(!this.listdata.length){
                        api         = 'api/pages/getPageItemDetail',
                        pageName    = '#copot-page-pages'
                        this.getinit(api,pageName);
                    } 
                    break;
                case 2:
                    if(!this.listAjax.length){
                        api         = 'api/ajax/getPageItemDetail',
                        pageName    = '#copot-page-ajax'
                        this.getinit(api,pageName);
                    }
                    break;
                case 3:
                    if(!this.listslowpages.length) {
                        api         = 'api/slowpages/getSlowPageItem',
                        pageName    = '#copot-page-slowpages'
                        this.getinit(api,pageName);
                    }
                    break;
                case 4:
                    if(!this.listresources.length){
                        api         = 'api/slowresources/getSlowResourcesItem',
                        pageName    = '#copot-page-slowresources'
                        this.getinit(api,pageName);
                    }
                    break;            
            }
        },
        // 获得page详情
        getinit(api, pageName) {
            util.ajax({
                url: `${config.baseApi}${api}`,
                data: {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    url: this.url,
                    callUrl: this.url,
                    beginTime: '',
                    endTime: '',
                },
                success: data => {
                    this.isLoadEnd=true;
                    switch(this.table){
                        case 1:
                            this.listdata = data.data.datalist
                            break;
                        case 2:
                            this.listAjax = data.data.datalist
                            break;
                        case 3:
                            this.listslowpages = data.data.datalist
                            break;
                        case 4:
                            this.listresources = data.data.datalist
                            break;            
                    }
                    new Page({
                         parent: $(pageName),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                             this.pageNo = nowPage;
                             this.getinit(api,pageName);
                         }
                    });

                }
            })
        },
        // 获得浏览器分类情况
        getDataForEnvironment(type){
            util.ajax({
                url: `${config.baseApi}api/environment/getDataForEnvironment`,
                data:{
                    url: this.url,
                    beginTime: '',
                    endTime: '',
                    type
                },
                success: data => {
                    this.isLoadEnd = true;
                    this.getData(data.data, `ec-${type}`, type)
                }
            })
        },
        getData(datas, id, tyle){
            let seriesData=[];
            let legendData=[]
            let totalcount=0
            if(!datas.length) return;
            datas.forEach(item=>{
                totalcount+=item.count
            })
            datas.forEach(item=>{
                let name = item[tyle]
                legendData.push({
                    name:name,
                    icon: 'circle',
                })
                seriesData.push({
                    name:name,
                    value:item.count,
                    percentage:((item.count/totalcount)*100).toFixed()+'%'
                })
            })
            this.echartBorwsers(id, legendData, seriesData)
        },
        // echart表
        echartBorwsers(id,legendData,seriesData){
            var myChart = echarts.init(document.getElementById(id));
            var option = {
                tooltip: {
                    formatter: "{b} : {c} ({d}%)"
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                color:[
                    '#f44336',
                    '#00bcd4',
                    '#3cd87f',
                    '#ffeb3b',
                    '#9c27b0',
                    '#e91e63',
                    '#ff9800',
                    '#ff5722',
                    '#33ff00',
                    '#33ffff',
                    '#ff33ff',
                    '#3300ff',
                    '#ff6666',
                    '#0066cc',
                    '#3333ff'
                ],
                legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 20,
                    bottom: 20,
                    padding:0,
                    itemWidth:15,
                    itemHeight:10,
                    data:legendData,
                    formatter:function(name){
                        for(let i=0;i<seriesData.length;i++){
                            if(name === seriesData[i].name){
                                return name+'  '+seriesData[i].value+'  '+seriesData[i].percentage;    
                            }
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true}
                    }
                },
                series: [{
                    type: 'pie',
                    radius : [20, 60],
                    center: ['30%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 4
                    },
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    data: seriesData
                }]
            };
            myChart.setOption(option);
            window.onresize = () => {
                myChart.resize();
            };
        },
        showCharts(){
            this.isShowCharts = !this.isShowCharts
            setTimeout(()=>{
                if(this.isShowCharts) this.echartShowPages()
            },200)
        },
        echartShowPages(){
            let datas       = this.listdata;
            if(!datas.length) return;
            let legendData  = [
                '页面加载时间',
                '白屏时间',
                'DOM构建时间',
                '解析DOM耗时',
                'request请求时间',
                '页面准备时间',
                'DNS解析',
                'TCP连接时间',
                '重定向时间',
                'unload时间',
                '视觉就绪时间',
                '首次内容绘制时间',
                '首像素时间',
                '可感知加载时间'
            ]
            let xAxisData   = []
            let seriesData  = []
            legendData.forEach((item, index)=>{
                let data = {
                    name:item,
                    type: 'line',
                    data:[],
                }
                datas.forEach(proItem=>{
                    switch(index){
                        case 0:
                            data.data.push(proItem.loadTime);
                            break;
                        case 1: 
                            data.data.push(proItem.whiteTime);
                            break; 
                        case 2: 
                            data.data.push(proItem.domTime);
                            break;   
                        case 3: 
                            data.data.push(proItem.analysisDomTime);
                            break;   
                        case 4: 
                            data.data.push(proItem.requestTime);
                            break;
                        case 5: 
                            data.data.push(proItem.readyTime);
                            break;
                        case 6:
                            data.data.push(proItem.dnsTime);
                            break;
                        case 7:
                            data.data.push(proItem.tcpTime);
                            break;
                        case 8:
                            data.data.push(proItem.redirectTime);
                            break;
                        case 9:
                            data.data.push(proItem.unloadTime);
                            break;
                        case 10:
                            data.data.push(proItem.visuallyReadyTime);
                            break;
                        case 11:
                            data.data.push(proItem.firstContentfulPaint);
                            break;
                        case 12:
                            data.data.push(proItem.firstPaint);
                            break;
                        case 13:
                            data.data.push(proItem.perceivedLoadTime);
                            break;
                    }
                })
                seriesData.push(data)
            })
            datas.forEach(item=>{
                xAxisData.push( new Date(item.dateTime).format('MM/dd'));
            })

            var myChart=  echarts.init(document.getElementById('charts-pages'));
            let option=  {
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                color:[
                    '#f44336',
                    '#00bcd4',
                    '#3cd87f',
                    '#ffeb3b',
                    '#e91e63',
                    '#9c27b0',
                    '#ff9800',
                    '#ff5722',
                    '#33ff00',
                    '#33ffff',
                    '#ff33ff',
                    '#3300ff',
                    '#ff6666',
                    '#0066cc',
                    '#3333ff'
                ],
                legend: {
                    data:legendData
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [{
                    type : 'category',
                    boundaryGap : false,
                    data : xAxisData
                }],
                yAxis : [{ type : 'value' } ],
                series : seriesData
            };
            myChart.setOption(option);
            window.onresize = () => {
                myChart.resize();
            };
        },
        gotoAjaxDetail(item){
            location.href="/ajax/detail?name="+encodeURIComponent(item.name)
        },
        gotoSourcesDetail(item){
            location.href="/slowresources/detail?name="+encodeURIComponent(item.name)
        },
       
    }
})