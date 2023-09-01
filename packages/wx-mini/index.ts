import { initOptions } from '../core/options/base_options'
import { InitOptions } from '../types/index'
import { isWxMiniEnv } from '../utils/index'
import { setupApp } from './setup'

export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupApp()
}
export {}
