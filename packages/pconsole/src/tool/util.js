import md5 from 'md5'
import fs from 'fs'
import {
    SYSTEM
} from '../config'

//config配置
class util {

    constructor() {

    }

    // 返回结果json
    result(jn = {}) {
        return Object.assign({
            code: 1000,
            desc: '成功',
            data: ''
        }, jn);
    }

    // 错误返回
    /*  
    **  ctx        //ctx
    **  err      //err
    **  code    //错误码
    */
    errResult(ctx, err, code = '') {
        let errCode = [
            {code:1002,desc:'服务异常'},
            {code:1003,desc:'必填参数缺失！'},
        ];
        let desc = '未知错误！';
        errCode.forEach((item)=>{
            if(item.code == code){
                desc = item.desc; 
            }
        });
        console.log(err);
        ctx.body = this.result({
            desc:desc,
            code:code
        });
    }

    // 检查接口来源权限
    checkReferer(cxt) {
        let begin = false;
        let url = SYSTEM.ORIGIN
        let header = cxt.request.header

        url = SYSTEM.ORIGIN

        if (header.referer.indexOf(url) != -1 ) {
            begin = true;
        }
        return begin;
    }

    // 验证域名来源
    verSource(ctx) {
        return true;
        // let referer = this.checkReferer(ctx);
        // if (!referer) {
        //     ctx.body = this.result({
        //         code: 1001,
        //         desc: '域名来源未通过！'
        //     });
        //     return false;
        // } else {
        //     return true;
        // }
    };

    // http 签名验证验证参数
    checkSiginHttp(ctx) {
        let datas = ctx.request.body
        if (!datas) {
            ctx.body = this.result({
                code: 1001,
                desc: '缺少必要的验证签名参数！'
            });
            return false;
        }
        let getSign = null;


        if (typeof(datas) == 'string') {
            datas = JSON.parse(datas)
        }

        if (datas.fields) {
            getSign = datas.fields.getSign
        } else {
            getSign = datas.getSign
        }

        if (typeof(getSign) == 'string') {
            getSign = JSON.parse(getSign)
        }

        if (!getSign || !getSign.time || !getSign.random || !getSign.paySign) {
            return false;
        };
        let sigin = this.signwx({
            name: 'wangwei',
            company: 'morning-star',
            time: getSign.time,
            random: getSign.random
        });
        if (sigin.paySign === getSign.paySign) {
            return true;
        } else {
            ctx.body = this.result({
                code: 1001,
                desc: '签名验证未通过！'
            });
            return false;
        }
    };

    /*本地加密算法*/
    signwx(json) {
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
        var md5Str = md5(str);
        var signstr = md5Str.toUpperCase();
        /*获得有sign参数的json*/
        newJson['paySign'] = signstr;
        return newJson;
    }

    //返回备注
    returnBeiZhu(str) {
        return `
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------${str}---------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
        `
    }

    /*生成随机字符串*/
    randomString(len) {　　
        len = len || 32;　　
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
        var maxPos = $chars.length;　　
        var pwd = '';　　
        for (let i = 0; i < len; i++) {　　　　
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
        }　　
        return pwd;
    }

    // 文件大小换算
    returnFileSize(bumber){
        let size    =   bumber;
        let defaudw =   1024;
            size    =   Math.ceil(size/defaudw)
        if(size >= defaudw){
            size    =   (size/defaudw).toFixed(2)
            if(size >= defaudw){
                size    =   (size/defaudw).toFixed(2)
                return size+'G'
            }else{
                return size+'M'
            }
        }else{
            return size+'KB'
        }    
    }

    // 遍历某文件下面文件列表信息
    getSomeFileChildDirList(dir){
        let val = []
        let result = fs.readdirSync(dir)
        if(result&&result.length){
            result.forEach(item=>{
                let stat = fs.lstatSync(dir+item)
                if(stat.isDirectory()&&item!='.git'){
                    val.push(item)
                }
            })
        }
        return val;
    }

    //Pager分页
    /*  
    **  list        //数据源
    **  page      //当前页数
    **  pageSize    //每页个数
    */
    Pager(obj){
        let result = {};
        result['data'] = obj.data||[];
        result['pageNo'] = obj.pageNo||1;
        result['pageSize'] = obj.pageSize||result.data.length;
        result['totalNum'] = result.data.length;
        result['list'] = result.data.splice((result.pageNo-1)*result.pageSize, result.pageSize);
        delete result.data;
        return result;
    }

    /*传入一个对象，返回该对象的值不为空的所有参数，并返回一个对象
    obj   object    传入的对象
    */
    objDislodge(obj) {
        var objData = JSON.parse(JSON.stringify(obj));
        for (var n in objData) {
            if (objData[n] == null || objData[n] == '') {
                delete objData[n]
            }
        }
        return objData;
    }

    /*传入一个json对象，返回该对象的值不为空的所有参数，并返回一个对象
    json   object    传入的对象
    */
    jsonDislodge(json) {
        var objData = JSON.parse(JSON.stringify(obj));
        objData.forEach((item, index) => {
            for (let n in item) {
                if (item[n] == null || item[n] == '') {
                    delete item[n]
                }
            }
        })
        return objData;
    }

    //node删除文件夹内的所有文件
    cleanFiles(pathImg) {
        //删除上传到本地的文件
        let files = fs.readdirSync(pathImg);
        files.forEach(function (file, index) {
            var curPath = pathImg + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        })
    }

    //判断是不是静态资源
	isStaticSource(url) {
		if (!url) {
			return false;
		}
		const postfixes = ['js', 'html', 'css', 'json', 'php', 'htm', 'jpg',
			'png', 'svg', 'jpeg', 'ico', 'avi', 'mp4', 'mp3', 'jsx', 'ts', 'doc',
			'docs', 'ppt', 'pptx', 'xls', 'xlsx', 'gif', 'woff', 'ttf', 'fon', 'ttc', 'map',
            'zip', 'zipx', 'rar'
		];
		let requestStr = url;
		if (requestStr.indexOf('?') !== -1) {
			requestStr = url.substring(0, url.indexOf('?'));
		}
		const parts = requestStr.split('.');
		const postfix = parts[parts.length - 1];
		return postfixes.indexOf(postfix.toLowerCase()) !== -1;
	}

    //获取pageId
    getPageId(url) {
        if (!url) {
            return '';
        }
        const utilInstance = new util();
        return md5(utilInstance.getPageUrl(url));
    }

    //将值MD5类型hash值
    convert2Md5(org) {
        if (!org) {
            return '';
        }
        return md5(org);
    }

    getPageUrl(url) {
        if(!url) {
            return '';
        }
        return url.indexOf('?') == -1 ? url : url.replace(url.substr(url.indexOf('?')), '');
    }

    //获取pageId
    Binary(initData, p, l, bl) {
        const utilInstance = new util();
        var data = initData && initData.constructor == Array ? initData.slice() : [],
        p = p | 0,
        l = l | 0,
        bl = Math.max((bl || 8) | 0, 1),
        mask = m(bl),
        _m = 0xFFFFFFFF; //数据，指针，长度，位长度，遮罩
        this.data = function(index, value) {
            if (!isNaN(value)) data[index] = (value | 0) || 0;
            if (!isNaN(index)) return data[index];
            else return data.slice();
        }
     
        this.read = () => {
            let re;
            if (p >= l) return 0;
            if (32 - (p % 32) < bl) {
                re = (((data[p >> 5] & m(32 - (p % 32))) << ((p + bl) % 32)) | (data[(p >> 5) + 1] >>> (32 - ((p + bl) % 32)))) & mask;
            } else {
                re = (data[p >> 5] >>> (32 - (p + bl) % 32)) & mask;
            }
            p += bl;
            return re;
        }
     
        this.write = (i) => {
            var i, hi, li;
            i &= mask;
            if (32 - (l % 32) < bl) {
                data[l >> 5] |= i >>> (bl - (32 - (l % 32)));
                data[(l >> 5) + 1] |= (i << (32 - ((l + bl) % 32))) & _m;
            } else {
                data[l >> 5] |= (i << (32 - ((l + bl) % 32))) & _m;
            }
            l += bl;
        }
     
        this.eof = function() {
            return p >= l;
        }
     
        this.reset = function() {
            p = 0;
            mask = m(bl);
        }
        this.resetAll = function() {
            data = [];
            p = 0;
            l = 0;
            bl = 8;
            mask = m(bl);
            _m = 0xFFFFFFFF;
        }
     
        this.setBitLength = function(len) {
            bl = Math.max(len | 0, 1);
            mask = m(bl);
        }
     
        this.toHexString = function() {
            let re = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] < 0) {
                    re.push(pad((data[i] >>> 16).toString(16), 4) + pad((data[i] & 0xFFFF).toString(16), 4));
                } else {
                    re.push(pad(data[i].toString(16), 8));
                }
            }
            return re.join("");
        }
     
        this.toBinaryString = function() {
            let re = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] < 0) {
                    re.push(pad((data[i] >>> 1).toString(2), 31) + (data[i] & 1));
                } else {
                    re.push(pad(data[i].toString(2), 32));
                }
            }
            return re.join("").substring(0, l);
        }
     
        this.toCString = function() {
            let _p = p,
            _bl = bl,
            re = [];
            this.setBitLength(13);
            this.reset();
            while (p < l) re.push(C(this.read()));
            this.setBitLength(_bl);
            p = _p;
            return C(l >>> 13) + C(l & m(13)) + re.join("");
        }
     
        this.fromCString = function(str) {
            this.resetAll();
            this.setBitLength(13);
            for (let i = 2; i < str.length; i++) this.write(D(str, i));
            l = (D(str, 0) << 13) | (D(str, 1) & m(13));
            return this;
        }
     
        this.clone = function() {
            return new utilInstance.Binary(data, p, l, bl);
        }
        function m(len) {
            return (1 << len) - 1;
        }
        function pad(s, len) {
            return (new Array(len + 1)).join("0").substring(s.length) + s;
        }
        function C(i) {
            return String.fromCharCode(i + 0x4e00);
        }
        function D(s, i) {
            return s.charCodeAt(i) - 0x4e00;
        }
    }
     
    //压缩
    compress(str) {
        if (!str) {
            return '';
        }
        const utilInstance = new util();
        let b = new utilInstance.Binary(),
        code_index = -1,
        char_len = 8;
        var str = str.replace(/[\u0100-\uFFFF]/g,
        function(s) {
            return "\&\#u" + pad(s.charCodeAt(0).toString(16), 4) + ";";
        });
        let dic = {},
        cp = [],
        cpi,
        bl = 8;
        b.setBitLength(bl);
        for (let i = 0; i < (1 << char_len) + 2; i++) dic[i] = ++code_index;
        cp[0] = str.charCodeAt(0);
        for (let i = 1; i < str.length; i++) {
            cp[1] = str.charCodeAt(i);
            cpi = (cp[0] << 16) | cp[1];
            if (dic[cpi] == undefined) {
                dic[cpi] = (++code_index);
                if (cp[0] > m(bl)) {
                    b.write(0x80);
                    b.setBitLength(++bl);
                }
                b.write(cp[0]);
                cp[0] = cp[1];
            } else {
                cp[0] = dic[cpi];
            }
        }
        b.write(cp[0]);
        function pad(s, len) {
            return (new Array(len + 1)).join("0").substring(s.length) + s;
        }
        function m(len) {
            return (1 << len) - 1;
        }
        return b.toCString();
    }
     
    // 解压
    decompress(s) {
        if (!s) {
            return '';
        }
        let b = new
        function() {
            let d = [],
            p = 0,
            l = 0,
            L = 13,
            k = m(L),
            _m = 0xFFFFFFFF;
            this.r = function() {
                let r;
                if (32 - (p % 32) < L) r = (((d[p >> 5] & m(32 - (p % 32))) << ((p + L) % 32)) | (d[(p >> 5) + 1] >>> (32 - ((p + L) % 32)))) & k;
                else r = (d[p >> 5] >>> (32 - (p + L) % 32)) & k;
                p += L;
                return r;
            };
            this.w = function(i) {
                i &= k;
                if (32 - (l % 32) < L) {
                    d[l >> 5] |= i >>> (L - (32 - (l % 32)));
                    d[(l >> 5) + 1] |= (i << (32 - ((l + L) % 32))) & _m;
                } else d[l >> 5] |= (i << (32 - ((l + L) % 32))) & _m;
                l += L;
            };
            this.e = function() {
                return p >= l;
            };
            this.l = function(len) {
                L = Math.max(len | 0, 1);
                k = m(L);
            };
            function m(len) {
                return (1 << len) - 1;
            }
            function pad(s, l) {
                return (new Array(l + 1)).join("0").substring(s.length) + s;
            }
            for (let i = 2; i < s.length; i++) this.w(s.charCodeAt(i) - 0x4e00);
            l = ((s.charCodeAt(0) - 0x4e00) << 13) | ((s.charCodeAt(1) - 0x4e00) & m(13));
            p = 0;
        };
        let R = [],
        C = -1,
        D = {},
        P = [],
        L = 8;
        for (let i = 0; i < (1 << L) + 2; i++) D[i] = String.fromCharCode(++C);
        b.l(L);
        P[0] = b.r();
        while (!b.e()) {
            P[1] = b.r();
            if (P[1] == 0x80) {
                b.l(++L);
                P[1] = b.r();
            }
            if (D[P[1]] == undefined) D[++C] = D[P[0]] + D[P[0]].charAt(0);
            else D[++C] = D[P[0]] + D[P[1]].charAt(0);
            R.push(D[P[0]]);
            P[0] = P[1];
        }
        R.push(D[P[0]]);
        return R.join("").replace(/\&\#u[0-9a-fA-F]{4};/g,
        function(w) {
            return String.fromCharCode(parseInt(w.substring(3, 7), 16));
        });
    }

    formatSqlstr(sqlstr, safepara) {
        return sqlstr.replace(`'${safepara}'`, safepara)
    }
}

module.exports = new util();



