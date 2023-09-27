import { BREADCRUMBTYPES, ERRORTYPES, ERROR_TYPE_RE, HTTP_CODE } from '@hpf2e/sentinel-shared'
import { transportData, breadcrumb, resourceTransform, httpTransform, options, handleConsoleBreadcrumb, log } from '@hpf2e/sentinel-core';
import { getLocationHref, getTimestamp, isError, parseUrlToObj, extractErrorStack, unknownToString, Severity, isHttpFail } from '@hpf2e/sentinel-utils'
import { ReportDataType, Replace, SENTINELHttp, ResourceErrorTarget } from '@hpf2e/sentinel-types'


const HandleEvents = {
  /**
   * 处理xhr、fetch回调
   */
  handleHttp(data: SENTINELHttp, type: BREADCRUMBTYPES): void {
    let isError = isHttpFail(data.status);
    if (!isError && typeof options.isRequestFail === 'function') {
      isError = options.isRequestFail(data.responseText);
    }
    const result = httpTransform(data)
    breadcrumb.push({
      type,
      category: breadcrumb.getCategory(type),
      data: { ...result },
      level: Severity.Info,
      time: data.time
    })
    if (isError) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(BREADCRUMBTYPES.CODE_ERROR),
        data: { ...result },
        level: Severity.Error,
        time: data.time
      })
      transportData.send(result)
    }
  },
  /**
   * 处理window的error的监听回到
   */
  handleError(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget
    if (target.localName) {
      // 资源加载错误 提取有用数据
      const data = resourceTransform(errorEvent.target as ResourceErrorTarget)
      breadcrumb.push({
        type: BREADCRUMBTYPES.RESOURCE,
        category: breadcrumb.getCategory(BREADCRUMBTYPES.RESOURCE),
        data,
        level: Severity.Error
      })
      return transportData.send(data)
    }
    // code error
    const { message, filename, lineno, colno, error } = errorEvent
    let result: ReportDataType
    if (error && isError(error)) {
      result = extractErrorStack(error, Severity.Normal)
    }
    // 处理SyntaxError，stack没有lineno、colno
    result || (result = HandleEvents.handleNotErrorInstance(message, filename, lineno, colno))
    result.type = ERRORTYPES.JAVASCRIPT_ERROR
    breadcrumb.push({
      type: BREADCRUMBTYPES.CODE_ERROR,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.CODE_ERROR),
      data: { ...result },
      level: Severity.Error
    })
    transportData.send(result)
  },
  handleNotErrorInstance(message: string, filename: string, lineno: number, colno: number) {
    let name: string | ERRORTYPES = ERRORTYPES.UNKNOWN
    const url = filename || getLocationHref()
    let msg = message
    const matches = message.match(ERROR_TYPE_RE)
    if (matches[1]) {
      name = matches[1]
      msg = matches[2]
    }
    const element = {
      url,
      func: ERRORTYPES.UNKNOWN_FUNCTION,
      args: ERRORTYPES.UNKNOWN,
      line: lineno,
      col: colno
    }
    return {
      url,
      name,
      message: msg,
      level: Severity.Normal,
      time: getTimestamp(),
      stack: [element]
    }
  },
  handleHistory(data: Replace.IRouter): void {
    const { from, to } = data
    const { relative: parsedFrom } = parseUrlToObj(from)
    const { relative: parsedTo } = parseUrlToObj(to)
    breadcrumb.push({
      type: BREADCRUMBTYPES.ROUTE,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.ROUTE),
      data: {
        from: parsedFrom ? parsedFrom : '/',
        to: parsedTo ? parsedTo : '/'
      },
      level: Severity.Info
    })
    const { onRouteChange } = options;
    if (onRouteChange) {
      onRouteChange(from, to)
    }
  },
  handleHashchange(data: HashChangeEvent): void {
    const { oldURL, newURL } = data
    const { relative: from } = parseUrlToObj(oldURL)
    const { relative: to } = parseUrlToObj(newURL)
    breadcrumb.push({
      type: BREADCRUMBTYPES.ROUTE,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.ROUTE),
      data: {
        from,
        to
      },
      level: Severity.Info
    })
    const { onRouteChange } = options;
    if (onRouteChange) {
      onRouteChange(from, to)
    }
  },
  handleUnhandleRejection(ev: PromiseRejectionEvent): void {
    let data: ReportDataType = {
      type: ERRORTYPES.PROMISE_ERROR,
      message: unknownToString(ev.reason),
      url: getLocationHref(),
      name: ev.type,
      time: getTimestamp(),
      level: Severity.Low
    }
    if (isError(ev.reason)) {
      data = {
        ...data,
        ...extractErrorStack(ev.reason, Severity.Low)
      }
    }
    breadcrumb.push({
      type: BREADCRUMBTYPES.UNHANDLEDREJECTION,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.UNHANDLEDREJECTION),
      data: { ...data },
      level: Severity.Error
    })
    transportData.send(data)
  },
  // 处理console上报的错误
  handleConsole(data: {args: any[], level: string}): void {
    handleConsoleBreadcrumb(data)
    const { args, level } = data;
    if (level === 'error') {  
      if (!args?.length) return;
      
      console.log(`%c捕获到错误`, 'color: blue; font-weight: bold;', args)
      if (args.length === 1) {
        /**
        * 处理由 error event触发的事件并被console.error包装后抛出的case
        * window.addEventListener('error', (values) => {
        *   console.error(values)
        * })
        */
        if (args[0] instanceof ErrorEvent) {
          this.handleError(args[0])
        }
        // 捕获 console.error('错误')
        if (typeof args[0] === 'string') {
          log({
            message: args[0],
            tag: 'console.error',
            level: Severity.Normal,
            type: ERRORTYPES.LOG_ERROR,
          })
        }
      } 
      /**
      * 此时为自定义上报，例如
      * throw Error('发生错误')
      */
      else {
        let ex = args.find(arg => isError(arg)) as Error;
        if (!ex) return;
        log({
          message: ex.message,
          tag: 'console.error',
          level: Severity.Normal,
          type: ERRORTYPES.LOG_ERROR,
          ex,
        })
      }
    }
  }
}

export { HandleEvents }


// ERROR,Error: Uncaught (in promise): Error: 错误
// Error: 错误
//     at new ExampleComponent (http://admin-dev.hungrypanda.cn:4200/example.module.js:1372:15)
//     at NodeInjectorFactory.ExampleComponent_Factory [as factory] (ng:///ExampleComponent/ɵfac.js:4:10)
//     at getNodeInjectable (http://admin-dev.hungrypanda.cn:4200/vendor.js:83673:44)
//     at instantiateRootComponent (http://admin-dev.hungrypanda.cn:4200/vendor.js:90292:23)
//     at createRootComponent (http://admin-dev.hungrypanda.cn:4200/vendor.js:92396:23)
//     at ComponentFactory.create (http://admin-dev.hungrypanda.cn:4200/vendor.js:101753:25)
//     at ViewContainerRef.createComponent (http://admin-dev.hungrypanda.cn:4200/vendor.js:103017:47)
//     at RouterOutlet.activateWith (http://admin-dev.hungrypanda.cn:4200/vendor.js:131850:36)
//     at ActivateRoutes.activateRoutes (http://admin-dev.hungrypanda.cn:4200/vendor.js:131443:28)
//     at http://admin-dev.hungrypanda.cn:4200/vendor.js:131390:12