
//util 公共对象函数
class utilfn {
	//初始化对象
	constructor() {
		this.win = window.top;
		this.UA = navigator.userAgent;
		this.isPC = this.UA.indexOf('Windows NT') > -1;
		this.isAndroid = this.UA.indexOf('Android') > -1;
		this.isIos = this.UA.indexOf('Mac OS X') > -1;
		this.isIphone = this.UA.indexOf('iPhone;') > -1;
		this.isIpad = this.UA.indexOf('iPad;') > -1;
		this.isIE7 = this.UA.indexOf('MSIE 7.0;') > -1;
		this.isIE8 = this.UA.indexOf('MSIE 8.0;') > -1;
		this.isIE9 = this.UA.indexOf('MSIE 9.0;') > -1;
		this.isIE10 = this.UA.indexOf('MSIE 10.0;') > -1;
		this.isIE11 = this.UA.indexOf('Trident') > -1;
		this.C = {
			N: '',
			C: 'morning-star'
		}
	};

	/*封装的ajax函数
	 *type           	类型  get|post
	 *url            	api地址
	 *data           	请求的json数据
	 *noLoading  		ajax执行时是否显示遮罩
	 *nohideloading  	ajax执行完成之后是否隐藏遮罩
	 *notimeout			是否有请求超时
	 *complete       	ajax完成后执行（失败成功后都会执行）
	 *beforeSend        	请求发送前执行
	 *success        	成功之后执行
	 *error          	失败之后执行
	 *goingError     	是否执行自定义error回调
	 *timeout        	ajax超时时间
	 *isGoingLogin   	是否跳转到登录界面
	 */
	ajax(json) {
		let This = this;
		let noError = true;
		let url = null;
		let asyncVal = typeof(json.async) == 'boolean' ? json.async : true;
		This.showLoading();

		//是否有请求超时
		if (!json.notimeout) {
			var timeout = setTimeout(function() {
				This.hideLoading();
				// 请求超时
				noError = false;
				asyncVal && popup.alert({
					type: 'msg',
					title: '您的网络太慢了哦,请刷新重试!'
				});
			}, json.timeout || config.ajaxtimeout);
		}
		// 增加时间戳参数
		if (json.url.indexOf('?') != -1) {
			url = json.url + '&_=' + this.time();
		} else {
			url = json.url + '?_=' + this.time();
		};

		let jsSign = {
			getSign: this.getSignData()
		};
		json.data = Object.assign({}, json.data, jsSign);

		return $.ajax({
			type: json.type || "post",
			url: url,
			data: json.data || "",
			dataType: "json",
			async: asyncVal,
			beforeSend: function(xhr) {
				json.beforeSend && json.beforeSend(xhr);
			},
			success: function(data) {
				if (!json.nohideloading) {
					This.hideLoading();
				};
				clearTimeout(timeout);
				if (typeof(data) == 'string') {
					This.error(JSON.parse(data), json);
				} else {
					This.error(data, json);
				}
			},
			complete: function(XMLHttpRequest) {
				if (!json.nohideloading) {
					This.hideLoading();
				};
				clearTimeout(timeout);
				if (json.complete) {
					json.complete(XMLHttpRequest);
				}
			},
			error: function(XMLHttpRequest) {
				This.hideLoading();
				clearTimeout(timeout);
				if (noError) {
					This._error(XMLHttpRequest, json);
				};
			}
		});
	};


	//file 文件上传
	fileAJAX(json) {
		var This = this;
		var noError = true;
		This.showLoading();
		$.ajax({
			type: json.type || "post",
			url: json.url,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: json.data || "",
			datatype: "json",
			cache: false,
			contentType: false,
			processData: false,
			goingError: json.goingError || false,
			notimeout: json.notimeout || false,
			beforeSend: function(xhr) {
				json.beforeSend && json.beforeSend(xhr);
			},
			xhr: function() {
				var xhr = jQuery.ajaxSettings.xhr();
				xhr.upload.onprogress = function(ev) {
					if (ev.lengthComputable) {
						var percent = 100 * ev.loaded / ev.total;
						json.xhr && json.xhr(percent)
					}
				}
				return xhr;
			},
			success: function(data) {
				if (!json.nohideloading) {
					This.hideLoading();
				};
				clearTimeout(time);
				This.error(data, json);
			},
			error: function(XMLHttpRequest) {
				if (!json.nohideloading) {
					This.hideLoading();
				};
				// json.error(XMLHttpRequest,json);
				clearTimeout(time);
				if (noError) {
					This._error(XMLHttpRequest, json);
				};
			},
			complete: function(XMLHttpRequest) {
				if (!json.nohideloading) {
					This.hideLoading();
				};
				clearTimeout(time);
				if (json.complete) {
					json.complete(XMLHttpRequest);
				}
			},
		});
		//是否有请求超时
		if (!json.notimeout) {
			var time = setTimeout(function() {
				This.hideLoading();
				// 请求超时
				noError = false;
				popup.alert({
					type: 'msg',
					title: '您的网络太慢了哦,请刷新重试!'
				});
			}, json.timeout || config.ajaxtimeout);
		}
	}

	/*FormData 上传文件函数
	filename : string  input name 属性
	onlyOne : boolean   是否只上传一个文件
	data : Object      ajax上次的data数据
	url ：string      api地址
	checktype: array     默认['png','jpg'，'gif']
	nohideloading : boolean  	ajax执行完成之后是否隐藏遮罩
	timeout : number        	ajax超时时间
	goingError : boolean     	是否执行自定义error回调
	isGoingLogin : boolean   	是否跳转到登录界面
	success : function   成功之后的回调函数
	complete : function       	ajax完成后执行（失败成功后都会执行）
	error : function          	失败之后执行
	*/
	cerateFileFormData(json) {
		var This = this;
		var checktype = json.checktype || ['jpg', 'jpeg', 'png', 'gif'];
		var filename = json.filename ? json.filename : 'file'
		var html = '<div id="createFileHtml" class="hidden">';
		html += '<form enctype="multipart/form-data" id="uploadForm">';
		html += '<input type="file" name="' + filename + '" id="expInputFile" ';
		if (!json.onlyOne) {
			html += ' multiple="multiple"'
		}
		html += '></div></form>';
		if ($('#createFileHtml').length) {
			$('#createFileHtml').remove();
		}
		$('body').append(html);
		$('#expInputFile').click();
		$('#expInputFile').one('change', function() {
			// 检查文件类型
			var files = $('#expInputFile')[0].files;
			for (var i = 0; i < files.length; i++) {
				var begin = false;
				for (var k = 0; k < checktype.length; k++) {
					var checked = new RegExp("\." + checktype[k] + "$").test(files[i]['name'].toLowerCase());
					if (!checked) {
						continue;
					}
					begin = checked;
				}
				if (!begin) {
					popup.alert({
						title: '请上传正确的文件类型！'
					});
					return false;
				};
			}
			// 执行ajax
			This.showLoading();

			//添加验证
			let jsSign = {
				getSign: JSON.stringify(This.getSignData())
			};
			json.data = Object.assign({}, json.data, jsSign);

			var formData = new FormData($("#uploadForm")[0]);
			if (json.data) {
				for (var i in json.data) {
					formData.append(i, json.data[i]);
				};
			};
			This.fileAJAX({
				url: json.url,
				data: formData,
				notimeout: json.notimeout || false,
				goingError: json.goingError || false,
				beforeSend: function(xhr) {
					json.beforeSend && json.beforeSend(xhr);
				},
				success: function(data) {
					$('#createFileHtml').remove();
					json.success && json.success(data);
				},
				error: function(data) {
					$('#createFileHtml').remove();
					json.error && json.error(data, json);
				},
				complete: function(data) {
					json.complete && json.complete(data);
				},
				xhr: function(data) {
					json.xhr && json.xhr(data)
				}
			});
		});
	}

	//error 处理函数
	error(data, json) {
		//判断code 并处理
		var dataCode = parseInt(data.code);
		if (!json.isGoingLogin && dataCode == 1004) {
			//判断app或者web
			if (window.location.href.indexOf(config.loginUrl) == -1) {
				sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
				location.href = config.loginUrl + '?redirecturl=' + encodeURIComponent(location.href);
			} else {
				popup.alert({
					type: 'msg',
					title: '用户未登陆,请登录!'
				});
			}
		} else {
			switch (dataCode) {
				case 1000:
					json.success && json.success(data);
					break;
				default:
					if (json.goingError) {
						//走error回调
						json.error && json.error(data);
					} else {
						//直接弹出错误信息
						popup.alert({
							type: 'msg',
							title: data.desc
						});
					};
			}
		};
	}

	// _error 处理函数
	_error(XMLHttpRequest, json) {
		this.hideLoading();
		if (json.code) {
			json.error(JSON.parse(XMLHttpRequest.responseText));
		} else {
			switch (XMLHttpRequest.status) {
				case 401:
					if (window.location.href.indexOf(config.loginUrl) == -1) {
						sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
						window.location.href = config.loginUrl;
					} else {
						popup.alert({
							type: 'msg',
							title: "你需要登录哦"
						});
					};
					break;
				case 400:
					popup.alert({
						type: 'msg',
						title: "您的请求不合法呢"
					});
					break;
				case 404:
					popup.alert({
						type: 'msg',
						title: "访问的地址可能不存在哦"
					});
					break;
				case 500:
				case 502:
					popup.alert({
						type: 'msg',
						title: "服务器内部错误"
					});
					break;
					// default:
					// 	popup.alert({type:'msg',title:"未知错误。程序员欧巴正在赶来修改哦"});
			}
		}
	}

	// 获取当前时间毫秒
	time() {
		return new Date().getTime();
	}

	/*根据参数生成常用的正则表达式
	 *string    type 生成的正则表达式类型
	 *array     numArr 生成正则的条件数组 例如:[6,16] 也可省略
	 */
	regCombination(type, numArr) {
		var reg = "";
		switch (type) {
			case "*": //"*":"不能为空！"
				if (numArr) {
					reg = new RegExp("^[\\w\\W]{" + numArr[0] + "," + numArr[1] + "}$");
				} else {
					reg = new RegExp("^[\\w\\W]+$");
				}
				break;
			case "n": //"number":"请填写数字！
				if (numArr) {
					reg = new RegExp("^\\d{" + numArr[0] + "," + numArr[1] + "}$");
				} else {
					reg = new RegExp("^\\d+$");
				}
				break;
			case "s": //"s":"不能输入特殊字符！"
				if (numArr) {
					reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{" + numArr[0] + "," + numArr[1] + "}$");
				} else {
					reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]+$");
				}
				break;
			case "c": //"z":"中文验证"
				reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d]{" + numArr[0] + "," + numArr[1] + "}$");
				break;
			case "p": //"p":"邮政编码！
				reg = new RegExp("^[0-9]{6}$");
				break;
			case "m": //"m":"写手机号码！"
				reg = new RegExp("^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$");
				break;
			case "e": //"e":"邮箱地址格式
				reg = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
				break;
			case "id": //"id":验证身份证
				reg = new RegExp("^\\d{17}[\\dXx]|\\d{14}[\\dXx]$");
				break;
			case "money": //钱
				reg = new RegExp("^[\\d\\.]+$");
				break;
			case "url": //"url":"网址"
				reg = new RegExp("^(\\w+:\\/\\/)?\\w+(\\.\\w+)+.*$");
				break;
			case "u": //
				reg = new RegExp("^[A-Z\\d]+$");
				break;
			case "numLimitTo2": //保留2位小数点正整数
				reg = new RegExp("^-{0,0}\\d+(.\\d{0,2})?$");
				break;
			case "spec": //校验特殊字符
				reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
				break;
		}
		return reg;
	}

	/*extent json函数
	 *json1  原始数据
	 *json2  新数据
	 */
	extend(json1, json2) {
		var newJson = json1;
		for (var j in json2) {
			newJson[j] = json2[j];
		}
		return newJson;
	}

	//showLoading
	showLoading() {
		$('#loading').stop().show();
	}

	//hideLoading
	hideLoading() {
		$('#loading').stop().hide();
	}
	
	/*获取url hash*/
	getQueryString(name, hash) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		if (hash) {
			if (!window.location.hash) {
				return '';
			};
			var r = decodeURIComponent(window.location.hash).substr(1).match(reg);
		} else {
			var r = decodeURIComponent(window.location.search).substr(1).match(reg);
		}
		if (r != null) {
			return `${r[2]}${window.location.hash || ''}`;
		}
		return null;
	}

	/*获取 storage 缓存数据
	 * type  类型   local：localStorage   session：sessionStorage
	 * name  缓存数据name名
	 */
	getStorage(type, name) {
		var type = type || 'local';
		if (type == 'local') {
			var result = localStorage.getItem(name) ? localStorage.getItem(name) : "";
		} else if (type == 'session') {
			var result = sessionStorage.getItem(name) ? sessionStorage.getItem(name) : "";
		}
		return result;
	}

	/*设置 storage 缓存数据
	 *type  类型   local：localStorage   session：sessionStorage
	 *name  缓存数据name名
	 *content  缓存的数据内容
	 */
	setStorage(type, name, content) {
		var type = type || 'local';
		var data = content;
		if (typeof(data) == 'object') {
			data = JSON.stringify(content)
		};
		if (type == 'local') {
			localStorage.setItem(name, data);
		} else if (type == 'session') {
			sessionStorage.setItem(name, data);
		}
	}

	/*vue获得checkbox的值*/
	getCheckBoxVal(arr){
		let result=""
		if(!arr.length) return result;
		arr.forEach((item)=>{
			if(item.checked){
				result+=item.value+','
			}
		})
		return result.slice(0,-1);
	}

	/*vue转换checkbox的值*/
	setCheckBoxVal(arr,str){
		let copyarr = arr;
		if(!str) return copyarr;
		let newArr=str.split(',')
		copyarr.forEach((itemp)=>{
			newArr.forEach((item)=>{
				if(itemp.value == item){
					itemp.checked=true;
				}
			})
		})
		return copyarr;
	}

	randomString(len) {　　
		len = len || 32;　　
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
		var maxPos = $chars.length;　　
		var pwd = '';　　
		for (var i = 0; i < len; i++) {　　　　
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
		}　　
		return pwd;
	}

	/*本地加密算法*/
	signwxfn(json) {
		var wxkey = 'ZANEWANGWEI123456AGETEAMABmiliH';
		/*对json的key值排序 */
		var arr = [];
		var sortJson = {};
		var newJson = json;
		for (var key in json) {
			if (json[key]) {
				arr.push(key);
			}
		}
		arr.sort(function(a, b) {
			return a.localeCompare(b);
		});
		for (var i = 0, len = arr.length; i < len; i++) {
			sortJson[arr[i]] = json[arr[i]]
		}
		/*拼接json为key=val形式*/
		var str = "";
		for (var key in sortJson) {
			str += key + "=" + sortJson[key] + '&';
		}
		str += 'key=' + wxkey;
		/*md5*/
		var md5Str = hex_md5(str);
		var signstr = md5Str.toUpperCase();
		/*获得有sign参数的json*/
		newJson['paySign'] = signstr;
		return newJson;
	}

	// 获得加密后的数据
	getSignData(json) {
		if (!json) {
			json = {}
		}
		var signwx = this.signwxfn({
			name: json.name || this.C.N,
			company: json.company || this.C.C,
			time: new Date().getTime(),
			random: this.randomString()
		});
		return {
			paySign: signwx.paySign,
			random: signwx.random,
			time: signwx.time
		}
	}

	goBack(){
		window.history.go(-1);
	}

	showtime(){
		$('.times').on('click',() => {
			$('.select-time').show();
		});
		$('body').on('click','.times',function(e){
            $(document).one("click", function(){
                $('.select-time').hide();
            });
            e.stopPropagation();

        }); 
        $('.select-time li').on('click',function(){
        	$('.select-time').hide();
        	$('.times_text').text(this.innerHTML);
        })
	}
	// 获得查询时间
	getSearchTime(){
		let json={
			beginTime:'',
			endTime:''
		}
		let selecttimes = util.getStorage('local','userselectTime')||0
		selecttimes = selecttimes*1
		if(selecttimes){
			let endTime 	= new Date().getTime()
			let beginTime 	= endTime-selecttimes
			json.beginTime 	= new Date(beginTime).format('yyyy/MM/dd hh:mm:ss')
			json.endTime 	= new Date(endTime).format('yyyy/MM/dd hh:mm:ss')
		}

		return json
	}

    // 查询url参数
    queryParameters(name) { 
        let reg = `(^|&)${name}=([^&]*)(&|$)`
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null; 
    }

	// 画api耗时排名
	drawApiRank(elementId, categories) {
		const target = document.getElementById(elementId);
		if (!target) {
			return;
		}
		target.setAttribute('style', `height: 220px; width: 100%; margin-top: 16px; text-align: center`);
		if (categories.values.length === 0 || categories.names.length === 0) {
			const label = document.createElement("label");
            label.innerHTML = '暂无数据';
            target.appendChild(label);
			return;
		}
		const chartDom = document.getElementById(elementId);
		const myChart = echarts.init(chartDom);
		const option = {
			tooltip: {
			  confine: true,
			  extraCssText: 'white-space: normal; word-break: break-all;',
			  trigger: 'axis',
			  axisPointer: {
				type: 'shadow',
				label: {
				  show: false
				}
			  },
			  formatter: function (params) {
				return `<span style="max-width: 200px;">${params[0].name}</span>
						<div style="width: 100%; text-align: left;">
							<div>时间：${params[0].value.toFixed(1)} ms</div>
						</div>`;
				}
			},
			calculable: true,
			legend: {
			  data: ['Growth', 'APIs'],
			  itemGap: 5
			},
			grid: {
			  top: '12%',
			  left: '1%',
			  right: '10%',
			  containLabel: true
			},
			xAxis: [
			  {
				type: 'category',
				data: categories.names,
				show: false
			  }
			],
			yAxis: [
			  {
				type: 'value',
				name: '时间 (ms)',
				axisLabel: {
				  formatter: function (a) {
					a = +a;
					return isFinite(a) ? echarts.format.addCommas(+a) : '';
				  }
				}
			  }
			],
			dataZoom: [
			  {
				show: true,
				start: 0,
				end: 100
			  },
			  {
				type: 'inside',
				start: 94,
				end: 100
			  }
			],
			series: [
			  {
				name: 'API 耗时',
				type: 'bar',
				data: categories.values
			  }
			]
		};

		option && myChart.setOption(option);
		window.onresize = () => {
			myChart.resize();
		};
	}

	// 画瀑布流数据
	drawWaterfall(elementId, categories) {
		const target = document.getElementById(elementId);
		if (!target) {
			return;
		}
		const times = categories.length;
		if (!times) {
			return;
		}
		categories.reverse();
		target.setAttribute('style', `height: ${times * 30 + 100}px; width: 100%;`);
		let data = [];
		const chartDom = document.getElementById(elementId);
		const myChart = echarts.init(chartDom);
		const startTime = +new Date();
		const stages = [{
			name: 'redirect',
			start: 'redirectStart',
			end: 'redirectEnd',
		}, {
			name: 'fetch',
			start: 'fetchStart',
			end: 'domainLookupStart',
		}, {
			name: 'dns',
			start: 'domainLookupStart',
			end: 'domainLookupEnd',
		}, {
			name: 'connect',
			start: 'connectStart',
			end: 'connectEnd',
		}, {
			name: 'ssl',
			start: 'secureConnectionStart',
			end: 'connectEnd',
		}, {
			name: 'request',
			start: 'requestStart',
			end: 'responseStart',
		}, {
			name: 'response',
			start: 'responseStart',
			end: 'responseEnd',
		}];
		const typesColorMap = {
			redirect: '#008000',
			fetch: '#0000cd',
			dns: '#1e90ff',
			connect: '#ffa500',
			sercureConnect: '#b0c4de',
			request: '#00bfff',
			response: '#4169e1	'
		};
		stages.reverse();

		// Generate waterfall data
		categories.forEach((category, index) => {
			let duration = 0;
			stages.forEach(stage => {
				const { name, initiatorType, startTime: start, transferSize  } = category;
				const st = (category[stage.start] === 0 ? start : category[stage.start])
				const diff = category[stage.end] - st;
				duration = diff < 0  ? 0 : diff;
				data.push({
					name,
					type: stage.name,
					duration,
					initiatorType,
					startTime: st,
					endTime: category[stage.end],
					transferSize,
					value: [
						index,
						startTime + st,
						startTime + category[stage.end] + (st === category[stage.end] ? 1 : 0),
						duration
					],
					itemStyle: {
						normal: {
							color: typesColorMap[stage.name]
						}
					}
				});
			});
		});

		const renderItem = (params, api) => {
			const categoryIndex = api.value(0);
			const start = api.coord([api.value(1), categoryIndex]);
			const end = api.coord([api.value(2), categoryIndex]);
			const height = api.size([0, 1])[1] * 0.8;

			const rectShape = echarts.graphic.clipRectByRect({
				x: start[0],
				y: start[1] - height / 2,
				width: end[0] - start[0],
				height: height
			}, {
				x: params.coordSys.x,
				y: params.coordSys.y,
				width: params.coordSys.width,
				height: params.coordSys.height
			});

			return rectShape && {
				type: 'rect',
				transition: ['shape'],
				shape: rectShape,
				style: api.style()
			};
		}

		const option = {
			tooltip: {
				confine: true,
				extraCssText: 'white-space: normal; word-break: break-all;',
				formatter: function (params) {
					return `<span style="max-width: 200px;">${params.data.name}</span>
							<div style="border-bottem: 1px solid rgba(0,0,0,.12)"></div>
							<div style="width: 100%; text-align: left;">
								<div>类型：${params.marker} ${params.data.type}</div>
								<div>请求类型：${params.data.initiatorType}</div>
								<div>开始时间：${params.data.startTime.toFixed(1)} ms</div>
								<div>结束时间：${params.data.endTime.toFixed(1)} ms</div>
								<div>持续时间：${params.data.duration.toFixed(1)} ms</div>
								<div>数据大小：${(params.data.transferSize / 1000).toFixed(1)} Kb</div>
							</div>`;
				}
			},
			dataZoom: [{
				type: 'slider',
				filterMode: 'weakFilter',
				showDataShadow: false,
				top: 22,
				labelFormatter: ''
			}, {
				type: 'inside',
				filterMode: 'weakFilter'
			}],
			grid: {
				height: 25 * times
			},
			xAxis: {
				min: startTime,
				scale: true,
				axisLabel: {
					formatter: function (val) {
						return Math.max(0, val - startTime) + ' ms';
					}
				}
			},
			yAxis: {
				offset: 0,
				data: categories.map((category) => category.name),
				axisLabel: {
					show: true,
					formatter: function (val) {
						let valueTxt = '';
						if (val.length > 22) {
							valueTxt = `${val.substring(0, 10)}...${val.substring(val.length - 12, val.length)}`;
						}
						else {
							valueTxt = val;
						}
						return `${valueTxt}` ;
					}
				}
			},
			series: [{
				type: 'custom',
				renderItem: renderItem,
				itemStyle: {
					opacity: 0.8
				},
				encode: {
					x: [1, 2],
					y: 0
				},
				data: data
			}]
		};

		option && myChart.setOption(option);
		window.onresize = () => {
			myChart.resize();
		};
	}

	//复制

	initInputElement() {
		const inputElement = document.createElement('input');
		inputElement.style.pointerEvents = 'none';
		inputElement.style.opacity = '0';
		inputElement.style.position = 'fixed';
		document.body.appendChild(inputElement);
		return inputElement;
	}

	copy(text) {
		const inputElement = this.initInputElement();
		inputElement.value = text;
		inputElement.select();
		try {
			return document.execCommand('copy');
		} catch (e) {
			return false;
		}
	}

	getPageUrl(url) {
        if(!url) {
            return '';
        }
        return url.indexOf('?') == -1 ? url : url.replace(url.substr(url.indexOf('?')), '');
    }

	isValidDomain(domain) {
		if (!domain) {
			return false;
		}
		const rule = /^(([-\u4E00-\u9FA5a-z0-9]{1,63})\.)+([\u4E00-\u9FA5a-z]{2,63})\.?$/;
		return rule.test(domain);
	}
}

//初始化util对象
window.util = new utilfn();
