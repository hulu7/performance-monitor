
---

&nbsp;

__前端性能监控系统帮助文档__
========================

&nbsp;

---

&emsp;&emsp;Web的性能一定程度上影响了用户体验和留存率，Google DoubleClick 研究表明：如果一个移动端页面加载时长超过 3 秒，用户就会放弃而离开。BBC 发现网页加载时长每增加 1 秒，用户就会流失 10%。我们希望通过监控来知道 web 应用性能的现状和趋势，找到 web 应用的瓶颈，某次发布后的性能情况怎么样，是否发布后对性能有影响，感知到业务出错的概率，业务的稳定性怎么样等问题都需要解答。

&nbsp;

# 浏览器打开网页的各个阶段

&nbsp;

![](/images/common/performance_stag.png)

&emsp;&emsp;上图是W3C对浏览器performance属性中的各项指标做的解释，各个性能监控工具的各项指标正是基于此计算，只是表展示的方式存在差别。

&nbsp;

# 附 A1 主要名词解释

&nbsp;

- [加载时间]() : 用户等待页面可用的时间，计算方法，loadEventEnd - navigationStart
- [DNS解析时间]() : 用户发起请求后的域名查询时间，建议做DNS 预加载，页面内是不是使用了太多不同的域名导致域名查询的时间太长，计算方法，domainLookupEnd - domainLookupStart
- [TCP连接时间]() : 客户端与服务端完成握手并建立连接所花费的时间，计算方法，connectEnd - connectStart
- [白屏时间]() : 从url导航开始到接收到第一个字节的时间，计算方法，responseStart - navigationStart
- [DOM渲染时间]() : DOM树结构渲染完成的时间，计算方法，domComplete
- [页面准备时间]() : 从url导航开始到开始获取资源之间的时间，计算方法，fetchStart - navigationStart
- [重定向时间]() : 重定向开始到重定向结束之间到时间，计算方法，redirectEnd - redirectStart
- [unload时间]() : 页面资源开始卸载到卸载结束到时间，计算方法，unloadEventEnd - unloadEventStart
- [DOM解析时间]() : DOM树渲染完成到页面可以进行交互到时间，计算方法，domComplete - domInteractive
- [首像素时间]() : 浏览器支持Paint Timing API的话，这个值的Key是first-paint，单位为ms。对于Internet Explorer，这个值的Key是msFirstPaint，单位ms。在Chrome上，这个值从loadTimes().firstPaintTime读取，单位为ms
- [首次内容绘制时间]() : 测量浏览器从导航开始到渲染第一个DOM内容的时间。图片、非空的< canvas>元素和SVG都被划归为DOM内容。iframe的内容则不算在内
- [视觉就绪时间]() : 下面几个时间中最长的哪一个：
  * *1 . 最大的元素显示时间（Largest Contentful Paint）（如果可用)*
  * *2 . 第一个元素显示时间（First Contentful Paint）（如果可用）*
  * *3 . 首像素时间（First Paint）（如果可用）*
  * *4 . 所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间（domContentLoadedEventEnd）（如果配置了）*
  * *5 . 巨幅插图加载完成时间（如果配置了）*
  * *6 . 框架加载完成，例如VUE的框架加载完成或者一个按钮的点击回调函数注册完成（如果配置了）*
- [可感知加载时间]() : 测量浏览器从导航开始到渲染第一个DOM内容的时间。图片、非空的< canvas>元素和SVG都被划归为DOM内容。iframe的内容则不算在内
- [DOM构建时间]() : 导航开始到DOM准备好到时间，此时所有脚本都执行完成，计算方法，domContentLoadedEventEnd - navigationStart
- [request请求时间]() : 所有内容加载完成时间，计算方法，responseEnd - requestStart

&nbsp;

# 附 A2 Navigation Timing API名词解释

&nbsp;

- [loadEventEnd]() : 返回当load事件结束，即加载事件完成时的时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0
- [navigationStart]() : 表征了从同一个浏览器上下文的上一个文档卸载(unload)结束时的时间戳。如果没有上一个文档，这个值会和fetchStart相同
- [domainLookupEnd]() : 表征了域名查询结束的时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致
- [domainLookupStart]() : 表征了域名查询开始的时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致
- [responseStart]() : 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被设制成新的请求的相对应的发起时间
- [connectEnd]() : 返回浏览器与服务器之间的连接建立时的时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束
- [connectStart]() : 返回HTTP请求开始向服务器发送时的时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值
- [domContentLoadedEventEnd]() : 返回当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳
- [domComplete]() : 返回当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange (en-US) 被触发时的时间戳
- [fetchStart]() : 表征了浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳。这个时间点会在检查任何应用缓存之前
- [redirectEnd]() : 表征了最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0
- [redirectStart]() : 表征了第一个HTTP重定向开始时的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0
- [unloadEventEnd]() : 表征了unload事件处理完成时的时间戳。如果没有上一个文档，或者上一个文档需要重定向，或者重定向中的一个不同源，这个值会返回0
- [unloadEventStart]() : 表征了unload事件抛出时的时间戳。如果没有上一个文档，或者上一个文档需要重定向，或者重定向中的一个不同源，这个值会返回0
- [responseEnd]() : 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的时间戳
- [requestStart]() : 返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的时间戳
- [domInteractive]() : 返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的时间戳
