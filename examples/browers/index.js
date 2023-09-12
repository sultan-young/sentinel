console.log(111, hpSentinel)
window.hpSentinel.init({
    // debug: true,
    silentConsole: true,
    maxBreadcrumbs: 10,
    dsn: 'http://localhost:2021/errors/upload',
    projectName: 'test',
    throttleDelayTime: 0,
    // TODO: 不要从外部传入。sls作为一个业务package直接卸载sdk包体里
    aliyunSlsOptions: {
      host: 'cn-hongkong.log.aliyuncs.com',
      project: 'frontend-tracking-hk',
      logstore: 'tec-log'
    },
    onRouteChange(from, to) {
      console.log('onRouteChange: _', from, to);
    }
  })
  

  // const slsTracker = new AliyunSlsTracker({
//   host: 'ap-northeast-1.log.aliyuncs.com',
//   project: 'frontend-tracking-hk',
//   logstore: 'tracking-log'
// })