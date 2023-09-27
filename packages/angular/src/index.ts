import { BREADCRUMBTYPES, ERRORTYPES } from '@hpf2e/sentinel-shared'
import { isError, extractErrorStack, Severity } from '@hpf2e/sentinel-utils'
import { breadcrumb, transportData } from '@hpf2e/sentinel-core'
import { InitOptions, ReportDataType } from '@hpf2e/sentinel-types'
import { init as browserInit} from '@hpf2e/sentinel-browser'
/**
 * 
 * 
 * 
 */
export function init(options: InitOptions = {}): void {
  browserInit(options)
  // const error = extractErrorStack(ex, Severity.Normal) as ReportDataType

  // transportData.send(error)
}
