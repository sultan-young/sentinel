import { InitOptions } from "../../types/options"


export class BaseOptions implements InitOptions{
    apiAddress?: string | undefined;
    disabled?: boolean | undefined;
    projectName?: string | undefined;

  bindOptions(options: InitOptions = {}): void {
    Object.assign(this, options);
  }
}

const options = new BaseOptions()


/**
 * init core methods
 * @param paramOptions
 */
export function initOptions(paramOptions: InitOptions = {}) {
    options.bindOptions()
}

export {
    options
}