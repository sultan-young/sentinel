import { ERRORTYPES } from '@hpf2e/sentinel-shared'
import { BreadcrumbPushData } from './breadcrumb'
import { DeviceInfo, EActionType } from './track'

export interface SdkInfo {
  sdkVersion: string
  sdkName: string
}

export interface TransportDataType {
  sdkInfo: SdkInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: FinalReportType
  deviceInfo?: DeviceInfo
  bnsInfo?: BnsInfo
  commonInfo?: CommonInfo
}

export type FinalReportType = ReportDataType | TrackReportData

interface ICommonDataType {
  // 是否是埋点数据
  isTrackData?: boolean
}

// SDK可以自动收集到的业务系统的信息
interface CommonInfo {
}

// 由使用方手动上报的信息
export interface BnsInfo {
  projectName: string
  username?: string; // 用户账号或者用户工号
  userNick?: string; // 用户姓名
  userPhone?: string // 用户联系方式 
}

export interface ReportDataType extends ICommonDataType {
  type?: string
  message?: string
  url: string
  name?: string
  stack?: any
  time?: number
  errorId?: number
  level: string
  // ajax
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
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 SENTINEL.log
  customTag?: string
}

export interface TrackReportData extends ICommonDataType {
  // uuid
  id?: string
  // 埋点code 一般由人为传进来，可以自定义规范
  trackId?: string
  // 埋点类型
  actionType: EActionType
  // 埋点开始时间
  startTime?: number
  // 埋点停留时间
  durationTime?: number
  // 上报时间
  trackTime?: number
}

export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (<TrackReportData>data).actionType === undefined && !data.isTrackData
}
