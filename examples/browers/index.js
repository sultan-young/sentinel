window.hpSentinel.init({
    debug: true,
    // silentConsole: true,
    bnsInfo: {
      projectName: '测试项目'
    },
    maxBreadcrumbs: 10,
    // dsn: 'https://f2e-sentinel-test.hungrypanda.cn/api/h5/v1/log/report',
    dsn: 'http://10.1.5.222:7001/api/h5/v1/log/report',
    throttleDelayTime: 0,
    onRouteChange(from, to) {
      console.log('onRouteChange: _', from, to);
    },
    // filterXhrUrlRegExp: /hungrypanda/,
    requestReportStrategy: [
      {
        reg: /exception/,
        handler: (response) => response.code !== 1000
      }
    ]
  })

  window.hpSentinel.updateBnsInfo({
    userNick: '测试用户'
  })
  
  window.addEventListener('error', (a) => {
    console.log('12313: ', a);
    // console.error(a)
  }, true)
  // window.onerror = (b, c, d, e, f) => {
  //   console.log('b: ', b, c, d, e, f);
  // }
  window.addEventListener('unhandledrejection', (c) => {
    console.log('c:', c)
  })


  // setTimeout(() => {
  //   // @ts-ignore
  //   setTimeout(() => {
  //     console.error('自定义错误AAA', 'BBBBB')
  //     setTimeout(() => {
  //       throw Error('自定义错误CCC')
  //     }, 1000);
  //   }, 1000);
  // }, 1000);
  

  // const slsTracker = new AliyunSlsTracker({
//   host: 'ap-northeast-1.log.aliyuncs.com',
//   project: 'frontend-tracking-hk',
//   logstore: 'tracking-log'
// })