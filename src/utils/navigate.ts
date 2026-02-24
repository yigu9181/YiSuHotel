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
export {changeDate,choosePositon,toDetailPage,listToDetail,backToLastPage}
