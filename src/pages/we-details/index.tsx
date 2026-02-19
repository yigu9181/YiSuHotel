import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React,{ useState, useRef } from 'react'
import { backToLastPage } from '@/utils/navigate'
import './index.scss'
import tagImage from '../../asset/pictures/钻石_填充.png'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })
   const [bannerList] = useState([
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
    ])
    const [facilitiesList]=useState([
      {
        text:'2020年开业',
        icon:'icon-jiudian'
      },
      {
        text:'新中式风',
        icon: 'icon-gufengwujianzhongguofenggudaishuan_huaban_huaban'
      },
      {
        text:'免费停车',
        icon: 'icon-tingche'
      },
      {
        text:'一线江景',
        icon: 'icon-Golden-GateBridge'
      },
      {
        text:'江景下用餐',
         icon: 'icon-a-godutch'
      }
    ])
    const [bannerIndex, setBannerIndex] = useState(0)
    const [showRoomDetail, setShowRoomDetail] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const roomRef = useRef(null)

    // 房型数据数组
    const roomList = [
      {
        id: 1,
        name: '经典双床房',
        price: 936,
        image: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?cb=defcache2&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        detail: '2张1.2米单人床 40㎡ 2人入住 5-15层',
        tags: ['免费取消', '含早餐', '立即确认']
      },
      {
        id: 2,
        name: '高级大床房',
        price: 1088,
        image: 'https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg',
        detail: '1张2米大床 45㎡ 2人入住 5-15层',
        tags: ['免费取消', '含早餐', '立即确认']
      },
      {
        id: 3,
        name: '豪华江景房',
        price: 1588,
        image: 'https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#',
        detail: '1张2米大床 50㎡ 2人入住 10-15层',
        tags: ['免费取消', '含早餐', '立即确认']
      }
    ]

    // 处理点击底部查看房型按钮，滑动到room板块
    const handleScrollToRoom = () => {
      Taro.pageScrollTo({
        selector: '#roomSection',
        offsetTop: -100,
        duration: 500
      })
    }

    // 处理点击房型的查看房型按钮，显示上拉框
    const handleShowRoomDetail = (room) => {
      setSelectedRoom(room)
      setShowRoomDetail(true)
    }

    // 处理关闭上拉框
    const handleCloseRoomDetail = () => {
      setShowRoomDetail(false)
      setSelectedRoom(null)
    }

  return (
    <View className='index'>
      <View className='navigation'>
        <View className='navigation-return iconfont icon-jiantou-copy' onClick={backToLastPage}></View>
        <View className='navigation-name'>上海陆家嘴禧玥酒店</View>
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
          <Text className='hotel-name-text'>上海陆家嘴禧玥酒店</Text>
          <View className='hotel-tag-box'>
            {Array.from({ length: 5 }, (_, j) => j).map((j) => (
              <Image className='hotel-tag' key={j} src={tagImage} />
            ))}
          </View>
        </View>
        <View className='hotel-Ranking'>上海美景酒店榜 No.16<View className='icon iconfont icon-jiantou-copy'></View></View>
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
              <View className='hotel-point'>4.8</View>
              <View className='hotel-rank'>超棒</View>
              <View className='hotel-like'>4564点评</View>
              <View className='iconfont icon-jiantou-copy icon'></View>
            </View>
            <View className='hotel-evaluation'>{`"中式风格装修，舒适安逸"`}</View>
          </View>
          <View className='hotel-position'>
            <View className='hotel-distance'>
              <Text style='fontWeight:600'>距塘桥地铁站步行1.5公里,约22分钟</Text> | 浦东新区浦明路868弄3号楼
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
          <View className='date-info'>
            <View className='date-item'>
              <Text className='date-day'>1月9日</Text>
              <Text className='date-week'>今天</Text>
            </View>
            <View className='date-separator'>1晚</View>
            <View className='date-item'>
              <Text className='date-day'>1月10日</Text>
              <Text className='date-week'>明天</Text>
            </View>
            <View className='date-arrow iconfont icon-jiantou-copy'></View>
          </View>
          <View className='date-note'>
            <Text className='note-text'>{`当前已过0点，如需今天凌晨6点前入住，请选择"今天凌晨"`}</Text>
          </View>
        </View>
        <View className='filter-tags'>
          <View className='filter-tag'>含早餐</View>
          <View className='filter-tag'>立即确认</View>
          <View className='filter-tag'>大床房</View>
          <View className='filter-tag'>双床房</View>
          <View className='filter-tag'>免费取</View>
          <View className='filter-tag filter-more'>
            <Text>筛选</Text>
            <Text className='iconfont icon-jiantou-copy'></Text>
          </View>
        </View>
      </View>
      <View className='hotel-room' id='roomSection'>
        {roomList.map((room) => (
          <View className='room-item' key={room.id}>
            <View className='room-image'>
              <Image src={room.image} mode='aspectFill' />
            </View>
            <View className='room-info'>
              <Text className='room-name'>{room.name}</Text>
              <Text className='room-detail'>{room.detail}</Text>
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
            936
          <Text style='font-size: 15px;margin-left:2px'>起</Text>
        </View>
        <View className='hotel-bottom-checkbtn' onClick={handleScrollToRoom}>查看房型</View>
      </View>

      {/* 房型详情上拉框 */}
      {showRoomDetail && selectedRoom && (
        <View className='room-detail-popup'>
          <View className='room-detail-popup-overlay' onClick={handleCloseRoomDetail}></View>
          <View className='room-detail-popup-content'>
            <View className='room-detail-popup-header'>
              <View className='room-detail-popup-close' onClick={handleCloseRoomDetail}>
                <Text style={{fontSize: 30, color: '#333'}}>×</Text>
              </View>
            </View>
            <ScrollView className='room-detail-popup-scroll' scrollY>
              <View className='room-detail-popup-image'>
                <Image src={selectedRoom.image} mode='aspectFill' />
              </View>
              <View className='room-detail-popup-info'>
                <Text className='room-detail-popup-name'>{selectedRoom.name}</Text>
                <View className='room-detail-popup-features'>
                  <View className='room-detail-popup-feature'>
                    <Text className='iconfont icon-mianji'></Text>
                    <Text>{selectedRoom.detail.split(' ')[1]}</Text>
                  </View>
                  <View className='room-detail-popup-feature'>
                    <Text className='iconfont icon-ceng'></Text>
                    <Text>{selectedRoom.detail.split(' ')[3]}</Text>
                  </View>
                  <View className='room-detail-popup-feature'>
                    <Text className='iconfont icon-wifi'></Text>
                    <Text>免费</Text>
                  </View>
                  <View className='room-detail-popup-feature'>
                    <Text className='iconfont icon-chuang'></Text>
                    <Text>{selectedRoom.detail.split(' ')[0]}</Text>
                  </View>
                </View>
                <View className='room-detail-popup-description'>
                  <Text className='room-detail-popup-description-title'>房间详情</Text>
                  <View style={{marginTop: 15}}>
                    <Text className='room-detail-popup-description-text'>{selectedRoom.detail}</Text>
                    <Text className='room-detail-popup-description-text'>房间宽敞明亮，配备现代化设施，为您提供舒适的住宿体验。</Text>
                  </View>
                </View>
                <View className='room-detail-popup-amenities'>
                  <Text className='room-detail-popup-amenities-title'>查看全部设施</Text>
                  <View style={{marginTop: 15}}>
                    <View className='room-detail-popup-amenities-list'>
                      <View className='room-detail-popup-amenity'>空调</View>
                      <View className='room-detail-popup-amenity'>电视</View>
                      <View className='room-detail-popup-amenity'>冰箱</View>
                      <View className='room-detail-popup-amenity'>保险箱</View>
                      <View className='room-detail-popup-amenity'>免费洗漱用品</View>
                      <View className='room-detail-popup-amenity'>吹风机</View>
                    </View>
                  </View>
                </View>
                <View className='room-detail-popup-policy'>
                  <Text className='room-detail-popup-policy-title'>政策与服务</Text>
                  <View style={{marginTop: 15}}>
                    <View className='room-detail-popup-policy-item'>
                      <Text className='iconfont icon-tishi'></Text>
                      <Text>退房时间：12:00前</Text>
                    </View>
                    <View className='room-detail-popup-policy-item'>
                      <Text className='iconfont icon-tishi'></Text>
                      <Text>入住时间：14:00后</Text>
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
                <Text style={{fontSize: 18}}>￥</Text>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{selectedRoom.price}</Text>
                <Text style={{fontSize: 15, marginLeft: 2}}>起</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
