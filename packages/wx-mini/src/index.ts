import { InitOptions } from 'hp-f2e-sentinel-types'
import { isWxMiniEnv } from 'hp-f2e-sentinel-utils'
import { setupReplace } from './load'
import { initOptions, log } from 'hp-f2e-sentinel-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from 'hp-f2e-sentinel-shared'
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track }
