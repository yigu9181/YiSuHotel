
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React, { useState } from 'react'
import { backToLastPage , changeDate } from '@/utils/navigate'
import { useSelector} from 'react-redux'
import { getMouth, getDay, getWeek, getDaysBetween, getDateDescription } from '@/utils/calendar'
import './index.scss'
import tagImage from '../../asset/pictures/钻石_填充.png'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })
  const hotel={
    message:{
      id: 1,
      name: '上海陆家嘴禧玥酒店',
      star: 5,
      point: 4.8,
      rank: '超棒',
      like: '4564点评',
      favorites: '6.3万收藏',
      image: '../../asset/pictures/酒店1.png',
      position: '近外滩 · 东方明珠',
      address:'浦东新区浦明路868弄3号楼',
      introduction: 'BOSS:25楼是上海知名米其林新荣记',
      label: ['免费升房', '新中式风', '一线江景', '免费停车'],
      Ranking: '上海美景酒店榜 No.16',
      price: 936,
      supplement: '钻石贵宾价 满减券 3项优惠98',
    },
    bannerList: [
      {
        id: 1,
        image: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?cb=defcache2&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 2,
        image: 'https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg'
      },
      {
        id: 3,
        image: 'https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#',
      }
    ],
    facilitiesList: [
      {
        text: '2020年开业',
        icon: 'icon-jiudian'
      },
      {
        text: '新中式风',
        icon: 'icon-gufengwujianzhongguofenggudaishuan_huaban_huaban'
      },
      {
        text: '免费停车',
        icon: 'icon-tingche'
      },
      {
        text: '一线江景',
        icon: 'icon-Golden-GateBridge'
      },
      {
        text: '江景下用餐',
        icon: 'icon-a-godutch'
      }
    ],
    roomList:[
      {
        id: 1,
        name: '经典双床房',
        price: 936,
        image: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?cb=defcache2&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        detail: ['2张1.2米单人床' , '40㎡', '2人入住' , '5-15层'],
        introduction: '房间宽敞明亮，配备现代化设施，为您提供舒适的住宿体验。',
        tags: ['免费取消', '含早餐', '立即确认']
      },
      {
        id: 2,
        name: '高级大床房',
        price: 1088,
        image: 'https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg',
        detail: ['2张1.2米单人床', '40㎡', '2人入住', '5-15层'],
        introduction: '房间宽敞明亮，配备现代化设施，为您提供舒适的住宿体验。',
        tags: ['免费取消', '含早餐', '立即确认']
      },
      {
        id: 3,
        name: '豪华总统套房',
        price: 1288,
        image: 'https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#',
        detail: ['2张1.2米单人床', '40㎡', '2人入住', '5-15层'],
        introduction: '房间宽敞明亮，配备现代化设施，为您提供舒适的住宿体验。',
        tags: ['免费取消', '含早餐', '立即确认']
      }
    ],
    filterTagList: [
      '免费取消',
      '含早餐',
      '大床房',
      '双床房',
      '立即确认'
    ],
    amenitiesList: [
      '吹风机',
      '空调',
      '电视',
      '保险箱',
      '免费洗漱用品',
      '冰箱',
      '洗衣机'
    ],
    timePolicy: [
      '14:00',
      '12:00'
    ]
  }
  interface Room {
    id: number
    name: string
    price: number
    image: string
    detail: string[]
    introduction: string
    tags: string[]
  }
  const [bannerList] = useState(hotel.bannerList)
  const [facilitiesList] = useState(hotel.facilitiesList)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [showRoomDetail, setShowRoomDetail] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectingRoom, setSelectingRoom] = useState<Room | null>(null)
  const { startDate, endDate } = useSelector((state: any) => state.chooseDate)
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

  return (
    <View className='index'>
      <View className='navigation'>
        <View className='navigation-return iconfont icon-jiantou-copy' onClick={backToLastPage}></View>
        <View className='navigation-name'>{hotel.message.name}</View>
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
          {bannerList.map((banner) => (
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
          <Text className='hotel-name-text'>{hotel.message.name}</Text>
          <View className='hotel-tag-box'>
            {Array.from({ length: hotel.message.star }, (_, j) => j).map((j) => (
              <Image className='hotel-tag' key={j} src={tagImage} />
            ))}
          </View>
        </View>
        <View className='hotel-Ranking'>{hotel.message.Ranking}<View className='icon iconfont icon-jiantou-copy'></View></View>
        <View className='hotel-facilities'>
          {facilitiesList.map((j) => (
            <View className='hotel-facilities-item' key={j.icon}>
              <View className={`hotel-facilities-item-icon iconfont ${j.icon}`}></View>
              <View className='hotel-facilities-item-text'>{j.text}</View>
            </View>
          ))}
        </View>
        <View className='hotel-eval-pos'>
          <View className='hotel-evaluations'>
            <View className='hotel-evaluation-item'>
              <View className='hotel-point'>{hotel.message.point}</View>
              <View className='hotel-rank'>{hotel.message.rank}</View>
              <View className='hotel-like'>{hotel.message.like}</View>
              <View className='iconfont icon-jiantou-copy icon'></View>
            </View>
            <View className='hotel-evaluation'>{`"中式风格装修，舒适安逸"`}</View>
          </View>
          <View className='hotel-position'>
            <View className='hotel-distance'>
              <Text style='fontWeight:600'>距塘桥地铁站步行1.5公里,约22分钟 |</Text> {hotel.message.position}
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
          {hotel.filterTagList.map((tag) => (
            <View className='filter-tag' key={tag}>{tag}</View>
          ))}
          <View className='filter-tag filter-more'>
            <Text>筛选</Text>
            <Text className='iconfont icon-jiantou-copy'></Text>
          </View>
        </View>
      </View>
      <View className='hotel-room' id='roomSection'>
        {hotel.roomList.map((room) => (
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
          {selectedRoom?selectedRoom.price:hotel.message.price}
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
                      {hotel.amenitiesList.map((item, index) => (
                        <View className='room-detail-popup-amenity' key={index}>{item}</View>
                      ))}
                    </View>
                  </View>
                </View>
                <View className='room-detail-popup-policy'>
                  <Text className='room-detail-popup-policy-title'>政策与服务</Text>
                  <View style={{ marginTop: 15 }}>
                    <View className='room-detail-popup-policy-item'>
                      <Text>退房时间：{hotel.timePolicy[0]}前</Text>
                    </View>
                    <View className='room-detail-popup-policy-item'>
                      <Text>入住时间：{hotel.timePolicy[1]}后</Text>
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
