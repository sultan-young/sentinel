window.hpSentinel.init({
    // debug: true,
    // silentConsole: true,
    maxBreadcrumbs: 10,
    dsn: 'https://f2e-sentinel-test.hungrypanda.cn/api/v1/log/report',
    projectName: 'test',
    throttleDelayTime: 0,
    onRouteChange(from, to) {
      console.log('onRouteChange: _', from, to);
    },
    isRequestFail(responseText) {
      const response = JSON.parse(responseText)
      console.log('response: ', response);

      return response.code !== 1000
    }
  })

  setTimeout(() => {
    window.addEventListener('error', (a) => {
      console.error(a)
    })
    // @ts-ignore
    setTimeout(() => {
      console.error('自定义错误AAA', 'BBBBB')
      setTimeout(() => {
        throw Error('自定义错误CCC')
      }, 1000);
    }, 1000);
  }, 1000);
  

  // const slsTracker = new AliyunSlsTracker({
//   host: 'ap-northeast-1.log.aliyuncs.com',
//   project: 'frontend-tracking-hk',
//   logstore: 'tracking-log'
// })