console.log(111, hpSentinel)
window.hpSentinel.init({
    // debug: true,
    silentConsole: true,
    maxBreadcrumbs: 10,
    dsn: 'http://localhost:2021/errors/upload',
    projectName: 'test',
    throttleDelayTime: 0,
    onRouteChange(from, to) {
      console.log('onRouteChange: _', from, to);
    }
  })
  