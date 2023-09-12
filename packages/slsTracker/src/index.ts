import AliyunSlsTracker from '@aliyun-sls/web-track-browser';
import { WebTrackerBrowserOptions } from '@aliyun-sls/web-types';


class SlsTracker {
    webTrackerBrowserOptions?: WebTrackerBrowserOptions
    slsTracker?: AliyunSlsTracker;
    
    bindOptions(options: WebTrackerBrowserOptions) {
        if (!options) return;
        this.webTrackerBrowserOptions = options;
        this.slsTracker = new AliyunSlsTracker(this.webTrackerBrowserOptions);
    }

    send(originLog: Record<string, any>) {
      console.log(111, this.slsTracker)
      if (!this.slsTracker) return;
      this.slsTracker.send(originLog);
    }
}

// // 公参
// const pdCommonParams: any = {
//   pd_user_id: userId,
//   pd_log_type: 
//   pd_log_time: 
//   pd_keyword: 
//   pd_content: 
//   pd_app_id: 
//   pd_app_version: 
//   pd_agent_type: 
//   pd_current_language: 
//   pd_device_id: 

//   pd_is_h5: 1,
//   pd_log_type: 'INFO',
//   pd_log_time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
//   pd_keyword: 'NetworkTimingData',
//   pd_app_id: appTypeId,
//   pd_app_version: appVersion,
//   pd_agent_type: agentType,
//   pd_current_language: language,
//   pd_system_language: navigator.language,
//   pd_device_id: uniqueToken,
//   pd_device_name: isiOS?'Apple':'Android',
//   pd_device_version: '',
//   pd_device_type: '',
//   pd_country: countryCode,
//   pd_longitude: longitude,
//   pd_latitude: latitude,
// }

const slsTracker = new SlsTracker()

export {
    slsTracker,
}