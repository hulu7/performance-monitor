
new Vue({
    el: '#appsOverview',
    data() {
        return {
            table: 1,
            listdata: [],
            listAjax: [],
            listslowpages: [],
            listresources: [],
            pageSize: config.pageSize,
            total: 0,
            currentPage: 1,
            isLoadingHistory: false,
            isLoadingbrowser: false,
            isLoadingsystem: false,
            isLoadingeffective_type: false,
            isLoadingscreen_orientation: false,
            isLoadingscreen_size: false,
            isLoadinghttp_initiator: false,
            isLoadingAverage: false,
            pagesItemData: {},
            isShowCharts: false,
            systemId: '',
            appId: '',
            searchPin: '',
            formData: {
                dateRange: [],
                userId: ''
            },
            isLoadingGeoHistory: false,
            chartType: true,
            context: {},
            mapData: {
                dateRange: [
                    util.getDaysBefore(1),
                    util.getDaysBefore(0),
                ],
            },
            dateRange: '1天',
        }
    },
    filters: {
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
    mounted(){
        this.init();
    },
    methods:{
        onSearch() {
            this.fetchHistory();
        },
        onReset() {
            this.formData.dateRange = [];
            this.formData.userId = '';
            this.currentPage = 1;
            this.fetchHistory();
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.fetchHistory();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.fetchHistory();
        },
        goHome() {
            window.location.href = '/';
        },
        goToPages() {
            window.location.href = `/apps?systemId=${this.systemId}`;
        },
        init() {
            this.initMap();
            this.systemId = util.queryParameters('systemId');
            this.appId = util.getQueryString('appId');
            if(this.appId){
                this.getAverageValues()
            }
            this.fetchHistory();
            const statics = [
                'browser', //浏览器
                'system', //操作系统
                'effective_type', //带宽类型
                'screen_orientation', //屏幕方向
                'screen_size', //屏幕分辨率
                'http_initiator', //页面切换类型
            ];
            statics.map((type) => this.getDataForEnvironment(type));
            this.getLocation()
        },
        initMap() {
            this.context = new BMap.Map('map')
            const point = new BMap.Point(116.407845, 39.914101)
            setTimeout(() => {
                this.context.centerAndZoom(point, 1)
                this.context.enableScrollWheelZoom()
            }, 500)
        },
        getLocation() {
            this.isLoadingGeoHistory = true;
            util.ajax({
                url: `${config.baseApi}api/environment/history`,
                data: {
                    appId: this.appId,
                    beginTime: this.mapData.dateRange.length > 1 ? this.mapData.dateRange[0] : '',
                    endTime: this.mapData.dateRange.length > 1 ? this.mapData.dateRange[1] : '',
                },
                success: resp => {
                    this.drawPoints(resp.data);
                    this.isLoadingGeoHistory = false;
                }
            })
        },
        handleMapDateRangeChange(v) {
            this.getLocation();
        },
        handleDateRangeChange(v) {
            let start = 0
            switch(v) {
                case '1天':
                    start = 1;
                    break;
                case '1周':
                    start = 7;
                    break;
                case '1月':
                    start = 30;
                    break;
                default:
                    break;
            }
            this.mapData.dateRange[0] = util.getDaysBefore(start);
            this.mapData.dateRange[1] = util.getDaysBefore(0);
            this.getLocation();
        },
        drawPoints(data) {
            this.context.clearOverlays()
            const pointMap = new Map();
            data.map(point => {
                const tag = `${point.location.lat}${point.location.lng}${point.ip}`
                if (!pointMap.get(tag) && point.location.lng && point.location.lat) {
                    const p = new BMap.Point(point.location.lng, point.location.lat);
                    const marker = new BMap.Marker(p); 
                    this.context.addOverlay(marker)
                    const opts = {    
                        width: 250,
                        height: 100,
                        title: '访问者信息',
                    }
                    const infoWindow = new BMap.InfoWindow(`${point.ip}：${point.location.continent}/${point.location.country}/${point.location.city}`, opts);
                    marker.addEventListener('click', () => {    
                        this.context.openInfoWindow(infoWindow, p);
                    });  
                    pointMap.set(tag, point);
                }  
            })
            
        },
        gotoDetail(id) {
            window.open(`/app/detail?systemId=${this.systemId}&id=${id}&appId=${this.appId}`, `_blank`);
        },
        getAverageValues() {
            this.isLoadingAverage = true;
            util.ajax({
                url: `${config.baseApi}api/apps/average`,
                data: {
                    systemId: this.systemId,
                    appId: this.appId
                },
                success: data => {
                    this.pagesItemData = data.data;
                    this.isLoadingAverage = false;
                }
            })
        },
        fetchHistory() {
            this.isLoadingHistory  = true;
            util.ajax({
                url: `${config.baseApi}api/apps/history`,
                data: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    appId: this.appId,
                    beginTime: this.formData.dateRange.length > 1 ? this.formData.dateRange[0] : '',
                    endTime: this.formData.dateRange.length > 1 ? this.formData.dateRange[1] : '',
                    userId: this.formData.userId
                },
                success: resps => {
                    this.isLoadingHistory = false;
                    this.listdata = resps.data.data;
                    this.total = resps.data.total;
                    if (!this.chartType) {
                        this.echartShowPages();
                    }
                }
            })
        },
        // 获得浏览器分类情况
        getDataForEnvironment(type) {
            this[`isLoading${type}`] = true;
            util.ajax({
                url: `${config.baseApi}api/environment/detail`,
                data:{
                    appId: this.appId,
                    beginTime: '',
                    endTime: '',
                    type
                },
                success: data => {
                    this.getData(data.data, `ec-${type}`, type);
                    this[`isLoading${type}`] = false;
                }
            })
        },
        getData(datas, id, type) {
            let seriesData=[];
            let legendData=[];
            let totalcount=0;
            if(!datas.length) return;
            datas.forEach(item => {
                totalcount += item.count
            })
            datas.forEach(item => {
                let name = item[type]
                legendData.push({
                    name: name || '未知',
                    icon: 'circle',
                })
                seriesData.push({
                    name: name || '未知',
                    value: item.count,
                    percentage: `${((item.count/totalcount)*100).toFixed()}%`
                })
            })
            this.echartBorwsers(id, legendData, seriesData)
        },
        echartBorwsers(id, legendData, seriesData) {
            const myChart = echarts.init(document.getElementById(id));
            const option = {
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
                    type: 'scroll',
                    right: 0,
                    top: 20,
                    bottom: 20,
                    padding:0,
                    itemWidth:15,
                    itemHeight:10,
                    data:legendData,
                    formatter:function(name){
                        for(let i = 0; i< seriesData.length; i++){
                            if(name === seriesData[i].name){
                                return `${name || '未知'}  ${seriesData[i].value}  ${seriesData[i].percentage}`;
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
                    radius: '65%',
                    selectedMode: 'single',
                    center: ['30%', '50%'],
                    itemStyle: {
                        borderRadius: 2
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
            const e = document.getElementById(id);
            const label = document.createElement("label");
            label.innerHTML = `种类总量：${legendData.length}`;
            label.setAttribute('class', 'category-statics');
            e.appendChild(label);
        },
        changeType(){
            setTimeout(()=>{
                if(!this.chartType) {
                    this.echartShowPages();
                }
            },200)
        },
        deepClone(o) {
            if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
                return o;
            } else if (Array.isArray(o)) {
                const _arr = [];
                o.forEach(item => { _arr.push(item) });
                return _arr;
            } else if (typeof o === 'object') {
                const _o = {};
                for (let key in o) {
                    _o[key] = deepClone(o[key]);
                }
                return _o;
            }
        },
        echartShowPages() {
            let datas       = this.deepClone(this.listdata);
            datas.reverse();
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
            ];
            let xAxisData   = [];
            let seriesData  = [];
            legendData.forEach((item, index)=>{
                let data = {
                    name: item,
                    type: 'line',
                    data:[],
                };
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
                });
                seriesData.push(data);
            });

            datas.forEach(item=>{
                xAxisData.push(item.dateTime);
            });

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
            location.href=`/ajax/detail?name=${encodeURIComponent(item.name)}`;
        },
        gotoSourcesDetail(item){
            location.href=`/slowresources/detail?name=${encodeURIComponent(item.name)}`;
        },
    }
})