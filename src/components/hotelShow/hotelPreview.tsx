import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import React, { useState } from 'react'
import tagImage from '@/asset/pictures/钻石_填充.png'
import { getMouth, getDay, getWeek, getDateDescription } from '@/utils/calendar'
import './hotelPreview.scss'

interface HotelPreviewProps {
  hotelData?: any
  isActive?: boolean
  onRoomClick?: (room: any) => void
  onHotelClick?: () => void
}

export default function HotelPreview({ hotelData, isActive, onRoomClick, onHotelClick }: HotelPreviewProps) {
  // 如果没有传入酒店数据，则使用默认示例数据（来自db.json的第一个酒店）
  const hotel = hotelData || {
    id: "1",
    message: {
      id: 1,
      name: "上海陆家嘴禧玥酒店",
      star: 5,
      point: 4.8,
      rank: "超棒",
      like: 4564,
      favorites: "6.3万收藏",
      image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3",
      position: "近外滩 · 东方明珠",
      address: "浦东新区浦明路868弄3号楼",
      introduction: "BOSS: 25楼是上海知名米其林新荣记",
      label: [
        "免费升房",
        "新中式风",
        "一线江景",
        "免费停车"
      ],
      Ranking: "上海美景酒店榜 No.16",
      price: 936,
      supplement: "钻石贵宾价 满减券 3项优惠98"
    },
    bannerList: [
      {
        id: 1,
        image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?cb=defcache2&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        id: 2,
        image: "https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg"
      },
      {
        id: 3,
        image: "https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#"
      }
    ],
    facilitiesList: [
      {
        text: "2020年开业",
        icon: "icon-jiudian"
      },
      {
        text: "新中式风",
        icon: "icon-gufengwujianzhongguofenggudaishuan_huaban_huaban"
      },
      {
        text: "免费停车",
        icon: "icon-tingche"
      },
      {
        text: "一线江景",
        icon: "icon-Golden-GateBridge"
      },
      {
        text: "江景下用餐",
        icon: "icon-a-godutch"
      }
    ],
    roomList: [
      {
        id: 1,
        name: "经典双床房",
        price: 936,
        image: "https://staticfile.badazhou.com/20210906/a25aa22296f621ecf7292846bdb5af09.jpeg",
        detail: [
          "2张1.2米单人床",
          "40㎡",
          "2人入住",
          "5-15层"
        ],
        introduction: "房间宽敞明亮，配备现代化设施，为您提供舒适的住宿体验。",
        tags: [
          "免费取消",
          "含早餐",
          "立即确认"
        ]
      },
      {
        id: 2,
        name: "高级大床房",
        price: 1088,
        image: "https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg",
        detail: [
          "1张1.8米大床",
          "45㎡",
          "2人入住",
          "16-20层"
        ],
        introduction: "高层景观房，俯瞰黄浦江美景，尽享都市繁华。",
        tags: [
          "免费取消",
          "含早餐",
          "立即确认"
        ]
      },
      {
        id: 3,
        name: "豪华总统套房",
        price: 1288,
        image: "https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#",
        detail: [
          "1张2.0米特大床",
          "80㎡",
          "2人入住",
          "21-25层"
        ],
        introduction: "尊贵套房体验，独立客厅，270度江景视野。",
        tags: [
          "免费取消",
          "含早餐",
          "立即确认"
        ]
      }
    ],
    filterTagList: [
      "免费取消",
      "含早餐",
      "大床房",
      "双床房",
      "立即确认"
    ],
    amenitiesList: [
      "吹风机",
      "空调",
      "电视",
      "保险箱",
      "免费洗漱用品",
      "冰箱",
      "洗衣机"
    ],
    timePolicy: [
      "14:00",
      "12:00"
    ]
  }

  const [showRoomDetail, setShowRoomDetail] = useState(false);
  const [selectingRoom, setSelectingRoom] = useState<any>(null);

  const handleRoomClick = (room) => {
    if (onRoomClick) {
      onRoomClick(room);
    } else {
      // 默认行为：显示房型详情弹窗
      setSelectingRoom(room);
      setShowRoomDetail(true);
    }
  };

  const handleHotelClick = () => {
    if (onHotelClick) {
      onHotelClick();
    }
  };

  const handleShowRoomDetail = (room) => {
    setSelectingRoom(room);
    setShowRoomDetail(true);
  }

  const handleCloseRoomDetail = () => {
    setShowRoomDetail(false);
  }

  // 模拟日期数据
  const startDate = null;
  const endDate = null;

  return (
    <View className={`hotel-preview-container ${isActive ? 'active' : ''}`}>
      <View className='preview-content'>
      <View className='preview-content-scroll'>
        <View className='preview-navigation'>
          <View className='preview-navigation-return iconfont icon-jiantou-copy'></View>
          <View className='preview-navigation-name'>{hotel.message?.name}</View>
        </View>

        <View className='preview-banner'>
          <Swiper
            className='preview-banner-swiper'
            indicatorColor='#999'
            indicatorActiveColor='#fff'
            autoplay
            interval={3000}
            duration={500}
            circular
            current={0}
            indicatorDots
          >
            {hotel.bannerList?.slice(0, 3).map((banner) => (
              <SwiperItem key={banner.id}>
                <Image
                  className='preview-banner-image'
                  src={banner.image}
                  mode='aspectFill'
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        <View className='preview-hotel-message'>
          <View className='preview-hexagon'>
            <View className='icon-koubei iconfont icon'></View>
            <View className='preview-box1'>口碑榜</View>
            <View className='preview-box2'>上榜酒店</View>
          </View>
          <View className='preview-hotel-name'>
            <Text className='preview-hotel-name-text'>{hotel.message?.name}</Text>
            <View className='preview-hotel-tag-box'>
              {Array.from({ length: hotel.message?.star || 0 }, (_, j) => j).map((j) => (
                <Image className='preview-hotel-tag' key={j} src={tagImage} />
              ))}
            </View>
          </View>
          <View className='preview-hotel-Ranking'>{hotel.message?.Ranking}<View className='icon iconfont icon-jiantou-copy'></View></View>
          <View className='preview-hotel-facilities'>
            {hotel.facilitiesList?.slice(0, 5).map((j) => (
              <View className='preview-hotel-facilities-item' key={j.icon}>
                <View className={`preview-hotel-facilities-item-icon iconfont ${j.icon}`}></View>
                <View className='preview-hotel-facilities-item-text'>{j.text}</View>
              </View>
            ))}
          </View>
          <View className='preview-hotel-eval-pos'>
            <View className='preview-hotel-evaluations'>
              <View className='preview-hotel-evaluation-item'>
                <View className='preview-hotel-point'>{hotel.message?.point}</View>
                <View className='preview-hotel-rank'>{hotel.message?.rank}</View>
                <View className='preview-hotel-like'>{hotel.message?.like}评论</View>
                <View className='iconfont icon-jiantou-copy icon'></View>
              </View>
              <View className='preview-hotel-evaluation'>{`"中式风格装修，舒适安逸"`}</View>
            </View>
            <View className='preview-hotel-position'>
              <View className='preview-hotel-distance'>
                <Text style={{fontWeight:600}}>距塘桥地铁站步行1.5公里,约22分钟 |</Text> {hotel.message?.position}
              </View>
              <View className='preview-hotel-icon'>
                <View className='icon icon-dingwei2 iconfont'></View>
                <View className='text'>地图</View>
              </View>
            </View>
          </View>
        </View>

        <View className='preview-hotel-date'>
          <View className='preview-date-section'>
            <View className='preview-date-info'>
              <View className='preview-date-item'>
                <Text className='preview-date-day'>12月01日</Text>
                <Text className='preview-date-week'>{startDate ? (getDateDescription(startDate) || `周${getWeek(startDate)}`) : '周五'}</Text>
              </View>
              <View className='preview-date-separator'>1晚</View>
              <View className='preview-date-item'>
                <Text className='preview-date-day'>12月02日</Text>
                <Text className='preview-date-week'>{endDate ? (getDateDescription(endDate) || `周${getWeek(endDate)}`) : '周六'}</Text>
              </View>
              <View className='preview-date-arrow iconfont icon-jiantou-copy'></View>
            </View>
            <View className='preview-date-note'>
              <View className='preview-note-text'>{`当前已过0点，如需今天凌晨6点前入住，请选择"今天凌晨"`}</View>
            </View>
          </View>
          <View className='preview-filter-tags'>
            {hotel.filterTagList?.slice(0, 3).map((tag) => (
              <View className='preview-filter-tag' key={tag}>{tag}</View>
            ))}
            <View className='preview-filter-tag preview-filter-more'>
              <View>筛选</View>
              <View className='iconfont icon-jiantou-copy' style={{fontSize:'10px'}}></View>
            </View>
          </View>
        </View>

        <View className='preview-hotel-room'>
          {hotel.roomList?.map((room) => (
            <View className='preview-room-item' key={room.id} onClick={() => handleShowRoomDetail(room)}>
              <View className='preview-room-image'>
                <Image className='preview-room-the-image' src={room.image} />
              </View>
              <View className='preview-room-info'>
                <View className='preview-room-name'>{room.name}</View>
                <View className='preview-room-detail'>{room.detail.join(' ')}</View>
                <View className='preview-room-tags'>
                  {room.tags.map((tag, index) => (
                    <View className='preview-room-tag' key={index}>{tag}</View>
                  ))}
                </View>
                <View className='preview-room-price'>
                  <Text className='preview-price'>¥{room.price}</Text>
                  <View className='preview-price-btn'>查看房型</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      </View>
      <View className='preview-hotel-bottom'>
        <View className='preview-icon-box'>
          <View className='icon-liaotian2 iconfont preview-bottom-icon'>
          </View>
          <Text className='preview-bottom-text'>问客服</Text>
        </View>
        <View className='preview-hotel-price'>
          <Text style={{ fontSize: '16px' }}>￥</Text>
          {hotel.message?.price}
          <Text style={{ fontSize: '16px', marginLeft: '4px' }}>起</Text>
        </View>
        <View className='preview-hotel-bottom-checkbtn' >查看房型</View>
      </View>
      {/* 房型详情上拉框 */}
      {showRoomDetail && selectingRoom && (
        <View className='preview-room-detail-popup'>
          <View className='preview-room-detail-popup-overlay' onClick={handleCloseRoomDetail}></View>
          <View className='preview-room-detail-popup-content'>
            <View className='preview-room-detail-popup-header'>
              <View className='preview-room-detail-popup-close' onClick={handleCloseRoomDetail}>
                <Text style={{ fontSize: 30, color: '#333' }}>×</Text>
              </View>
            </View>
            <ScrollView className='preview-room-detail-popup-scroll' scrollY>
              <View className='preview-room-detail-popup-image'>
                <Image className='preview-room-detail-popup-the-image' src={selectingRoom.image} />
              </View>
              <View className='preview-room-detail-popup-info'>
                <View className='preview-room-detail-popup-name' >{selectingRoom.name}</View>
                <View className='preview-room-detail-popup-features'>
                  {selectingRoom.detail.map((item, index) => (
                    <View className='preview-room-detail-popup-feature' key={index}>
                      <View >{item}</View>
                    </View>
                  ))}
                </View>
                <View className='preview-room-detail-popup-description'>
                  <View className='preview-room-detail-popup-description-title' >房间详情</View>
                  <View >
                    <View className='preview-room-detail-popup-description-text' >{selectingRoom.introduction}</View>
                  </View>
                </View>
                <View className='preview-room-detail-popup-amenities'>
                  <View className='preview-room-detail-popup-amenities-title' >查看全部设施</View>
                  <View >
                    <View className='preview-room-detail-popup-amenities-list'>
                      {hotel.amenitiesList?.map((item, index) => (
                        <View className='preview-room-detail-popup-amenity' key={index} >{item}</View>
                      ))}
                    </View>
                  </View>
                </View>
                <View className='preview-room-detail-popup-policy'>
                  <View className='preview-room-detail-popup-policy-title'>政策与服务</View>
                  <View >
                    <View className='preview-room-detail-popup-policy-item'>
                      <Text >退房时间：{hotel.timePolicy?.[0]}前</Text>
                    </View>
                    <View className='preview-room-detail-popup-policy-item'>
                      <Text>入住时间：{hotel.timePolicy?.[1]}后</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View className='preview-room-detail-popup-bottom'>
              <View className='preview-room-detail-popup-bottom-service'>
                <Text className='iconfont icon-liaotian2'></Text>
                <Text className='preview-bottom-text'>问客服</Text>
              </View>
              <View className='preview-room-detail-popup-bottom-price'>
                <Text >￥</Text>
                <Text style={{  fontWeight: 'bold' }}>{selectingRoom.price}</Text>
                <Text style={{ marginLeft: 4 }}>起</Text>
              </View>
              <View className='preview-room-detail-popup-bottom-checkbtn' onClick={handleCloseRoomDetail} >确认</View>
            </View>
          </View>
        </View>
      )}

    </View>
  )
}
