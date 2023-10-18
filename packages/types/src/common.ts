import { HTTPTYPE } from '@hpf2e/sentinel-shared'

export interface IAnyObject {
  [key: string]: any
}

export interface ResourceErrorTarget {
  src?: string
  href?: string
  localName?: string
}

export interface SENTINELHttp {
  type: HTTPTYPE
  traceId?: string
  method?: string
  url?: string
  status?: number
  reqData?: any
  // statusText?: string
  sTime?: number
  elapsedTime?: number
  responseText?: any
  responseJson?: any
  time?: number
  isSdkUrl?: boolean
  // for wx
  errMsg?: string
}

export interface SENTINELXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  sentinel_xhr?: SENTINELHttp
}

export interface ErrorStack {
  args: any[]
  func: string
  column: number
  line: number
  url: string
}

export interface IntegrationError {
  message: string
  name: string
  stack: ErrorStack[]
}

export type TNumStrObj = number | string | object

export interface LocalStorageValue<T = any> {
  expireTime?: number
  value: T | string
}
