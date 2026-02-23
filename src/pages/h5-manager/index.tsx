import { View, Text, Image } from '@tarojs/components'
import { useEffect,useState } from 'react'
import Taro from '@tarojs/taro'
import HotelAudit from '../../components/adminPage/hotelAudit/hotelAudit'
import './index.scss'

export default function Index () {
  const [userInfo, setUserInfo] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  // 检查是否有 token 且身份符合，如果不符合则跳转到登录页
  useEffect(() => {
    console.log('Checking for token in user page...')
    const token = Taro.getStorageSync('token')
    const info = Taro.getStorageSync('userInfo')
    console.log('Token found:', token)
    console.log('User info found:', info)

    if (!token || !info) {
      console.log('No token or user info, redirecting to login...')
      Taro.redirectTo({ url: '/pages/h5-login/index' })
      return
    }

    setUserInfo(info)
    console.log('User role:', info.role)
    // 验证身份是否符合，管理员页只能管理员访问
    if (info.role !== '管理员') {
      console.log('Role not matched, redirecting to login...')
      Taro.redirectTo({ url: '/pages/h5-login/index' })
    }
  }, [])
  const [activeTab, setActiveTab] = useState(true)
   const handleLogout = () => {
      Taro.showModal({
        title: '确认退出',
        content: '您确定要退出登录吗？',
        confirmText: '退出',
        confirmColor: '#3690f7',
        success: (res) => {
          if (res.confirm) {
            // 清除token
            Taro.removeStorageSync('token');
            // 跳转到登录页
            Taro.navigateTo({
              url: '/pages/h5-login/index'
            });
          }
        }
      });
    };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  // 处理审核酒店
  const handleAuditHotel = (hotel, action, reason) => {
    let actionText = '';
    let newStatus = '';

    switch (action) {
      case 'approve':
        actionText = '通过';
        newStatus = '已发布';
        break;
      case 'reject':
        actionText = '不通过';
        newStatus = '未通过';
        break;
      case 'offline':
        actionText = '下线';
        newStatus = '已下线';
        break;
      default:
        return;
    }

    // 这里应该调用API进行审核操作
    console.log(`${actionText}酒店:`, hotel.id);
    console.log('新状态:', newStatus);
    if (reason) {
      console.log('不通过原因:', reason);
    }

    // 模拟审核成功
    Taro.showToast({
      title: `${actionText}成功`,
      icon: 'success'
    });

    // 重新获取酒店列表
    // 这里应该刷新酒店列表
  };

  // 处理恢复酒店
  const handleRecoverHotel = (hotel) => {
    Taro.showModal({
      title: '确认恢复',
      content: '您确定要恢复这家酒店吗？',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 这里应该调用API恢复酒店
          console.log('恢复酒店:', hotel.id);

          // 模拟恢复成功
          Taro.showToast({
            title: '恢复成功',
            icon: 'success'
          });

          // 重新获取酒店列表
          // 这里应该刷新酒店列表
        }
      }
    });
  };
 return(
   <View className='user-page'>
      <View className='user-nav-tab'>
        <View className={`user-nav-tab-text my-hotel ${activeTab ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(true);
          }}
        >
          <Text className='iconfont  icon-jiudian1 icon'></Text>
          酒店审核
        </View>
       <View className='user-nav-tab-text name'><Text className='iconfont icon-yonghu icon'></Text>用户名：{userInfo?.username || 'hhhc123'}</View>
       <View className='user-nav-tab-text logout' onClick={handleLogout}>退出登录</View>
      </View>
      <HotelAudit activeTab={activeTab} userInfo={userInfo} onHotelSelect={handleHotelSelect} selectedHotel={selectedHotel} onAuditHotel={handleAuditHotel} onRecoverHotel={handleRecoverHotel} />
   </View>
 )
}
