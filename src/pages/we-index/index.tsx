import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { useLoad } from '@tarojs/taro'
import { getDateDescription, getMouth, getDay, getWeek, getDaysBetween } from '@/utils/calendar'
import React,{ useState ,useEffect} from 'react'
import { setChooseHotel } from '@/store/hotel/chooseHotel'
import { setHotelLabel } from '@/store/label/hotelLabel'
import { changeDate, toDetailPage, toListPage, choosePositon } from '@/utils/navigate'
import './index.scss'


export default function Index() {
  useLoad(() => {
    console.log('酒店查询页加载')
  })
  // 轮播图数据 - 确保id与实际酒店ID对应
  const [bannerList] = useState([
    {
      id: 1,
      hotelId: 1, // 对应酒店1
      image: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3',
      title: '豪华酒店促销'
    },
    {
      id: 2,
      hotelId: 2, // 对应酒店2
      image: 'https://www.tl-group.com/uploads/20240425/94e075c613beaa3c7cd181e4256f8cff.jpg',
      title: '商务出行首选'
    },
    {
      id: 3,
      hotelId: 3, // 对应酒店3
      image: 'https://img95.699pic.com/photo/50107/0921.jpg_wh860.jpg',
      title: '度假酒店优惠'
    }
  ])
  const [bannerIndex, setBannerIndex] = useState(0)
  const {startDate, endDate} = useSelector((state: any) => state.chooseDate)
  // 酒店属性标签数组
  const hotelTags = ['亲子', '豪华', '免费停车场', 'WiFi', '健身房', '游泳池', '早餐', '商务中心']

  // 价格范围数组
  const priceRanges = ['¥200以下', '¥200-¥350', '¥350-¥450', '¥450-¥600', '¥600-¥1000', '¥1000以上']

  // 酒店星级数组
  const hotelStars = ['2钻/星及以下', '3钻/星', '4钻/星', '5钻/星', '金钻酒店', '铂钻酒店']

  // 筛选面板状态管理
  const [filterPanelVisible, setFilterPanelVisible] = useState(true)

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

  // 处理广告点击
  const advTo=(banner)=>{
    console.log('Banner clicked:', banner)
    console.log('Hotel ID from banner:', banner.hotelId)
    // 使用banner.hotelId来设置酒店ID
    const hotelIdToUse = banner.hotelId || banner.id
    console.log('Using hotel ID:', hotelIdToUse)
    dispatch(setChooseHotel({ hotelId: hotelIdToUse }))
    toDetailPage()
  }
  return (
    <View className='index'>
      {/* 轮播图广告 */}
      <View className='advertisement'>
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
                onClick={()=>advTo(banner)}
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
                { `${getMouth(startDate)}月${getDay(startDate)}日`}
              </Text>
                <Text className='check-in-week'>{getDateDescription(startDate) ||`周${getWeek(startDate)}`}</Text>
            </View>
            <View className='decoration'></View>
            <View className='check-out'onClick={changeDate}>
              <Text className='check-out-date'>
                { `${getMouth(endDate)}月${getDay(endDate)}日`}
              </Text>
                <Text className='check-out-week'>{getDateDescription(endDate) ||`周${getWeek(endDate)}`}</Text>
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
