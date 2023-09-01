import { ReportDataType, TransportDataType } from '../types/transportData'
import { isBrowserEnv, isWxMiniEnv } from '../utils/global'
import { getLocationHref, getWxCurrentRoute } from '../utils/helpers'
import { options } from './options/base_options'

export function getRouteUrl() {
    if (isBrowserEnv) {
        return getLocationHref()
    }
    if (isWxMiniEnv) {
        return getWxCurrentRoute()
    }
    return ''
}

// 上报的数据
export class TransportData {
	static isSdkTransportUrl(targetUrl: string): boolean {
		let isTransportUrl = false
		if (!options.apiAddress) return isTransportUrl
		if (targetUrl.indexOf(options.apiAddress) !== -1) {
			isTransportUrl = true
		}
		return isTransportUrl
	}

    send() {

    }
}
