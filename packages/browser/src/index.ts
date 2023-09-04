export * from './handleEvents'
export * from './load'
export * from './replace'
import { setupReplace } from './load'
import { initOptions, log } from 'hp-f2e-sentinel-core'
import { _global } from 'hp-f2e-sentinel-utils'
import { SDK_VERSION, SDK_NAME } from 'hp-f2e-sentinel-shared'
import { InitOptions } from 'hp-f2e-sentinel-types'
function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
  setupReplace()
}

function init(options: InitOptions = {}): void {
  webInit(options)
}

export { SDK_VERSION, SDK_NAME, init, log }
