import { View, Text, Image, Button, Textarea } from '@tarojs/components'
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
interface HotelAuditProps {
  activeTab: boolean;
  userInfo: UserInfo | null;
  onHotelSelect: ((hotel: Hotel) => void) | undefined;
  selectedHotel: Hotel | null;
  onAuditHotel: ((hotel: Hotel, action: string, reason?: string) => void) | undefined;
  onRecoverHotel: ((hotel: Hotel) => void) | undefined;
  refreshKey: number; // 用于触发酒店列表刷新
}

export default function HotelAudit({ activeTab, userInfo, onHotelSelect, selectedHotel, onAuditHotel, onRecoverHotel, refreshKey }: HotelAuditProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all'); // all, pending, approved, rejected, offline

  // 审核不通过原因输入弹框状态
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);

  // 获取所有酒店列表（管理员视角）
  useEffect(() => {
    fetchAllHotels();
  }, [refreshKey]);

  const fetchAllHotels = async () => {
    setLoading(true);
    try {
      // 模拟API请求
      const response = await Taro.request({
        url: 'http://localhost:3000/hotels',
        method: 'GET'
      });

      // 假设返回的数据结构
      setHotels(response.data || []);
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // 筛选酒店
  const filteredHotels = hotels.filter(hotel => {
    if (filter === 'all') return true;
    if (filter === 'pending') return hotel.status === '待审核';
    if (filter === 'approved') return hotel.status === '已发布';
    if (filter === 'rejected') return hotel.status === '未通过';
    if (filter === 'offline') return hotel.status === '已下线';
    return true;
  });

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

  // 处理审核按钮点击
  const handleAuditHotelClick = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();

    // 显示审核结果选择（使用原来的 showModal）
    Taro.showModal({
      title: '审核酒店',
      content: '请选择审核结果',
      confirmColor: '#3690f7',
      confirmText: '通过',
      cancelText: '不通过',
      success: (res) => {
        if (res.confirm) {
          // 通过审核
          if (onAuditHotel) {
            onAuditHotel(hotel, 'approve');
          }
        } else if (res.cancel) {
          // 不通过审核，打开自定义的原因输入弹框
          setRejectReason('');
          setCurrentHotel(hotel);
          setRejectModalVisible(true);
        }
      }
    });
  };

  // 处理不通过原因提交
  const handleRejectSubmit = () => {
    if (!currentHotel || !onAuditHotel) return;

    if (!rejectReason || rejectReason.trim() === '') {
      Taro.showToast({
        title: '请输入不通过原因',
        icon: 'none'
      });
      return;
    }

    // 执行审核不通过操作
    onAuditHotel(currentHotel, 'reject', rejectReason.trim());

    // 关闭弹框
    setRejectModalVisible(false);
    // 重置状态
    setRejectReason('');
    setCurrentHotel(null);
  };

  // 处理不通过原因取消
  const handleRejectCancel = () => {
    // 关闭弹框
    setRejectModalVisible(false);
    // 重置状态
    setRejectReason('');
    setCurrentHotel(null);
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

  // 处理下线酒店
  const handleOfflineHotel = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认下线',
      content: '您确定要将这家酒店下线吗？',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          if (onAuditHotel) {
            onAuditHotel(hotel, 'offline');
          }
        }
      }
    });
  };

  // 处理恢复酒店
  const handleRecoverHotel = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认恢复',
      content: '您确定要将这家酒店恢复上线吗？',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          if (onRecoverHotel) {
            onRecoverHotel(hotel);
          }
        }
      }
    });
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
    <View className={`admin-content-hotelaudit ${!activeTab ? 'admin-content-hotelaudit-move' : ''}`}>

      <View className='admin-content-circle' >
        <View className='admin-content-line'></View>
      </View>
      <View className='admin-content-circle circle1'>
        <View className='admin-content-line'></View>
      </View>
      <View className='admin-content'>
        {/* 筛选器 */}
        <View className='admin-filter-container'>
          <View className={`admin-filter-item ${filter === 'all' ? 'admin-filter-item-active' : ''}`} onClick={() => setFilter('all')}>
            <Text>全部</Text>
          </View>
          <View className={`admin-filter-item ${filter === 'pending' ? 'admin-filter-item-active' : ''}`} onClick={() => setFilter('pending')}>
            <Text>待审核</Text>
          </View>
          <View className={`admin-filter-item ${filter === 'approved' ? 'admin-filter-item-active' : ''}`} onClick={() => setFilter('approved')}>
            <Text>已发布</Text>
          </View>
          <View className={`admin-filter-item ${filter === 'rejected' ? 'admin-filter-item-active' : ''}`} onClick={() => setFilter('rejected')}>
            <Text>未通过</Text>
          </View>
          <View className={`admin-filter-item ${filter === 'offline' ? 'admin-filter-item-active' : ''}`} onClick={() => setFilter('offline')}>
            <Text>已下线</Text>
          </View>
        </View>

        <View className='admin-hotelList'>
          {loading ? (
            <View className='empty-state'>
              <Text className='empty-text'>加载中...</Text>
            </View>
          ) : filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => (
              <View
                className={`admin-hotelList-item ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
                key={hotel.id}
              >
                <Image
                  className='admin-hotelList-item-img'
                  src={hotel.message?.image || 'https://ts3.tc.mm.bing.net/th/id/OIP-C.UyfvxlTYy6MeyKcEOWV0hwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3'}
                />
                <View className='admin-hotelList-item-text'>
                  <View className='admin-hotelList-item-name'>
                    <Text className='admin-hotelList-item-name-text'>{hotel.message?.name || '未知酒店'}</Text>
                    <View className='admin-hotelList-item-tag'>
                      {Array.from({ length: hotel.message?.star || 0 }, (_, j) => j).map((j) => (
                        <Image className='admin-hotelList-item-tag-img' key={j} src={tagImage} />
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
                    {hotel.status === '待审核' && (
                      <View className='hotel-operation-item' onClick={(e) => handleAuditHotelClick(e, hotel)} style={{ color: '#ffcf24' }}>
                        <text className='iconfont icon-shenhe icon' ></text>
                        &nbsp;&nbsp;审核
                      </View>
                    )}
                    {hotel.status === '未通过' && (
                      <View className='hotel-operation-item' onClick={(e) => handleViewRejectReason(e, hotel)} style={{ color: '#ff5900' }}>
                        <text className='iconfont icon-yuanyin icon' ></text>
                        &nbsp;&nbsp;原因
                      </View>
                    )}
                    {hotel.status === '已发布' && (
                      <View className='hotel-operation-item offline' onClick={(e) => handleOfflineHotel(e, hotel)}>
                        <text className='iconfont icon-xiaxian icon'></text>
                        &nbsp;&nbsp;下线
                      </View>
                    )}
                    {hotel.status === '已下线' && (
                      <View className='hotel-operation-item recover' onClick={(e) => handleRecoverHotel(e, hotel)}>
                        <text className='iconfont icon-huifu icon'></text>
                        &nbsp;&nbsp;恢复
                      </View>
                    )}
                  </View>
                  <View className={`hotel-state ${getStatusClass(hotel.status)}`}>
                    {getStatusText(hotel.status)}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='empty-state'>
              <Text className='empty-text'>暂无酒店</Text>
            </View>
          )}
        </View>
        <View className='admin-hotel-show'>
          {selectedHotel ? (
            <HotelPreview hotelData={selectedHotel} />
          ) : (
            <View className='no-selection'>
              <Text className='no-selection-text'>请选择酒店查看</Text>
            </View>
          )}
        </View>
      </View>

      {rejectModalVisible && (
        <View
          className='modalOverlay'
          onClick={handleRejectCancel}
        >
          <View
            className='modalContent'
            onClick={(e) => e.stopPropagation()}
          >
            <View className='modalTitle'>审核不通过</View>

            <View className='modalLabel'>
              请输入不通过原因（必填）：
            </View>

            <View className='textareaContainer'>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder='例如：酒店信息不完整、图片质量差等'
                className='textarea'
                autoFocus
              />
            </View>

            <View className='buttonGroup'>
              <Button
                type='default'
                size='default'
                className='buttonBase buttonDefault'
                onClick={handleRejectCancel}
              >
                取消
              </Button>
              <Button
                type='primary'
                size='default'
                className='buttonBase buttonPrimary'
                onClick={handleRejectSubmit}
              >
                提交
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
