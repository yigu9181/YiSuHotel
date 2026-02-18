import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import tagImage from '../../asset/pictures/钻石_填充.png'
import './index.scss'

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
        icon: 'icon-icontubiaohuizhizhuanqu_huaban1fuben7'
      },
      {
        text:'江景下用餐',
         icon: 'icon-a-godutch'
      }
    ])
    const [bannerIndex, setBannerIndex] = useState(0)
  return (
    <View className='index'>
      <View className='navigation'>
        <View className='navigation-return iconfont icon-jiantou-copy' onClick={() => Taro.navigateBack({ delta: 1 })}></View>
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
            <View className='hotel-evaluation'>"中式风格装修，舒适安逸"</View>
          </View>
          <View className='hotel-position'>
            <View className='hotel-distance'>
              <Text style={'fontWeight:600'}>距塘桥地铁站步行1.5公里,约22分钟</Text> | 浦东新区浦明路868弄3号楼
            </View>
            <View className='hotel-icon'>
              <View className='icon icon-dingwei2 iconfont'></View>
              <View className='text'>地图</View>
            </View>
          </View>
        </View>
      </View>
      <View className='hotel-date'></View>
      <View className='hotel-room'></View>
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
        <View className='hotel-bottom-checkbtn'>查看房型</View>
      </View>
    </View>
  )
}
