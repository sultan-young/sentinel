import { DeviceInfo, ERROR_LEVEL, ERROR_TYPES } from './index'

export interface SdkInfo {
  sdkVersion: string
  sdkName: string
}

export interface TransportDataType {
  sdkInfo: SdkInfo
  deviceInfo?: DeviceInfo
  reportData?: ReportDataType
}


export interface ReportDataType {
  // 错误类型
  type?: ERROR_TYPES
  // 错误堆栈
  stack?: any
  message?: string
  // 发生错误的页面地址
  url: string
  // 错误名称type
  name?: string
  // 发生错误的时间
  occurrenceTime?: number
  // 错误id
  errorId?: number
  level: ERROR_LEVEL
  // 接口耗时
  elapsedTime?: number

  request?: {
    httpType?: string
    traceId?: string
    method: string
    url: string
    data: any
  }
  response?: {
    status: number
    data: string
  }
}
