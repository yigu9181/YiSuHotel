import { View, Text, Image } from '@tarojs/components'
import tagImage from '@/asset/pictures/钻石_填充.png'
import HotelPreview from '@/components/hotelShow/hotelPreview'
import './index.scss'

// 示例酒店数据（来自db.json的第一个酒店）
const sampleHotelData = {
  bannerList: [
    { id: 1, image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?cb=defcache2&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 2, image: "https://staticfile.badazhou.com/20210906/49ebe47328401af3751d33deb84771b1.jpeg" },
    { id: 3, image: "https://trueart-content.oss-cn-shanghai.aliyuncs.com/20190430/200201118_640.jpg#" }
  ],
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
  facilitiesList: [
    { text: "2020年开业", icon: "icon-jiudian" },
    { text: "新中式风", icon: "icon-gufengwujianzhongguofenggudaishuan_huaban_huaban" },
    { text: "免费停车", icon: "icon-tingche" },
    { text: "一线江景", icon: "icon-Golden-GateBridge" },
    { text: "江景下用餐", icon: "icon-a-godutch" }
  ],
  filterTagList: ["免费取消", "含早餐", "大床房", "双床房", "立即确认"],
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
    }
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

export default function addHotel({ activeTab }) {
  return (
    <View className={`user-content-myhotel ${!activeTab ? 'user-content-myhotel-move' : ''}`}>
      <View className='user-content-circle' >
        <View className='user-content-line'></View>
      </View>
      <View className='user-content-circle circle1'>
        <View className='user-content-line'></View>
      </View>
      <View className='user-content'>
        <View className='user-hotelList'>
          {Array.from({ length: 5 }, (_, i) => i).map((i) => (
            <View className='user-hotelList-item' key={i}>
            <Image className='user-hotelList-item-img' src='https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3'>
            </Image>
            <View className='user-hotelList-item-text'>
              <View className='user-hotelList-item-name'>
                <Text className='user-hotelList-item-name-text'>上海陆家嘴禧玥酒店</Text>
                <View className='user-hotelList-item-tag'>
                  {Array.from({ length: 5 }, (_, j) => j).map((j) => (
                    <Image className='user-hotelList-item-tag-img' key={j} src={tagImage} />
                  ))}
                </View>
              </View>
              <View className='hotel-evaluation'>
                <View className='hotel-point'>4.8</View>
                <View className='hotel-rank'>超棒</View>
                <View className='hotel-like'>7235评论</View>
                <View className='hotel-like'>2.3万收藏</View>
              </View>
              <View className='hotel-position'>
                近外滩·东方明珠
              </View>
              <View className='hotel-introduction'>BOSS: 25楼是上海知名米其林新荣记</View>
              <View className='hotel-label'>
                <View className='hotel-label-item'>
                  免费升房
                </View>
                <View className='hotel-label-item'>
                  新中式风
                </View>
                <View className='hotel-label-item'>
                  一线江景
                </View>
                <View className='hotel-label-item'>
                  免费停车
                </View>
              </View>
              <View className='hotel-Ranking'>上海美景酒店榜 No.16</View>
              <View className='hotel-price'><Text style='font-size: 15px'>￥</Text>936<Text style='font-size: 12px;margin-left:2px'>起</Text></View>
              <View className='hotel-supplement'>钻石贵宾价 满减券 3项优惠98<Text className='icon-jiantou-copy iconfont icon-rotate'></Text></View>
              <View className='hotel-operation'>
                <View className='hotel-operation-item'>
                  <text className='iconfont icon-chakan icon'></text>
                  &nbsp;&nbsp;查看
                </View>
                <View className='hotel-operation-item'>
                  <text className='iconfont icon-bianji icon'></text>
                  &nbsp;&nbsp;编辑
                </View>
                <View className='hotel-operation-item'>
                  <text className='iconfont icon-shanchu icon'></text>
                  &nbsp;&nbsp;删除
                </View>
              </View>
              <View className='hotel-state'>
                已发布
              </View>
            </View>
            </View>
          ))}
        </View>
        <View className='user-hotel-show'>
          <HotelPreview hotelData={sampleHotelData} />
        </View>
      </View>
    </View>
  )
}
