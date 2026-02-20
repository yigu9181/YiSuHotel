import React from 'react'
import { listToDetail } from '@/utils/navigate'
import { View, Text, Image } from '@tarojs/components'
import tagImage from '../../asset/pictures/钻石_填充.png'
import './index.scss'

export default function HotelShow({ i ,onClick}) {
  const handleClick = () => {
    console.log('Hotel clicked:', i)
    console.log('Hotel ID:', i.hotelId)
    // 先调用导航
    listToDetail(i.hotelId)
    // 然后调用onClick回调
    if (onClick) {
      onClick(i.hotelId)
    }
  }
  
  return (
    <View className='hotel-item' key={i.id} onClick={handleClick}>
      <Image className='hotel-picture' src={i.image} />
      <View className='hotel-text'>
        <View className='hotel-name'>
          <Text className='hotel-name-text'>{i.name}</Text>
          <View className='hotel-tag-box'>
          {/*用于添加钻石*/}
            {Array.from({ length: i.star }, (_, j) => j).map((j) => (
              <Image className='hotel-tag' key={j} src={tagImage} />
            ))}
          </View>
        </View>
        <View className='hotel-evaluation'>
          <View className='hotel-point'>{i.point}</View>
          <View className='hotel-rank'>{i.rank}</View>
          <View className='hotel-like'>{i.like}</View>
        </View>
        <View className='hotel-position'>
          {i.position}
        </View>
        <View className='hotel-introduction'>{i.introduction}</View>
        <View className='hotel-label'>
          {i.label.map((label) => (
            <View className='hotel-label-item' key={label}>{label}</View>
          ))}
        </View>
        <View className='hotel-Ranking'>{i.Ranking}</View>
        <View className='hotel-price'><Text style='font-size: 15px'>￥</Text>{i.price}<Text style='font-size: 12px;margin-left:2px'>起</Text></View>
        <View className='hotel-supplement'>{i.supplement}<Text className='icon-jiantou-copy iconfont icon-rotate'></Text></View>
      </View>
    </View>
  )
}
