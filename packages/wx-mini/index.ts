import { InitOptions } from '../types/index'
import { isWxMiniEnv } from '../utils/index'
import { setupReplace } from './load'
import { initOptions, log } from '../core/index'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '../shared/index'
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track }
