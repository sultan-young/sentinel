export * from './handleEvents'
export * from './load'
export * from './replace'
import { setupReplace } from './load'
import { initOptions, report, transportData } from '@hpf2e/sentinel-core'
import { _global } from '@hpf2e/sentinel-utils'
import { SDK_VERSION, SDK_NAME } from '@hpf2e/sentinel-shared'
import { InitOptions } from '@hpf2e/sentinel-types'
function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
  setupReplace()
}

function init(options: InitOptions = {}): void {
  webInit(options)
}

const updateBnsInfo = transportData.updateBnsInfo;


export { SDK_VERSION, SDK_NAME, init, report, updateBnsInfo }
