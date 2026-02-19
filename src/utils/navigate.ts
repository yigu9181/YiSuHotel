import Taro from '@tarojs/taro'

const changeDate=():void=>{
  Taro.navigateTo({
    url: '/pages/we-index/calendar/calendar'
  })
}
const choosePositon=():void=>{
  Taro.navigateTo({
    url: '/pages/we-index/position/position'
  })
}
const toDetailPage=():void=>{
  Taro.navigateTo({
    url: '/pages/we-details/index'
  })
}
const toListPage=():void=>{
  // 注释内容用于判断位置和日历是否都已存入
  /*
  if ((!selectedAddress)&&( !startDate || !endDate)) {
    Taro.showToast({
      title: '请选择入住时间和位置',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if (!selectedAddress) {
    Taro.showToast({
      title: '请选择位置',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if( !startDate || !endDate){
    Taro.showToast({
      title: '请选择入住时间',
      icon: 'none',
      duration: 2000
    })
    return
  }
  */
  Taro.navigateTo({
    url: '/pages/we-list/index'
  })
}
const listToDetail=(id)=>{
  Taro.navigateTo({url: '/pages/we-details/index?id=' + id})
}
const backToLastPage=():void=>{
  try {
    Taro.navigateBack(
      { delta: 1 }
    )
  } catch (error) {
    Taro.navigateTo({
      url: '/pages/we-list/index'
    })
  }
}
export {changeDate,choosePositon,toDetailPage,toListPage,listToDetail,backToLastPage}
