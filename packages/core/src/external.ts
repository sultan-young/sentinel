import { ERRORTYPES, BREADCRUMBTYPES } from '@hpf2e/sentinel-shared'
import {
  isError,
  extractErrorStack,
  getLocationHref,
  getTimestamp,
  unknownToString,
  isWxMiniEnv,
  Severity,
  getCurrentRoute
} from '@hpf2e/sentinel-utils'
import { transportData } from './transportData'
import { breadcrumb } from './breadcrumb'
import { TNumStrObj } from '@hpf2e/sentinel-types'

interface LogTypes {
  message: TNumStrObj
  tag?: TNumStrObj
  level?: Severity
  ex?: Error | any
  type?: string
}

/**
 *
 * 自定义上报事件
 * @export
 * @param {LogTypes} { message = 'emptyMsg', tag = '', level = Severity.Critical, ex = '' }
 */
export function log({ message = 'emptyMsg', tag = '', level = Severity.Critical, ex = '', type = ERRORTYPES.LOG_ERROR }: LogTypes): void {
  let errorInfo = {}
  if (isError(ex)) {
    errorInfo = extractErrorStack(ex, level)
  }
  const error = {
    type,
    level,
    message: unknownToString(message),
    name: 'SENTINEL.log',
    customTag: unknownToString(tag),
    time: getTimestamp(),
    url: isWxMiniEnv ? getCurrentRoute() : getLocationHref(),
    ...errorInfo
  }
  breadcrumb.push({
    type: BREADCRUMBTYPES.CUSTOMER,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.CUSTOMER),
    data: message,
    level: Severity.fromString(level.toString())
  })
  transportData.send(error);
}
