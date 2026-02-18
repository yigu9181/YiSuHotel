import { View, Text,Input, Swiper, SwiperItem, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useLoad } from '@tarojs/taro'
import { useState ,useEffect} from 'react'
import { setHotelLabel } from '@/store/label/hotelLabel'
import { setSelectedTheAddress } from '@/store/address/positionAddress'
import './index.scss'


export default function Index() {
  useLoad(() => {
    console.log('酒店查询页加载')
  })
  // 轮播图数据
  const [bannerList] = useState([
    {
      id: 1,
      image: 'https://img.freepik.com/free-photo/luxury-hotel-building_1127-3374.jpg',
      title: '豪华酒店促销'
    },
    {
      id: 2,
      image: 'https://img.freepik.com/free-photo/hotel-room-interior-design_23-2150719458.jpg',
      title: '商务出行首选'
    },
    {
      id: 3,
      image: 'https://img.freepik.com/free-photo/tropical-hotel-resort-with-swimming-pool_1203-9680.jpg',
      title: '度假酒店优惠'
    }
  ])
  const [bannerIndex, setBannerIndex] = useState(0)
  const changeDate=():void=>{
    Taro.navigateTo({
      url: '/pages/index/calendar/calendar'
    })
  }
  const toDetailPage=():void=>{
    Taro.navigateTo({
      url: '/pages/details/index'
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
      url: '/pages/list/index'
    })
  }
  const choosePositon=():void=>{
    Taro.navigateTo({
      url: '/pages/index/position/position'
    })
  }
  const {startDate, endDate} = useSelector((state: any) => state.chooseDate)
  // 获取今天、明天、后天的日期
  const getTodayTomorrowDayAfter = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(today.getDate() + 2)

    // 格式化日期为 YYYY/MM/DD 格式
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}/${month}/${day}`
    }

    return {
      today: formatDate(today),
      tomorrow: formatDate(tomorrow),
      dayAfterTomorrow: formatDate(dayAfterTomorrow)
    }
  }

  // 判断日期是否是今天、明天或后天
  const getDateDescription = (dateStr) => {
    if (!dateStr) return ''
    const { today, tomorrow, dayAfterTomorrow } = getTodayTomorrowDayAfter()
    if (dateStr === today) return '今天'
    if (dateStr === tomorrow) return '明天'
    if (dateStr === dayAfterTomorrow) return '后天'
    return ''
  }

  const getMouth = (str) => str ? String(str).split('/')[1] : ''
  const getDay = (str) => str ? String(str).split('/')[2] : ''
  const getWeek = (str) => str ? '日一二三四五六'.charAt(new Date(str).getDay()) : ''
  // 计算两个日期之间的天数差
  function getDaysBetween(dateStr1: string, dateStr2: string):number {
    if (!dateStr1 || !dateStr2) return 0;
    // 将字符串转换为 Date 对象（支持 "2024-02-12" 或 "2024/02/12" 格式）
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  // 酒店属性标签数组
  const hotelTags = ['亲子', '豪华', '免费停车场', 'WiFi', '健身房', '游泳池', '早餐', '商务中心']

  // 价格范围数组
  const priceRanges = ['¥200以下', '¥200-¥350', '¥350-¥450', '¥450-¥600', '¥600-¥1000', '¥1000以上']

  // 酒店星级数组
  const hotelStars = ['2钻/星及以下', '3钻/星', '4钻/星', '5钻/星', '金钻酒店', '铂钻酒店']

  // 筛选面板状态管理
  const [filterPanelVisible, setFilterPanelVisible] = useState(false)

  const dispatch = useDispatch()

  const { priceRange, hotelStar, Labels } = useSelector((state: any) => state.hotelLabel)
  const {selectedAddress} = useSelector((state: any) => state.address || { selectedAddress: null })
  // 选中的价格范围
  const [selectedPrice, setSelectedPrice] = useState<string>(priceRange || '')

  // 选中的酒店星级
  const [selectedStar, setSelectedStar] = useState<string>(hotelStar || '')

  // 选中的标签
  const [selectedTags, setSelectedTags] = useState<string[]>(Labels || [])

  useEffect(() => {
    dispatch(setHotelLabel({
      priceRange: selectedPrice,
      hotelStar: selectedStar,
      Labels: selectedTags
    }))
  }, [selectedPrice, selectedStar, selectedTags, dispatch])
  // 处理价格范围点击
  const handlePriceClick = (price: string) => {
    setSelectedPrice(prev => prev === price ? '' : price)
  }

  // 处理酒店星级点击
  const handleStarClick = (star: string) => {
    setSelectedStar(prev => prev === star ? '' : star)
  }

  // 清空筛选条件
  const handleClearFilters = () => {
    setSelectedPrice('')
    setSelectedStar('')
  }

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // 如果已选中，则移除
        return prev.filter(t => t !== tag)
      } else {
        // 如果未选中，则添加到最前面
        return [tag, ...prev]
      }
    })
  }

  // 获取排序后的标签数组
  const getSortedTags = () => {
    // 选中的标签放在前面，未选中的放在后面
    return [...selectedTags, ...hotelTags.filter(tag => !selectedTags.includes(tag))]
  }

  // 处理筛选按钮点击
  const handleFilterClick = () => {
    setFilterPanelVisible(!filterPanelVisible)
  }
  return (
    <View className='index'>
      {/* 轮播图广告 */}
      <View className='advertisement' onClick={toDetailPage}>
        <Swiper
          className='banner-swiper'
          indicatorColor='#999'
          indicatorActiveColor='#fff'
          autoplay
          interval={3000}
          duration={500}
          circular
          current={bannerIndex}
          onChange={(e) => setBannerIndex(e.detail.current)}
        >
          {bannerList.map((banner) => (
            <SwiperItem key={banner.id}>
              <Image
                className='banner-image'
                src={banner.image}
                mode='aspectFill'
              />
              <View className='banner-title'>{banner.title}</View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      <View className='message'>
        <View className='pos-time'>
        <View className='position'>
            <View className='picker'>
              {selectedAddress?.province.slice(0, 2) || '位置'}
            </View>
          <View className='input'>
            <View className='location-display'>
              {selectedAddress?.name || '地点/品牌/酒店'}
            </View>
          </View>
            <View className='iconfont icon-dingwei icon' onClick={choosePositon}></View>
        </View>
        {/* 日期选择部分 */}
        {startDate && endDate ? (
          <View className='date' >
            <View className='check-in'onClick={changeDate}>
              <Text className='check-in-date'>
                {getDateDescription(startDate) || `${getMouth(startDate)}月${getDay(startDate)}日`}
              </Text>
              <Text className='check-in-week'>{`周${getWeek(startDate)}`}</Text>
            </View>
            <View className='decoration'></View>
            <View className='check-out'onClick={changeDate}>
              <Text className='check-out-date'>
                {getDateDescription(endDate) || `${getMouth(endDate)}月${getDay(endDate)}日`}
              </Text>
              <Text className='check-out-week'>{`周${getWeek(endDate)}`}</Text>
            </View>
            <View className='time-interval'>共{getDaysBetween(startDate, endDate)}晚</View>
          </View>
        ) : (
          <View className='date placeholder' onClick={changeDate}>
            <View className='placeholder-content'>
              <Text className='time-label'>入住时间</Text>
              <View className='time-separator'></View>
              <Text className='time-placeholder'>请选择入住时间</Text>
              <Text className='calendar-icon icon-rili iconfont'></Text>
            </View>
          </View>
        )}
        </View>
        <View className='background'>
          <View className='fil-lab'>
            {/* 快捷标签 */}
            <View className='quick-tags'>
              <View className='tag-title'>酒店属性</View>
              <View className='tag-list'>
                {getSortedTags().map(tag => (
                  <View
                    key={tag}
                    className={`tag-item ${selectedTags.includes(tag) ? 'tag-selected' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </View>
                ))}
              </View>
            </View>

            {/* 筛选条件 */}
            <View className='filters'>
              <View className='filter-panel-btn' onClick={handleFilterClick}>
                <Text className='filter-panel-text'>筛选条件</Text>
                <Text className={`filter-panel-arrow ${filterPanelVisible ? 'arrow-up' : 'arrow-down'}`}>▼</Text>
              </View>

              {/* 筛选面板 */}
              {filterPanelVisible ? (
                <View className='filter-panel'>
                  {/* 价格范围 */}
                  <View className='filter-section'>
                    <View className='filter-section-title'>价格范围</View>
                    <View className='filter-options'>
                      {priceRanges.map(price => (
                        <View
                          key={price}
                          className={`filter-option ${selectedPrice === price ? 'filter-selected' : ''}`}
                          onClick={() => handlePriceClick(price)}
                        >
                          <Text>{price}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 酒店星级 */}
                  <View className='filter-section'>
                    <View className='filter-section-title'>酒店星级</View>
                    <View className='filter-options'>
                      {hotelStars.map(star => (
                        <View
                          key={star}
                          className={`filter-option ${selectedStar === star ? 'filter-selected' : ''}`}
                          onClick={() => handleStarClick(star)}
                        >
                          <Text>{star}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 操作按钮 */}
                  <View className='filter-actions'>
                    <View className='filter-action-btn reset-btn' onClick={handleClearFilters}>
                      <Text>清空</Text>
                    </View>
                    <View className='filter-action-btn confirm-btn' onClick={handleFilterClick}>
                      <Text>完成</Text>
                    </View>
                  </View>
                </View>
              ):(
                  <View className='selected-options'>
                    {priceRanges.filter(price => price === selectedPrice).map(price => (
                    <View
                      key={price}
                      className='selected-option'
                    >
                      <Text>{price}</Text>
                    </View>
                  ))}
                    {hotelStars.filter(star => star === selectedStar).map(star => (
                      <View
                        key={star}
                        className='selected-option'
                      >
                        <Text>{star}</Text>
                      </View>
                    ))}
                  </View>
              )}
            </View>

            {/* 查询按钮 */}
            <View className='search' onClick={toListPage}>
              <View className='search-text'>查询</View>
            </View>
          </View>
        </View>
        </View>
      </View>
  )
}
