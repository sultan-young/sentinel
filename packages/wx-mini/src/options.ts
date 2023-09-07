import { Options } from '@hpf2e/sentinel-core'
import { WxInitOptions } from './types'
import { _support } from '@hpf2e/sentinel-utils'

export class WxOptions extends Options {
  override bindOptions(options?: WxInitOptions): void {
    super.bindOptions(options)
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
  }
}

const wxOptions = _support.options = new WxOptions();

export { wxOptions };

