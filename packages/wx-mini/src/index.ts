import { InitOptions } from '@hpf2e/sentinel-types'
import { isWxMiniEnv } from '@hpf2e/sentinel-utils'
import { setupReplace } from './load'
import { initOptions, log } from '@hpf2e/sentinel-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '@hpf2e/sentinel-shared'
import { MitoVue } from '@hpf2e/sentinel-vue'
import { errorBoundaryReport } from '@hpf2e/sentinel-react'
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track, MitoVue, errorBoundaryReport }
