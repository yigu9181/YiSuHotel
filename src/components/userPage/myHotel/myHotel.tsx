import { View, Text, Image } from '@tarojs/components'
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import tagImage from '@/asset/pictures/钻石_填充.png'
import HotelPreview from '@/components/hotelShow/hotelPreview'
import './index.scss'

// 酒店数据类型定义
interface HotelMessage {
  id: number;
  name: string;
  star: number;
  point: number;
  rank: string;
  like: number;
  favorites: string;
  image: string;
  position: string;
  address: string;
  introduction: string;
  label: string[];
  Ranking: string;
  price: number;
  supplement: string;
}

interface Hotel {
  id: string;
  userId: string;
  status: string;
  rejectReason?: string;
  message: HotelMessage;
  bannerList: any[];
  facilitiesList: any[];
  roomList: any[];
  filterTagList: string[];
  amenitiesList: string[];
  timePolicy: string[];
}

// 用户信息类型定义
interface UserInfo {
  id: string;
  username: string;
  role: string;
  token: string;
}

// 组件属性类型定义
interface MyHotelProps {
  activeTab: boolean;
  userInfo: UserInfo | null;
  onHotelSelect: ((hotel: Hotel) => void) | undefined;
  selectedHotel: Hotel | null;
  onEditHotel: ((hotel: Hotel) => void) | undefined;
  onDeleteHotel: ((hotel: Hotel) => void) | undefined;
}

export default function MyHotel({ activeTab, userInfo, onHotelSelect, selectedHotel, onEditHotel, onDeleteHotel }: MyHotelProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取用户管理的酒店列表
  useEffect(() => {
    if (userInfo) {
      fetchUserHotels(userInfo.id);
    }
  }, [userInfo]);

  const fetchUserHotels = async (userId: string) => {
    setLoading(true);
    try {
      const response = await Taro.request({
        url: 'http://localhost:3000/hotels',
        method: 'GET'
      });

      // 筛选出用户管理的酒店
      const userHotels = response.data.filter((hotel: Hotel) => hotel.userId === userId);
      setHotels(userHotels);
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotel: Hotel) => {
    if (onHotelSelect) {
      onHotelSelect(hotel);
    }
  };

  // 处理查看按钮点击
  const handleViewHotel = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    if (onHotelSelect) {
      onHotelSelect(hotel);
    }
  };

  // 处理编辑按钮点击
  const handleEditHotel = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    if (onEditHotel) {
      onEditHotel(hotel);
    }
  };

  // 处理删除按钮点击
  const handleDeleteHotel = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    if (onDeleteHotel) {
      onDeleteHotel(hotel);
    }
  };

  // 处理查看不通过理由
  const handleViewRejectReason = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    if (hotel.rejectReason) {
      Taro.showModal({
        title: '不通过原因',
        content: hotel.rejectReason,
        confirmColor: '#3690f7',
        confirmText: '确定',
        cancelText: '取消'
      });
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case '待审核':
        return '待审核';
      case '已发布':
        return '已发布';
      case '未通过':
        return '未通过';
      case '已下线':
        return '已下线';
      default:
        return status;
    }
  };

  // 获取状态样式
  const getStatusClass = (status: string) => {
    switch (status) {
      case '待审核':
        return 'status-pending';
      case '已发布':
        return 'status-approved';
      case '未通过':
        return 'status-rejected';
      case '已下线':
        return 'status-offline';
      default:
        return '';
    }
  };

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
          {loading ? (
            <View className='empty-state'>
              <Text className='empty-text'>加载中...</Text>
            </View>
          ) : hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <View
                className={`user-hotelList-item ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
                key={hotel.id}
              >
                <Image
                  className='user-hotelList-item-img'
                  src={hotel.message?.image || 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3'}
                />
                <View className='user-hotelList-item-text'>
                  <View className='user-hotelList-item-name'>
                    <Text className='user-hotelList-item-name-text'>{hotel.message?.name || '未知酒店'}</Text>
                    <View className='user-hotelList-item-tag'>
                      {Array.from({ length: hotel.message?.star || 0 }, (_, j) => j).map((j) => (
                        <Image className='user-hotelList-item-tag-img' key={j} src={tagImage} />
                      ))}
                    </View>
                  </View>
                  <View className='hotel-evaluation'>
                    <View className='hotel-point'>{hotel.message?.point || 0}</View>
                    <View className='hotel-rank'>{hotel.message?.rank || '一般'}</View>
                    <View className='hotel-like'>{hotel.message?.like || 0}评论</View>
                    <View className='hotel-like'>{hotel.message?.favorites || '0收藏'}</View>
                  </View>
                  <View className='hotel-position'>
                    {hotel.message?.position || '未知位置'}
                  </View>
                  <View className='hotel-introduction'>{hotel.message?.introduction || '暂无介绍'}</View>
                  <View className='hotel-label'>
                    {hotel.message?.label?.map((label, i) => (
                      <View className='hotel-label-item' key={i}>
                        {label}
                      </View>
                    )) || []}
                  </View>
                  <View className='hotel-Ranking'>{hotel.message?.Ranking || ''}</View>
                  <View className='hotel-price'><Text style='font-size: 15px'>￥</Text>{hotel.message?.price || 0}<Text style='font-size: 12px;margin-left:2px'>起</Text></View>
                  <View className='hotel-supplement'>{hotel.message?.supplement || ''}<Text className='icon-jiantou-copy iconfont icon-rotate'></Text></View>
                  <View className='hotel-operation'>
                    <View className='hotel-operation-item' onClick={(e) => handleViewHotel(e, hotel)}>
                      <text className='iconfont icon-chakan icon'></text>
                      &nbsp;&nbsp;查看
                    </View>
                    <View className='hotel-operation-item' onClick={(e) => handleEditHotel(e, hotel)}>
                      <text className='iconfont icon-bianji icon'></text>
                      &nbsp;&nbsp;编辑
                    </View>
                    {hotel.status === '未通过' && (
                      <View className='hotel-operation-item' onClick={(e) => handleViewRejectReason(e, hotel)} style={{ color: '#ff5900' }}>
                        <text className='iconfont icon-yuanyin icon' ></text>
                        &nbsp;&nbsp;原因
                      </View>
                    )}
                    <View className='hotel-operation-item' onClick={(e) => handleDeleteHotel(e, hotel)}>
                      <text className='iconfont icon-shanchu icon'></text>
                      &nbsp;&nbsp;删除
                    </View>
                  </View>
                  <View className={`hotel-state ${getStatusClass(hotel.status)}`}>
                    {getStatusText(hotel.status)}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='empty-state'>
              <Text className='empty-text'>暂无管理下的酒店</Text>
            </View>
          )}
        </View>
        <View className='user-hotel-show'>
          {selectedHotel ? (
            <HotelPreview hotelData={selectedHotel} />
          ) : (
            <View className='no-selection'>
              <Text className='no-selection-text'>请选择酒店查看</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
