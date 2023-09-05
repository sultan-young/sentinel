import { InitOptions } from '@hpf2e/sentinel-types'
import { generateUUID, toStringValidateOption, validateOption, _support, setSilentFlag, logger } from '@hpf2e/sentinel-utils'
import { breadcrumb } from './breadcrumb'
import { transportData } from './transportData'
export class Options {
  beforeAppAjaxSend: Function = () => {}
  enableTraceId: Boolean
  filterXhrUrlRegExp: RegExp
  includeHttpUrlTraceIdRegExp: RegExp
  traceIdFieldName = 'Trace-Id'
  throttleDelayTime = 0
  maxDuplicateCount = 2
  // wx-mini
  appOnLaunch: Function = () => {}
  appOnShow: Function = () => {}
  onPageNotFound: Function = () => {}
  appOnHide: Function = () => {}
  pageOnUnload: Function = () => {}
  pageOnShow: Function = () => {}
  pageOnHide: Function = () => {}
  onShareAppMessage: Function = () => {}
  onShareTimeline: Function = () => {}
  onTabItemTap: Function = () => {}
  // need return opitons，so defaul value is undefined
  wxNavigateToMiniProgram: Function
  triggerWxEvent: Function = () => {}
  onRouteChange?: Function

  constructor() {
    this.enableTraceId = false
  }
  bindOptions(options: InitOptions = {}): void {
    options.beforeAppAjaxSend && (this.beforeAppAjaxSend = options.beforeAppAjaxSend)
    // wx-mini hooks
    options.appOnLaunch && (this.appOnLaunch = options.appOnLaunch)
    options.appOnShow && (this.appOnShow = options.appOnShow)
    options.appOnHide && (this.appOnHide = options.appOnHide)
    options.pageOnUnload && (this.pageOnUnload = options.pageOnUnload)
    options.pageOnShow && (this.pageOnShow = options.pageOnShow)
    options.pageOnHide && (this.pageOnHide = options.pageOnHide)
    options.onPageNotFound && (this.onPageNotFound = options.onPageNotFound)
    options.onShareAppMessage && (this.onShareAppMessage = options.onShareAppMessage)
    options.onShareTimeline && (this.onShareTimeline = options.onShareTimeline)
    options.onTabItemTap && (this.onTabItemTap = options.onTabItemTap)
    options.wxNavigateToMiniProgram && (this.wxNavigateToMiniProgram = options.wxNavigateToMiniProgram)
    options.triggerWxEvent && (this.triggerWxEvent = options.triggerWxEvent)
    // browser hooks
    options.onRouteChange && (this.onRouteChange = options.onRouteChange)

    options.enableTraceId && (this.enableTraceId = options.enableTraceId)
    options.traceIdFieldName && (this.traceIdFieldName = options.traceIdFieldName)
    options.throttleDelayTime && (this.throttleDelayTime = options.throttleDelayTime)
    options.maxDuplicateCount && (this.maxDuplicateCount = options.maxDuplicateCount)
    options.filterXhrUrlRegExp && (this.filterXhrUrlRegExp = options.filterXhrUrlRegExp)
    options.includeHttpUrlTraceIdRegExp && (this.includeHttpUrlTraceIdRegExp = options.includeHttpUrlTraceIdRegExp)
  }
}

const options = _support.options || (_support.options = new Options())

export function setTraceId(httpUrl: string, callback: (headerFieldName: string, traceId: string) => void) {
  const { includeHttpUrlTraceIdRegExp, enableTraceId } = options
  if (enableTraceId && includeHttpUrlTraceIdRegExp && includeHttpUrlTraceIdRegExp.test(httpUrl)) {
    const traceId = generateUUID()
    callback(options.traceIdFieldName, traceId)
  }
}

/**
 * init core methods
 * @param paramOptions
 */
export function initOptions(paramOptions: InitOptions = {}) {
  setSilentFlag(paramOptions)
  breadcrumb.bindOptions(paramOptions)
  logger.bindOptions(paramOptions.debug)
  transportData.bindOptions(paramOptions)
  options.bindOptions(paramOptions)
}

export { options }
