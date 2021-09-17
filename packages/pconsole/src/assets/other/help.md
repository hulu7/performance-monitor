---
__前端性能监控系统帮助文档__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

---

# 附 A1 主要名词解释

##

- __加载时间__: loadEventEnd - navigationStart
- __DNS解析时间__: domainLookupEnd - domainLookupStart
- __TCP建立时间__: connectEnd - connectStart
- __白屏时间__: responseStart - navigationStart
- __DOM渲染完成时间__: domContentLoadedEventEnd - navigationStart
- __页面准备时间__: fetchStart - navigationStart
- __重定向时间__: redirectEnd - redirectStart
- __unload时间__: unloadEventEnd - unloadEventStart
- __页面解析DOM时间__: domComplete - domInteractive
- __首像素时间__: 浏览器支持Paint Timing API的话，这个值的Key是first-paint，单位为ms。对于Internet Explorer，这个值的Key是msFirstPaint，单位ms。在Chrome上，这个值从loadTimes().firstPaintTime读取，单位为ms
- __首次内容绘制时间__: 测量浏览器从导航开始到渲染第一个DOM内容的时间。图片、非空的< canvas>元素和SVG都被划归为DOM内容。iframe的内容则不算在内
- __视觉就绪时间__: 下面四个时间中最长的哪一个：
  > - 最大的元素显示时间（Largest Contentful Paint）（如果可用）
  > - 第一个元素显示时间（First Contentful Paint）（如果可用）
  > - 首像素时间（First Paint）（如果可用）
  > - 所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间（domContentLoadedEventEnd）（如果配置了）
  > - 巨幅插图加载完成时间（如果配置了）
  > - 框架加载完成，例如VUE的框架加载完成或者一个按钮的点击回调函数注册完成（如果配置了）
- __可感知加载时间__: 测量浏览器从导航开始到渲染第一个DOM内容的时间。图片、非空的< canvas>元素和SVG都被划归为DOM内容。iframe的内容则不算在内
- __DOM构建时间__: 
- __TCP连接时间__:
- __页面准备时间__:

##

# 附 A2 Navigation Timing API名词解释

##

- __loadEventEnd__: 返回当load事件结束，即加载事件完成时的时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0
- __navigationStart__: 表征了从同一个浏览器上下文的上一个文档卸载(unload)结束时的时间戳。如果没有上一个文档，这个值会和fetchStart相同
- __domainLookupEnd__: 表征了域名查询结束的时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致
- __domainLookupStart__: 表征了域名查询开始的时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致
- __responseStart__: 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被设制成新的请求的相对应的发起时间
- __connectEnd__: 返回浏览器与服务器之间的连接建立时的时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束
- __connectStart__: 返回HTTP请求开始向服务器发送时的时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值
- __domContentLoadedEventEnd__: 返回当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳
- __domComplete__: 返回当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange (en-US) 被触发时的时间戳
- __fetchStart__: 表征了浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳。这个时间点会在检查任何应用缓存之前
- __redirectEnd__: 表征了最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0
- __redirectStart__: 表征了第一个HTTP重定向开始时的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0
- __unloadEventEnd__: 表征了unload事件处理完成时的时间戳。如果没有上一个文档，或者上一个文档需要重定向，或者重定向中的一个不同源，这个值会返回0
- __unloadEventStart__: 表征了unload事件抛出时的时间戳。如果没有上一个文档，或者上一个文档需要重定向，或者重定向中的一个不同源，这个值会返回0
- __responseEnd__: 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的时间戳
- __requestStart__: 返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的时间戳
- __domInteractive__: 返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的时间戳
