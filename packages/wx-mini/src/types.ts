import { IAnyObject, InitOptions, TransportDataType } from '@hpf2e/sentinel-types'

export interface WxInitOptions  extends InitOptions, WxMiniHooksTypes {};

export type IWxPageInstance = WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>

interface WxMiniHooksTypes {
  /**
   * wx小程序上报时的wx.request配置
   */
  configReportWxRequest?(event: TransportDataType | any): Partial<WechatMiniprogram.RequestOption>
  /**
   * wx小程序的App下的onLaunch执行完后再执行以下hook
   */
  appOnLaunch?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * wx小程序的App下的OnShow执行完后再执行以下hook
   */
  appOnShow?(options: WechatMiniprogram.App.LaunchShowOption): void
  /**
   * wx小程序的App下的OnHide执行完后再执行以下hook
   */
  appOnHide?(page: IWxPageInstance): void
  /**
   * wx小程序的App下的onPageNotFound执行完后再执行以下hook
   */
  onPageNotFound?(data: WechatMiniprogram.OnPageNotFoundCallbackResult): void
  /**
   * 先执行hook:pageOnShow再执行wx小程序的Page下的onShow
   */
  pageOnShow?(page: IWxPageInstance): void
  /**
   * wx小程序的App下的pageOnUnload执行完后再执行以下hook
   */
  pageOnUnload?(page: IWxPageInstance): void
  /**
   * 先执行hook:pageOnHide再执行wx小程序的Page下的onHide
   */
  pageOnHide?(page: IWxPageInstance): void
  /**
   * 先执行hook:onShareAppMessage再执行wx小程序的Page下的onShareAppMessage
   */
  onShareAppMessage?(options: WechatMiniprogram.Page.IShareAppMessageOption & IWxPageInstance): void
  /**
   * 先执行hook:onShareTimeline再执行wx小程序的Page下的onShareTimeline
   */
  onShareTimeline?(page: IWxPageInstance): void
  /**
   * 先执行hook:onTabItemTap再执行wx小程序的Page下的onTabItemTap
   */
  onTabItemTap?(options: WechatMiniprogram.Page.ITabItemTapOption & IWxPageInstance): void
  /**
   * 重写wx.NavigateToMiniProgram将里面的参数抛出来，便于在跳转时更改query和extraData
   * @param options
   */
  wxNavigateToMiniProgram?(options: WechatMiniprogram.NavigateToMiniProgramOption): WechatMiniprogram.NavigateToMiniProgramOption
  /**
   * 代理Action中所有函数，拿到第一个参数并抛出成hook
   * @param e
   */
  triggerWxEvent?(e: WechatMiniprogram.BaseEvent): void
}

export interface MiniRoute {
  from: string
  to: string
  isFail?: boolean
  message?: string
}

export interface WxOnShareAppMessageBreadcrumb {
  path: string
  query: IAnyObject
  options: WechatMiniprogram.Page.IShareAppMessageOption
}

export interface WxOnTabItemTapBreadcrumb {
  path: string
  query: IAnyObject
  options: WechatMiniprogram.Page.ITabItemTapOption
}

export interface WxRequestErrorBreadcrumb {
  requestOptions: WechatMiniprogram.RequestOption
  errMsg: string
}

export interface WxLifeCycleBreadcrumb {
  path: string
  query: IAnyObject
  //  是否需要更多的属性
  // referrerInfo: IAnyObject
  // scene: number
  // shareTicket: any
}
