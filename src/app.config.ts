export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/list/index',
    'pages/details/index',
    'pages/index/calendar/calendar',
    'pages/index/position/position'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
  requiredPrivateInfos: [
    'getLocation',
    'chooseLocation'
  ],
  requiredBackgroundModes: []
})
