import { View, Text} from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useSelector , useDispatch } from 'react-redux'
import React,{ useState } from 'react'
import { getMouth, getDay, getWeek, getDaysBetween } from '@/utils/calendar'
import { choosePositon, changeDate, backToLastPage } from '@/utils/navigate'
import HotelShow from '@/components/hotelShow/hotelShow'
import hotelImage1 from '../../asset/pictures/酒店1.png';
import hotelImage2 from '../../asset/pictures/酒店2.png';
import hotelImage3 from '../../asset/pictures/酒店3.png';
import hotelImage4 from '../../asset/pictures/酒店4.png';
import hotelImage5 from '../../asset/pictures/酒店5.png';
import './index.scss'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })
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
  const hotel=[
    {
      id: 1,
      name: '上海陆家嘴禧玥酒店',
      star: 5,
      point: 4.8,
      rank: '超棒',
      like: '4564点评',
      favorites: '6.3万收藏',
      image: hotelImage1,
      position: '近外滩 · 东方明珠',
      introduction: 'BOSS:25楼是上海知名米其林新荣记',
      label: ['免费升房', '新中式风', '一线江景', '免费停车'],
      Ranking: '上海美景酒店榜 No.16',
      price: 936,
      supplement: '钻石贵宾价 满减券 3项优惠98',
    },
    {
      id: 2,
      name: '上海外滩W酒店',
      star: 5,
      point: 4.9,
      rank: '超棒',
      like: '3821点评',
      favorites: '5.8万收藏',
      image: hotelImage2,
      position: '近外滩 · 南京东路',
      introduction: '网红泳池 · 直面外滩三件套',
      label: ['网红打卡', '露天泳池', '宠物友好', '行政酒廊'],
      Ranking: '上海设计酒店榜 No.3',
      price: 1288,
      supplement: '会员价 连住优惠 2项权益',
    },
    {
      id: 3,
      name: '上海和平饭店',
      star: 5,
      point: 4.7,
      rank: '很棒',
      like: '8921点评',
      favorites: '12万收藏',
      image: hotelImage3,
      position: '外滩 · 南京东路',
      introduction: '百年传奇 · 上海滩地标',
      label: ['历史名宅', '老年爵士乐团', '露台江景', 'SPA水疗'],
      Ranking: '上海历史酒店榜 No.1',
      price: 1680,
      supplement: '早鸟价 免费取消 4项优惠',
    },
    {
      id: 4,
      name: '上海柏悦酒店',
      star: 4,
      point: 4.8,
      rank: '超棒',
      like: '2156点评',
      favorites: '3.2万收藏',
      image: hotelImage4,
      position: '陆家嘴 · 环球金融中心',
      introduction: '云端体验 · 85层高空景观',
      label: ['高空景观', '无边泳池', '米其林餐厅', '管家服务'],
      Ranking: '上海奢华酒店榜 No.5',
      price: 2100,
      supplement: '预付价 升级房型 2项权益',
    },
    {
      id: 5,
      name: '上海素凯泰酒店',
      star: 4,
      point: 4.6,
      rank: '很棒',
      like: '1563点评',
      favorites: '2.1万收藏',
      image: hotelImage5,
      position: '静安区 · 兴业太古汇',
      introduction: '城市绿洲 · 意式极简设计',
      label: ['设计感', '静谧花园', '意大利餐厅', '近地铁站'],
      Ranking: '上海静奢酒店榜 No.8',
      price: 1180,
      supplement: '限时特惠 早餐赠送 3项优惠',
    },
  ]
  const [hotelList, setHotelList] = useState(hotel)
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
        {hotelList.map((i) => (
          <HotelShow key={i.id} i={i} />
        ))}
      </View>
    </View>
  )
}
