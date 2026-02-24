import { View, Text} from '@tarojs/components'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { useSelector , useDispatch } from 'react-redux'
import React,{ useState, useEffect, useRef } from 'react'
import { getMouth, getDay, getWeek, getDaysBetween } from '@/utils/calendar'
import { choosePositon, changeDate, backToLastPage } from '@/utils/navigate'
import { setChooseHotel } from '@/store/hotel/chooseHotel'
import { hotelApi } from '@/utils/api'
import HotelShow from '@/components/hotelShow/hotelShow'
import './index.scss'

export default function Index () {
  const [allHotels, setAllHotels] = useState<any[]>([])
  const [displayHotels, setDisplayHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const loadMoreRef = useRef<any>(null)

  useLoad(() => {
    console.log('Page loaded.')
    fetchHotelList()
  })

  useEffect(() => {
    // 在Taro环境中使用Taro的IntersectionObserver来检测倒数第二个酒店元素
    const observer = Taro.createIntersectionObserver(null, {
      threshold: 0.1
    })
    
    // 观察倒数第二个酒店元素，相对于.hotel容器
    observer.relativeTo('.hotel', {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    })
      .observe('.load-more-trigger', (res) => {
        console.log('触发加载更多:', res, 'hasMore:', hasMore, 'loadingMore:', loadingMore)
        if (res.intersectionRatio > 0 && hasMore && !loadingMore) {
          // 等待0.5秒后加载更多
          setTimeout(() => {
            loadMoreHotels()
          }, 500)
        }
      })
    
    return () => observer.disconnect()
  }, [hasMore, loadingMore, displayHotels.length])

  const fetchHotelList = async () => {
    setLoading(true)
    try {
      const res = await hotelApi.getHotelList()
      if (res.code === 200 && res.data) {
        // 提取message部分，并过滤出已发布的酒店
        const messageList = res.data
          .filter((hotel: any) => hotel.status === '已发布')
          .map((hotel: any) => ({
            ...hotel.message,
            hotelId: hotel.id
          }))
        setAllHotels(messageList)
        // 只显示前5个酒店
        setDisplayHotels(messageList.slice(0, 5))
        // 检查是否还有更多酒店
        setHasMore(messageList.length > 5)
        setCurrentPage(1)
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

  const loadMoreHotels = async () => {
    console.log('开始加载更多', 'currentPage:', currentPage, 'allHotels.length:', allHotels.length, 'displayHotels.length:', displayHotels.length)
    if (loadingMore || !hasMore) {
      console.log('跳过加载更多', 'loadingMore:', loadingMore, 'hasMore:', hasMore)
      return
    }

    setLoadingMore(true)
    try {
      // 计算下一页要显示的酒店数量，每次加载5个
      const nextPage = currentPage + 1
      const startIndex = currentPage * 5
      const endIndex = startIndex + 5

      console.log('加载参数', 'startIndex:', startIndex, 'endIndex:', endIndex)

      // 确保startIndex不超过allHotels.length
      if (startIndex >= allHotels.length) {
        console.log('startIndex >= allHotels.length', 'startIndex:', startIndex, 'allHotels.length:', allHotels.length)
        setHasMore(false)
        return
      }

      // 获取剩余的酒店，即使不足5个
      const newHotels = allHotels.slice(startIndex, endIndex)
      console.log('加载到的酒店数量:', newHotels.length)

      if (newHotels.length > 0) {
        setDisplayHotels(prev => [...prev, ...newHotels])
        setCurrentPage(nextPage)
        // 检查是否还有更多酒店
        const hasMoreHotels = endIndex < allHotels.length
        console.log('检查是否还有更多酒店', 'endIndex:', endIndex, 'allHotels.length:', allHotels.length, 'hasMoreHotels:', hasMoreHotels)
        setHasMore(hasMoreHotels)
      } else {
        console.log('没有加载到酒店')
        setHasMore(false)
      }
    } catch (error) {
      console.error('加载更多酒店失败:', error)
    } finally {
      setLoadingMore(false)
      console.log('加载更多完成')
    }
  }

  const filterItems = ['默认','按热度','按价格','按星级','按评分']
  const [selectedFilter, setSelectedFilter] = useState(0)
  const handleFilterClick = (index: number) => {
    setSelectedFilter(index)
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    setTimeout(() => {
      Taro.hideLoading()
      let newList = [...allHotels]

      if (index === 0) {
        newList.sort((a, b) => a.id - b.id)
      } else if (index === 1) {
        newList.sort((a, b) => b.like - a.like)
      } else if (index === 2) {
        newList.sort((a, b) => a.price - b.price)
      } else if (index === 3) {
        newList.sort((a, b) => b.star - a.star)
      } else if (index === 4) {
        newList.sort((a, b) => b.point - a.point)
      }

      // 重新设置显示的酒店，只显示前5个
      setDisplayHotels(newList.slice(0, 5))
      setCurrentPage(1)
      setHasMore(newList.length > 5)
    }, 300)
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
        <View className='filter-text'>{'排序 >'}</View>
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
        ) : displayHotels.length > 0 ? (
          <>
            {displayHotels.map((i, index) => (
              <View key={i.id} className={index === displayHotels.length - 2 ? 'load-more-trigger' : ''}>
                <HotelShow i={i} onClick={() => dispatch(setChooseHotel({ hotelId: i.hotelId }))} />
              </View>
            ))}
            {/* 加载更多指示器 */}
            {loadingMore && (
              <View style={{ padding: '20px', textAlign: 'center' }}>
                <Text>加载中...</Text>
              </View>
            )}
            {/* 无更多酒店提示 */}
            {!hasMore && displayHotels.length > 0 && (
              <View style={{  textAlign: 'center', color: '#999' }}>
                <Text>没有更多酒店了</Text>
              </View>
            )}
          </>
        ) : (
          <View style={{  textAlign: 'center' }}>
            <Text>暂无酒店数据</Text>
          </View>
        )}
      </View>
    </View>
  )
}
