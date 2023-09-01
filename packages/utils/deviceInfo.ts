import { DeviceInfo } from "../types/common"







export async function getWxMiniDeviceInfo(): Promise<DeviceInfo> {
    const { pixelRatio, screenHeight, screenWidth } = wx.getSystemInfoSync()
    const netType = await getWxMiniNetWrokType()
    return {
      ratio: pixelRatio,
      clientHeight: screenHeight,
      clientWidth: screenWidth,
      netType
    }
  }
  
  export async function getWxMiniNetWrokType(): Promise<string> {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success(res) {
          resolve(res.networkType)
        },
        fail(err) {
          console.error(`获取微信小程序网络类型失败:${err}`)
          resolve('getNetWrokType failed')
        }
      })
    })
  }
  