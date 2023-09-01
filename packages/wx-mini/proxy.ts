import { TransportData } from "../core/transportData"
import { ERROR_TYPES } from "../types/error"
import { REQUEST_METHOD, REQUEST_TYPE } from "../types/http"
import { ReportDataType } from "../types/transportData"

export function proxyNetwork() {
    const hookMethods = ['request', 'downloadFile', 'uploadFile']
    hookMethods.forEach((hook) => {
      // @ts-ignore
      const originRequest = wx[hook]

      // 劫持微信的原生方法
      Object.defineProperty(wx, hook, {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function (...args: any[]) {
          const options: WechatMiniprogram.RequestOption | WechatMiniprogram.DownloadFileOption | WechatMiniprogram.UploadFileOption = args[0]
          let method: string;
          if ((options as WechatMiniprogram.RequestOption).method) {
            method = (options as WechatMiniprogram.RequestOption).method!
          } else if (hook === 'downloadFile') {
            method = REQUEST_METHOD.Get
          } else {
            method = REQUEST_METHOD.Post
          }
          const { url } = options
          let header = options.header
          !header && (header = {})
  
          // 如果当前请求是上传错误的请求，直接发送
          if ((method === REQUEST_METHOD.Post && TransportData.isSdkTransportUrl(url))) {
            return originRequest.call(this, options)
          }
          let reqData = undefined
          if (hook === 'request') {
            reqData = (options as WechatMiniprogram.RequestOption).data
          } else if (hook === 'downloadFile') {
            reqData = {
              filePath: (options as WechatMiniprogram.DownloadFileOption).filePath
            }
          } else {
            // uploadFile
            reqData = {
              filePath: (options as WechatMiniprogram.UploadFileOption).filePath,
              name: (options as WechatMiniprogram.UploadFileOption).name
            }
          }
          const data: ReportDataType = {
            url,
            reqData,
          }
          setTraceId(url, (headerFieldName, traceId) => {
            data.traceId = traceId
            header[headerFieldName] = traceId
          })
          function setRequestHeader(key: string, value: string) {
            header[key] = value
          }
          sdkOptions.beforeAppAjaxSend && sdkOptions.beforeAppAjaxSend({ method, url }, { setRequestHeader })
  

          const _fail = options.fail
          const failHandler:
            | WechatMiniprogram.RequestFailCallback
            | WechatMiniprogram.DownloadFileFailCallback
            | WechatMiniprogram.UploadFileFailCallback = function (err) {
            // 系统和网络层面的失败
            const endTime = getTimestamp()
            data.elapsedTime = endTime - data.sTime
            data.errMsg = err.errMsg
            data.status = 0
            triggerHandlers(EVENTTYPES.XHR, data)
            if (variableTypeDetection.isFunction(_fail)) {
              return _fail(err)
            }
          }
          const actOptions = {
            ...options,
            fail: failHandler
          }
          return originRequest.call(this, actOptions)
        }
      })
    })
}

export function proxyApp() {

}

export function proxyPage() {
    
}

export function proxyComponent() {
    
}

// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html
export function proxyBehavior() {
    
}