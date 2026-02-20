import { View, Text} from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useSelector , useDispatch } from 'react-redux'
import React,{ useState, useEffect } from 'react'
import { getMouth, getDay, getWeek, getDaysBetween } from '@/utils/calendar'
import { choosePositon, changeDate, backToLastPage } from '@/utils/navigate'
import { setChooseHotel } from '@/store/hotel/chooseHotel'
import { hotelApi } from '@/utils/api'
import HotelShow from '@/components/hotelShow/hotelShow'
import './index.scss'

export default function Index () {
  const [hotelList, setHotelList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    console.log('Page loaded.')
    fetchHotelList()
  })

  const fetchHotelList = async () => {
    setLoading(true)
    try {
      const res = await hotelApi.getHotelList()
      if (res.code === 200 && res.data) {
        // 提取message部分
        const messageList = res.data.map((hotel: any) => ({
          ...hotel.message,
          hotelId: hotel.id
        }))
        setHotelList(messageList)
      }
    } catch (error) {
      console.error('获取酒店列表失败:', error)
      Taro.showToast({
        title: '获取酒店列表失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterItems = ['默认','热度排序','价格','星级']
  const [selectedFilter, setSelectedFilter] = useState(0)
  const handleFilterClick = (index: number) => {
    setSelectedFilter(index)
  }
  const { priceRange, hotelStar, Labels } = useSelector((state: any) => state.hotelLabel)

  const text = Labels.join(' ')
  const hotalLabel = text.length > 11
    ? text.slice(0, 11) + '...'
    : text
  interface Arrow {
    type: string
    content: any
  }
  const arrows: Arrow[] = []
  if (Labels.length > 0) {
    arrows.push({ type: 'tags', content: hotalLabel })
  }
  if (priceRange.length > 0) {
    arrows.push({ type: 'price', content: priceRange })
  }
  if (hotelStar.length > 0) {
    arrows.push({ type: 'star', content: hotelStar })
  }
  const { startDate, endDate } = useSelector((state: any) => state.chooseDate)
  const dispatch = useDispatch()
  const { selectedAddress } = useSelector((state: any) => state.address || { selectedAddress: null })

  return (
    <View className='index'>
      <View className='tab'>
        <View className='iconfont icon-jiantou-copy icon' onClick={backToLastPage}>
        </View>
        <View className='tab-form'>
          <View className='tab-form-pos'>
            {selectedAddress?.province.slice(0, 2) || '位置'}
          </View>
          <View className='tab-form-time'>
            <View className='tab-form-checkin' onClick={changeDate}>
              <Text style={{ color: '#000000' }}>入住 </Text>{startDate ? `${getMouth(startDate)}-${getDay(startDate)}(${getWeek(startDate)})` : '12-01'}
            </View>
            <View className='tab-form-checkout'>
              <Text style={{ color: '#000000' }}>退房 </Text>{endDate ? `${getMouth(endDate)}-${getDay(endDate)}(${getWeek(endDate)})}` : '12-02'}
            </View>
          </View>
          <View className='tab-form-interval'>
             {startDate && endDate ? `${getDaysBetween(startDate, endDate)}晚` : '1晚'}
          </View>
          <View className='search'>
            <View className='search-icon icon-sousuobeifen2 iconfont'></View>
            <View className='search-input location-display'>
              {selectedAddress?.name || '位置/品牌/酒店'}
            </View>
          </View>
        </View>
        <View className='tab-choose-position' onClick={choosePositon}>
          <View className='tab-icon icon-dingwei1 iconfont'></View>
          <View className='tab-choose-position-text'>地图</View>
        </View>
      </View>
      <View className='filter-box'>
        <View className='filter-text'>{'筛选 >'}</View>
        <View className='filter'>
         {filterItems.map((item, index) => (
            <View className={`filter-item ${selectedFilter === index ? 'active' : ''}`} key={index} onClick={() => handleFilterClick(index)}>{item}</View>
          ))}
        </View>
      </View>
      {arrows.length > 0 && <View className='Label'>
       {arrows.map((arrow, index) => (
          <View
            key={arrow.type}
            className={`arrow ${index === 0 ? '' : 'arrow2'}`}
          >
            {index !== 0 && <View className='tail'></View>}
            <View className='body'>{arrow.content}</View>
            <View className='head'></View>
          </View>
        ))}
      </View>
      }
      <View className='hotel'>
        <View className='shadow-sticky'>
          {/*用于添加阴影*/}
        </View>
        {/*酒店展示组件*/}
        {loading ? (
          <View style={{ padding: '20px', textAlign: 'center' }}>
            <Text>加载中...</Text>
          </View>
        ) : hotelList.length > 0 ? (
          hotelList.map((i) => (
            <HotelShow key={i.id} i={i} onClick={() => dispatch(setChooseHotel({ hotelId: i.hotelId }))} />
          ))
        ) : (
          <View style={{ padding: '20px', textAlign: 'center' }}>
            <Text>暂无酒店数据</Text>
          </View>
        )}
      </View>
    </View>
  )
}
