import { Breadcrumb } from '@hpf2e/sentinel-core'
import { BreadcrumbPushData } from './breadcrumb'
import { BnsInfo, TransportDataType } from './transportData'
type CANCEL = null | undefined | boolean

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS'

export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

interface IRequestHeaderConfig {
  url: HttpMethod
  method: string
}

type TSetRequestHeader = (key: string, value: string) => {}
export interface IBeforeAppAjaxSendConfig {
  setRequestHeader: TSetRequestHeader
}
export interface InitOptions extends SilentEventTypes, HooksTypes, WxSilentEventTypes, BrowserHooksTypes {
  /**
   * 错误监控的dsn服务器地址
   */
  dsn?: string
  /**
   * 为true时，整个sdk将禁用
   */
  disabled?: boolean
  /**
   * 项目唯一名称
   */
  bnsInfo?: BnsInfo
  /**
   * 使用img上报的方式，默认为false，默认是xhr的上报方式
   */
  useImgUpload?: boolean
  /**
   * 默认为关闭，为true是会打印一些信息：breadcrumb
   */
  debug?: boolean
  /**
   * 默认是关闭traceId，开启时，页面的所有请求都会生成一个uuid，放入请求头中
   */
  enableTraceId?: boolean
  /**
   * 如果开启了enableTraceId,也需要配置该配置项，includeHttpUrlTraceIdRegExp.test(xhr.url)为true时，才会在该请求头中添加traceId
   * 由于考虑部分接口如果随便加上多余的请求头会造成跨域，所以这边用的是包含关系的正则
   */
  includeHttpUrlTraceIdRegExp?: RegExp
  /**
   * traceId放入请求头中的key，默认是Trace-Id
   */
  traceIdFieldName?: string
  /**
   * 默认为空，所有ajax都会被监听，不为空时，filterXhrUrlRegExp.test(xhr.url)为true时过滤
   */
  filterXhrUrlRegExp?: RegExp
  /**
   * 忽视某些错误不上传
   */
  // ignoreErrors?: Array<string | RegExp>
  /**
   * 默认20，最大100，超过100还是设置成100
   */
  maxBreadcrumbs?: number
  /**
   * 按钮点击和微信触摸事件节流时间，默认是0
   */
  throttleDelayTime?: number
  
  /**
   * 最多可重复上报同一个错误的次数, 默认为2
   */
  maxDuplicateCount?: number
  /**
   * 用来判断一个请求是否失败，默认会以http请求的Status code进行判断
   * 这里一般用来判断业务接口是否失败。
   * 注意📢：这里不一定都会是接口请求，在一些第三方库里，可能会手动触发get请求来获取资源，这时候也会被拦截到这里
   */
  isRequestFail?(responseText: string): boolean;
}

export interface HooksTypes {
  /**
   * 钩子函数，配置发送到服务端的xhr
   * 可以对当前xhr实例做一些配置：xhr.setRequestHeader()、xhr.withCredentials
   * 会在xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')、
   * xhr.withCredentials = true,后面调用该函数
   * ../param xhr XMLHttpRequest的实例
   */
  configReportXhr?(xhr: XMLHttpRequest, reportData: TransportDataType | any): void
  /**
   * 钩子函数，在每次发送事件前会调用
   *
   * ../param event 有SDK生成的错误事件
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次上传
   */
  beforeDataReport?(event: TransportDataType): Promise<TransportDataType | null | CANCEL> | TransportDataType | any | CANCEL | null
  /**
   *
   * 钩子函数，每次发送前都会调用
   * @param {TransportDataType} event 上报的数据格式
   * @param {string} url 上报到服务端的地址
   * @returns {string} 返回空时不上报
   * @memberof HooksTypes
   */
  configReportUrl?(event: TransportDataType, url: string): string
  /**
   * 钩子函数，在每次添加用户行为事件前都会调用
   *
   * ../param breadcrumb 由SDK生成的breacrumb事件栈
   * ../param hint 当次的生成的breadcrumb数据
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次的push
   */
  beforePushBreadcrumb?(breadcrumb: Breadcrumb, hint: BreadcrumbPushData): BreadcrumbPushData | CANCEL
  /**
   * 在状态小于400并且不等于0的时候回调用当前hook
   * ../param data 请求状态为200时返回的响应体
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次的上传
   */
  // afterSuccessHttp?<T>(data: T): string | CANCEL
  /**
   * 钩子函数，拦截用户页面的ajax请求，并在ajax请求发送前执行该hook，可以对用户发送的ajax请求做xhr.setRequestHeader
   * ../param config 当前请求的
   */
  beforeAppAjaxSend?(config: IRequestHeaderConfig, setRequestHeader: IBeforeAppAjaxSendConfig): void
}

export interface SilentEventTypes {
  /**
   * 静默监控Xhr事件
   */
  silentXhr?: boolean
  /**
   * 静默监控fetch事件
   */
  silentFetch?: boolean
  /**
   * 静默监控console事件
   */
  silentConsole?: boolean
  /**
   * 静默监控Dom事件
   */
  silentDom?: boolean
  /**
   * 静默监控history事件
   */
  silentHistory?: boolean
  /**
   * 静默监控error事件
   */
  silentError?: boolean
  /**
   * 静默监控unhandledrejection事件
   */
  silentUnhandledrejection?: boolean
  /**
   * 静默监控hashchange事件
   */
  silentHashchange?: boolean
  /**
   * 静默监控Vue.warn函数
   */
  silentVue?: boolean
}

export interface WxSilentEventTypes {
  /**
   * 静默监控AppOnError
   */
  silentWxOnError?: boolean
  /**
   * 静默监控AppOnUnhandledRejection
   */
  silentWxOnUnhandledRejection?: boolean
  /**
   * 静默监控AppOnPageNotFound
   */
  silentWxOnPageNotFound?: boolean
  /**
   * 静默监控PageOnShareAppMessage
   */
  silentWxOnShareAppMessage?: boolean
  /**
   * 静默监控小程序路由
   */
  silentMiniRoute?: boolean
}

export interface BrowserHooksTypes {
  onRouteChange?: (from: string, to: string) => unknown,
}