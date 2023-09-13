import { InitOptions } from '@hpf2e/sentinel-types'
import { generateUUID, toStringValidateOption, validateOption, _support, setSilentFlag, logger, Logger } from '@hpf2e/sentinel-utils'
import { Breadcrumb, breadcrumb } from './breadcrumb'
import { TransportData, transportData } from './transportData'

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

export interface OptionsAdapters {
  breadcrumb?: Breadcrumb,
  logger?: Logger,
  transportData?: TransportData,
  options?: Options,
}

/**
 * init core methods
 * @param paramOptions
 */
export function initOptions(paramOptions: InitOptions = {}, adapters?: OptionsAdapters) {
  setSilentFlag(paramOptions)
  breadcrumb.bindOptions(paramOptions)
  logger.bindOptions(paramOptions.debug)

  let _transportData = adapters?.transportData || transportData;
  _transportData.bindOptions(paramOptions)

  let _options = adapters?.options || options;
  _options.bindOptions(paramOptions)
}

export { options }
