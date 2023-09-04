import { EActionType, ITrackBaseParam, TrackReportData } from 'hp-f2e-sentinel-types'
import { transportData } from 'hp-f2e-sentinel-core'
import { generateUUID, getTimestamp } from 'hp-f2e-sentinel-utils'

export function track(actionType: EActionType, param: ITrackBaseParam) {
  const data = {
    ...param,
    // rewrite actionType
    actionType
  }
  sendTrackData(data)
  return data
}

/**
 * 手动发送埋点数据到服务端
 * @param data 埋点上报的数据，必须含有actionType属性
 */
export function sendTrackData(data: TrackReportData) {
  const id = generateUUID()
  const trackTime = getTimestamp()
  transportData.send({
    id,
    trackTime,
    ...data
  })
}
