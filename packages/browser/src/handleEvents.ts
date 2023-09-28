import { BREADCRUMBTYPES, ERRORTYPES, ERROR_TYPE_RE, HTTP_CODE } from '@hpf2e/sentinel-shared'
import { transportData, breadcrumb, resourceTransform, httpTransform, options, handleConsoleBreadcrumb, log } from '@hpf2e/sentinel-core';
import { getLocationHref, getTimestamp, isError, parseUrlToObj, extractErrorStack, unknownToString, Severity, isHttpFail, variableTypeDetection, logger } from '@hpf2e/sentinel-utils'
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
        ...extractErrorStack(ev.reason, Severity.Normal)
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
      logger.log(`%c捕获到错误`, 'color: blue; font-weight: bold;', data)

      /**
        * 处理由 error event触发的事件并被console.error包装后抛出的case
        * ErrorEvent 事件对象在脚本发生错误时产生，它可以提供发生错误的脚本文件的文件名，以及发生错误时所在的行号等信息。
        * window.addEventListener('error', (values) => {
        *   console.error(values)
        * })
        */
      const ErrorEvent = args.find(arg => Object.prototype.toString.call(ErrorEvent) === '[object ErrorEvent]');
      if (ErrorEvent) {
        this.handleError(ErrorEvent);
        return
      }

      /**
      * 此时为自定义上报，例如
      * throw Error('发生错误')
      * console.log('error', Error('发生错误'))
      */
      const Error = args.find(arg => isError(arg)) as Error;
      if (Error) {
        log({
          message: Error.message,
          tag: 'console.error',
          level: Severity.Normal,
          type: ERRORTYPES.CONSOLE_ERROR,
          ex: Error,
        })
        return
      }


      // 捕获 console.error('错误')
      const isStringError = args.every(arg => variableTypeDetection.isString(arg));
      if (isStringError) {
        log({
          message: args.join('——'),
          tag: 'console.error',
          level: Severity.Low,
          type: ERRORTYPES.CONSOLE_ERROR,
        })
        return
      }
    }
  }
}

export { HandleEvents }