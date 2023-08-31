import { isBrowserEnv } from "../utils/global"

function webInit() {
    if (!isBrowserEnv)  return;
  setupReplace()
    
}

function init(option: {}) {
    webInit
}