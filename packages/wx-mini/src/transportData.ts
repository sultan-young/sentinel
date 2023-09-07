import { TransportData } from "@hpf2e/sentinel-core";
import { WxInitOptions } from "./types";
import { _support } from '@hpf2e/sentinel-utils'

export class WxTransportData extends TransportData {
    override bindOptions(options?: WxInitOptions): void {
        super.bindOptions()
        options.configReportWxRequest && (this.configReportWxRequest = options.configReportWxRequest)
    }
}

const wxTransportData = _support.transportData = new WxTransportData()
export { wxTransportData }