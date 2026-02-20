
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React, { useState } from 'react'
import { backToLastPage , changeDate } from '@/utils/navigate'
import { useSelector} from 'react-redux'
import { getMouth, getDay, getWeek, getDaysBetween, getDateDescription } from '@/utils/calendar'
import { hotelApi } from '@/utils/api'
import './index.scss'
import tagImage from '../../asset/pictures/钻石_填充.png'

export default function Index() {
  const [hotelMessage, setHotelMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [showRoomDetail, setShowRoomDetail] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [selectingRoom, setSelectingRoom] = useState<any>(null)
  const hotelId = useSelector((state: any) => state.chooseHotel.id)
  const { startDate, endDate } = useSelector((state: any) => state.chooseDate)

  useLoad(() => {
    console.log('Page loaded.')
    // 获取URL参数中的hotelId
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const urlParams = currentPage?.options || {}
    const urlHotelId = urlParams.id
    console.log('Hotel ID from URL:', urlHotelId)
    console.log('Hotel ID from Redux:', hotelId)
    // 优先级：URL参数 > Redux store > 默认值1
    const idToUse = urlHotelId || hotelId || 1
    console.log('Using hotel ID:', idToUse)
    fetchHotelMessage(idToUse)
  })

  const fetchHotelMessage = async (id: number) => {
    setLoading(true)
    try {
      console.log('Fetching hotel detail for ID:', id)
      const res = await hotelApi.getHotelDetail(id)
      console.log('Hotel detail response:', res)
      if (res.code === 200 && res.data) {
        console.log('Hotel data received:', res.data)
        setHotelMessage(res.data)
      } else {
        console.error('Invalid response:', res)
        Taro.showToast({
          title: '获取酒店信息失败: 无效响应',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取酒店信息失败:', error)
      Taro.showToast({
        title: '获取酒店信息失败: 网络错误',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 处理点击底部查看房型按钮，滑动到room板块
  const handleScrollToRoom = () => {
    if (selectedRoom) {
      Taro.showToast({
        title: '预订成功',
        icon: 'success',
        duration: 2000
      })
      return
    }
    Taro.pageScrollTo({
      selector: '#roomSection',
      offsetTop: -100,
      duration: 500
    })
  }

  const handleCheckout =(room)=>{
    setSelectedRoom(room)
    setShowRoomDetail(false)
  }

  // 处理点击房型的查看房型按钮，显示上拉框
  const handleShowRoomDetail = (room) => {
    setSelectingRoom(room)
    setShowRoomDetail(true)
  }

  // 处理关闭上拉框
  const handleCloseRoomDetail = () => {
    setShowRoomDetail(false)
  }

  if (loading) {
    return (
      <View className='index' style={{ padding: '20px', textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    )
  }

  if (!hotelMessage) {
    return (
      <View className='index' style={{ padding: '20px', textAlign: 'center' }}>
        <Text>暂无酒店信息</Text>
      </View>
    )
  }

  return (
    <View className='index'>
      <View className='navigation'>
        <View className='navigation-return iconfont icon-jiantou-copy' onClick={backToLastPage}></View>
        <View className='navigation-name'>{hotelMessage.message?.name}</View>
      </View>
      <View className='banner'>
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
          {hotelMessage.bannerList?.map((banner) => (
            <SwiperItem key={banner.id}>
              <Image
                className='banner-image'
                src={banner.image}
                mode='aspectFill'
              />
              <View className='banner-title'></View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      <View className='hotel-message'>
        <View className='hexagon'>
          <View className='icon-koubei iconfont icon'></View>
          <View className='box1'>口碑榜</View>
          <View className='box2'>上榜酒店</View>
        </View>
        <View className='hotel-name'>
          <Text className='hotel-name-text'>{hotelMessage.message?.name}</Text>
          <View className='hotel-tag-box'>
            {Array.from({ length: hotelMessage.message?.star || 0 }, (_, j) => j).map((j) => (
              <Image className='hotel-tag' key={j} src={tagImage} />
            ))}
          </View>
        </View>
        <View className='hotel-Ranking'>{hotelMessage.message?.Ranking}<View className='icon iconfont icon-jiantou-copy'></View></View>
        <View className='hotel-facilities'>
          {hotelMessage.facilitiesList?.map((j) => (
            <View className='hotel-facilities-item' key={j.icon}>
              <View className={`hotel-facilities-item-icon iconfont ${j.icon}`}></View>
              <View className='hotel-facilities-item-text'>{j.text}</View>
            </View>
          ))}
        </View>
        <View className='hotel-eval-pos'>
          <View className='hotel-evaluations'>
            <View className='hotel-evaluation-item'>
              <View className='hotel-point'>{hotelMessage.message?.point}</View>
              <View className='hotel-rank'>{hotelMessage.message?.rank}</View>
              <View className='hotel-like'>{hotelMessage.message?.like}</View>
              <View className='iconfont icon-jiantou-copy icon'></View>
            </View>
            <View className='hotel-evaluation'>{`"中式风格装修，舒适安逸"`}</View>
          </View>
          <View className='hotel-position'>
            <View className='hotel-distance'>
              <Text style='fontWeight:600'>距塘桥地铁站步行1.5公里,约22分钟 |</Text> {hotelMessage.message?.position}
            </View>
            <View className='hotel-icon'>
              <View className='icon icon-dingwei2 iconfont'></View>
              <View className='text'>地图</View>
            </View>
          </View>
        </View>
      </View>
      <View className='hotel-date'>
        <View className='date-section'>
          <View className='date-info' onClick={changeDate}>
            <View className='date-item'>
              <Text className='date-day'>{startDate ? `${getMouth(startDate)}月${getDay(startDate)}日` : '12月01日'}</Text>
              <Text className='date-week'>{startDate
                ? (getDateDescription(startDate) || `周${getWeek(startDate)}`)
                : '周五'}</Text>
            </View>
            <View className='date-separator'>{startDate && endDate ? `${getDaysBetween(startDate, endDate)}晚` : '1晚'}</View>
            <View className='date-item'>
              <Text className='date-day'>{endDate ? `${getMouth(endDate)}月${getDay(endDate)}日` : '12月02日'}</Text>
              <Text className='date-week'>{endDate
                ? (getDateDescription(endDate) || `周${getWeek(endDate)}`)
                : '周六'}</Text>
            </View>
            <View className='date-arrow iconfont icon-jiantou-copy'></View>
          </View>
          <View className='date-note'>
            <Text className='note-text'>{`当前已过0点，如需今天凌晨6点前入住，请选择"今天凌晨"`}</Text>
          </View>
        </View>
        <View className='filter-tags'>
          {hotelMessage.filterTagList?.map((tag) => (
            <View className='filter-tag' key={tag}>{tag}</View>
          ))}
          <View className='filter-tag filter-more'>
            <Text>筛选</Text>
            <Text className='iconfont icon-jiantou-copy'></Text>
          </View>
        </View>
      </View>
      <View className='hotel-room' id='roomSection'>
        {hotelMessage.roomList?.map((room) => (
          <View className='room-item' key={room.id}>
            <View className='room-image'>
              <Image src={room.image} mode='aspectFill' />
            </View>
            <View className='room-info'>
              <Text className='room-name'>{room.name}</Text>
              <Text className='room-detail'>{room.detail.join(' ')}</Text>
              <View className='room-tags'>
                {room.tags.map((tag, index) => (
                  <View className='room-tag' key={index}>{tag}</View>
                ))}
              </View>
              <View className='room-price'>
                <Text className='price'>¥{room.price}</Text>
                <View className='price-btn' onClick={() => handleShowRoomDetail(room)}>查看房型</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className='hotel-bottom'>
        <View className='icon-box'>
          <View className='icon-liaotian2 iconfont bottom-icon'>
          </View>
          <Text>问客服</Text>
        </View>
        <View className='hotel-price'>
          <Text style='font-size: 18px'>￥</Text>
          {selectedRoom?selectedRoom.price:hotelMessage.message?.price}
          <Text style='font-size: 15px;margin-left:2px'>起</Text>
        </View>
        <View className='hotel-bottom-checkbtn' onClick={handleScrollToRoom}>{selectedRoom ? '预订房间':'查看房型'}</View>
      </View>

      {/* 房型详情上拉框 */}
      {showRoomDetail && selectingRoom && (
        <View className='room-detail-popup'>
          <View className='room-detail-popup-overlay' onClick={handleCloseRoomDetail}></View>
          <View className='room-detail-popup-content'>
            <View className='room-detail-popup-header'>
              <View className='room-detail-popup-close' onClick={handleCloseRoomDetail}>
                <Text style={{ fontSize: 30, color: '#333' }}>×</Text>
              </View>
            </View>
            <ScrollView className='room-detail-popup-scroll' scrollY>
              <View className='room-detail-popup-image'>
                <Image src={selectingRoom.image} mode='aspectFill' />
              </View>
              <View className='room-detail-popup-info'>
                <Text className='room-detail-popup-name'>{selectingRoom.name}</Text>
                <View className='room-detail-popup-features'>
                  {selectingRoom.detail.map((item, index) => (
                    <View className='room-detail-popup-feature' key={index}>
                      <Text>{item}</Text>
                    </View>
                  ))}
                </View>
                <View className='room-detail-popup-description'>
                  <Text className='room-detail-popup-description-title'>房间详情</Text>
                  <View style={{ marginTop: 15 }}>
                    <Text className='room-detail-popup-description-text'>{selectingRoom.introduction}</Text>
                  </View>
                </View>
                <View className='room-detail-popup-amenities'>
                  <Text className='room-detail-popup-amenities-title'>查看全部设施</Text>
                  <View style={{ marginTop: 15 }}>
                    <View className='room-detail-popup-amenities-list'>
                      {hotelMessage.amenitiesList?.map((item, index) => (
                        <View className='room-detail-popup-amenity' key={index}>{item}</View>
                      ))}
                    </View>
                  </View>
                </View>
                <View className='room-detail-popup-policy'>
                  <Text className='room-detail-popup-policy-title'>政策与服务</Text>
                  <View style={{ marginTop: 15 }}>
                    <View className='room-detail-popup-policy-item'>
                      <Text>退房时间：{hotelMessage.timePolicy?.[0]}前</Text>
                    </View>
                    <View className='room-detail-popup-policy-item'>
                      <Text>入住时间：{hotelMessage.timePolicy?.[1]}后</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View className='room-detail-popup-bottom'>
              <View className='room-detail-popup-bottom-service'>
                <Text className='iconfont icon-liaotian2'></Text>
                <Text>问客服</Text>
              </View>
              <View className='room-detail-popup-bottom-price'>
                <Text style={{ fontSize: 18 }}>￥</Text>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{selectingRoom.price}</Text>
                <Text style={{ fontSize: 15, marginLeft: 2 }}>起</Text>
              </View>
              <View className='room-detail-popup-bottom-checkbtn' onClick={()=>handleCheckout(selectingRoom)}>确认</View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
