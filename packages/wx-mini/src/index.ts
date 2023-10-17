import { InitOptions } from '@hpf2e/sentinel-types'
import { isWxMiniEnv } from '@hpf2e/sentinel-utils'
import { setupReplace } from './load'
import { initOptions, report } from '@hpf2e/sentinel-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '@hpf2e/sentinel-shared'
import { wxTransportData } from './transportData'
import { wxOptions } from './options'
import { WxInitOptions } from './types'

export function init(options: WxInitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options, {
    transportData: wxTransportData,
    options: wxOptions
  })
  setupReplace()
  Object.assign(wx, { sentinelReport: report, SDK_NAME, SDK_VERSION })
}
export { report, sendTrackData, track }
