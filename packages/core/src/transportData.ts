import { _support, validateOption, logger, isBrowserEnv, isWxMiniEnv, variableTypeDetection, Queue, isEmpty, throttle } from '@hpf2e/sentinel-utils'
import { createErrorId } from './errorId'
import { SDK_NAME, SDK_VERSION } from '@hpf2e/sentinel-shared'
import { breadcrumb } from './breadcrumb'
import { SdkInfo, TransportDataType, EMethods, InitOptions, isReportDataType, DeviceInfo, FinalReportType, BnsInfo } from '@hpf2e/sentinel-types'
/**
 * 用来传输数据类，包含img标签、xhr请求
 * 功能：支持img请求和xhr请求、可以断点续存（保存在localstorage），
 * 待开发：目前不需要断点续存，因为接口不是很多，只有错误时才触发，如果接口太多可以考虑合并接口、
 *
 * ../class Transport
 */
export class TransportData {
  queue: Queue
  beforeDataReport: unknown = null
  configReportXhr: unknown = null
  configReportUrl: unknown = null
  configReportWxRequest: unknown = null
  useImgUpload = false
  errorDsn = ''
  bnsInfo = {
    projectName: 'unKnow'
  }
  constructor() {
    this.queue = new Queue()
  }
  imgRequest(data: any, url: string): void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`
      img = null
    }
    this.queue.addFn(requestFun)
  }
  getDeviceInfo(): DeviceInfo | any {
    return _support.deviceInfo || {}
  }
  async beforePost(data: FinalReportType) {
    if (isReportDataType(data)) {
      const errorId = createErrorId(data)
      if (!errorId) return false
      data.errorId = errorId
    }
    let transportData = this.getTransportData(data)
    if (typeof this.beforeDataReport === 'function') {
      transportData = await this.beforeDataReport(transportData)
      if (!transportData) return false
    }
    return transportData
  }
  async xhrPost(data: any, url: string) {
    const requestFun = (): void => {
      const xhr = new XMLHttpRequest()
      xhr.open(EMethods.Post, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.withCredentials = true
      if (typeof this.configReportXhr === 'function') {
        this.configReportXhr(xhr, data)
      }
      xhr.send(JSON.stringify(data))
    }
    this.queue.addFn(requestFun)
  }
   async wxPost(data: any, url: string) {
    const requestFun = (): void => {
      let requestOptions = { method: 'POST' } as any;
      if (typeof this.configReportWxRequest === 'function') {
        const params = this.configReportWxRequest(data)
        // default method
        requestOptions = { ...requestOptions, ...params }
      }
      requestOptions = {
        ...requestOptions,
        data: JSON.stringify(data),
        url
      }
      wx.request(requestOptions)
    }
    this.queue.addFn(requestFun)
  }
  getSdkInfo(): SdkInfo {
    const result: SdkInfo = {
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME
    }
    return result
  }
  getTransportData(data: FinalReportType): TransportDataType {
    return {
      sdkInfo: this.getSdkInfo(),
      breadcrumb: breadcrumb.getStack(),
      data,
      deviceInfo: this.getDeviceInfo(),
      bnsInfo: this.bnsInfo,
    }
  }
  isSdkTransportUrl(targetUrl: string): boolean {
    let isSdkDsn = false
    if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
      isSdkDsn = true
    }
    return isSdkDsn
  }

  bindOptions(options: InitOptions = {}): void {
    options.bnsInfo && (this.bnsInfo = options.bnsInfo)
    options.dsn && (this.errorDsn = options.dsn)
    options.useImgUpload && (this.useImgUpload = options.useImgUpload)
    options.beforeDataReport && (this.beforeDataReport = options.beforeDataReport)
    options.configReportXhr && (this.configReportXhr = options.configReportXhr)
    options.configReportUrl && (this.configReportUrl = options.configReportUrl)
  }
  /**
   * 监控错误上报的请求函数
   * @param data 错误上报数据格式
   * @returns
   */
  send = throttle(async (data: FinalReportType, isSdkAutoReport: boolean = true) => {
    let dsn = ''
    
    if (isReportDataType(data)) {
      dsn = this.errorDsn
      if (isEmpty(dsn)) {
        logger.error('dsn为空，没有传入监控错误上报的dsn地址，请在init中传入')
        return
      }
    }

    const result = await this.beforePost({
      ...data,
      isSdkAutoReport,
    })

    if (!result) return
    if (typeof this.configReportUrl === 'function') {
      dsn = this.configReportUrl(result, dsn)
      if (!dsn) return
    }

    if (isBrowserEnv) {
      return this.useImgUpload ? this.imgRequest(result, dsn) : this.xhrPost(result, dsn)
    }
    if (isWxMiniEnv) {
      return this.wxPost(result, dsn)
    }
  }, 300)
  
  updateBnsInfo = (bnsInfo: Partial<BnsInfo>) => {
    Object.assign(this.bnsInfo, bnsInfo)
    return this.bnsInfo;
  }
}

// transportData 给全局用，后续可能被其他后载入的transportData替代掉
const transportData = _support.transportData = new TransportData()
export { transportData }
