#coding:utf-8
from multiprocessing import Pool
import codecs
import csv
import requests

itemsUrl = ""
detailsUrl = ""
itemsParas = {
    "pageNo": 1,
    "pageSize": 10,
    "appId": "",
    "beginTime": "",
    "endTime": "",
    "userId": ""
}
detailsParas = {
    "id": 1
}
headers = {
    "content-type": "application/json; charset=utf-8"
}

def initFile():
    header = ['页面id', '用户PIN', '页面加载时间(ms)', '白屏时间(ms)', '页面可用请求时间(ms)', '首像素时间(ms)', '首次内容绘制时间(ms)',
               '可交互时间(ms)', '视觉就绪时间(ms)', '可感知加载时间(ms)', 'DOM构建时间(ms)', '解析DOM时间(ms)', 'DNS解析时间(ms)', 'TCP连接时间(ms)',
               '浏览器', '用户操作系统', 'CPU并发数量', '有效带宽', '访问时间', '主框架DOM节点数', '主框架script节点数', '主框架外部script节点数',
               '主框架资源请求数', 'iframe个数', 'IMG节点个数', 'LINK节点个数', 'CSS节点个数', '瀑布流数据']
    csvfile = file('data.csv', 'wb')
    csvfile.write(codecs.BOM_UTF8)
    with open('data.csv', 'w') as f:
        f_w = csv.writer(f)
        f_w.writerow(header)

def save(i):
    rows = []
    rows.append((i['pageId'], i['userId'], i['loadTime'], i['whiteTime'], i['requestTime'], i['firstPaint'],
                 i['firstContentfulPaint'],
                 i['timeToInteractive'], i['visuallyReadyTime'], i['perceivedLoadTime'], i['domTime'],
                 i['analysisDomTime'], i['dnsTime'], i['tcpTime'],
                 i['browser'], i['system'], i['cpuConcurrency'], i['downlink'], i['createTime'], i['domsNumber'],
                 i['scriptNumber'], i['externalScriptNumber'],
                 i['resourcesFetchNumber'], i['iframeNumber'], i['imgNumber'], i['linkNumber'], i['cssNumber'],
                 i['restiming']))

    with open('data.csv', 'a') as f:
        f_w = csv.writer(f)
        f_w.writerows(rows)

def runTask(id):
    detailsParas['id'] = id
    r = requests.post(detailsUrl, headers=headers, json=detailsParas)
    format_data = r.json()
    print 'pageId: +++ {0}'.format(format_data['data']['pageId'])
    save(format_data['data'])

def getDetails(items):
    c = 1
    pool = Pool(10)
    for i in items:
        print 'count: {0} ------'.format(c)
        pool.apply(runTask, (i['id'],))
        c += 1

def run():
    initFile()
    finished = []
    result = []
    itemsParas['pageSize'] = 500
    for i in range(1, 8):
        print 'items: {0}'.format(i)
        itemsParas['pageNo'] = i
        r = requests.post(itemsUrl, headers=headers, json=itemsParas)
        format_data = r.json()
        for item in format_data['data']['datalist']:
            if item['pageId'] not in finished:
                result.append(item)
                finished.append(item['pageId'])
        print 'items length: {0}'.format(len(result))
    getDetails(result)

if __name__ == '__main__':
    run()