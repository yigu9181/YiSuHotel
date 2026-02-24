import { View, Text, Image } from '@tarojs/components'
import { useEffect,useState } from 'react'
import Taro from '@tarojs/taro'
import HotelAudit from '@/components/managerPage/hotelAudit/hotelAudit'
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
  const [refreshKey, setRefreshKey] = useState(0) // 用于触发酒店列表刷新
  
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
  const handleAuditHotel = async (hotel, action, reason) => {
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

    try {
      // 调用API更新酒店状态
      const response = await Taro.request({
        url: `http://localhost:3000/hotels/${hotel.id}`,
        method: 'PUT',
        data: {
          ...hotel,
          status: newStatus,
          rejectReason: reason || ''
        }
      });

      if (response.statusCode === 200) {
        // 审核成功
        console.log(`${actionText}酒店:`, hotel.id);
        console.log('新状态:', newStatus);
        if (reason) {
          console.log('不通过原因:', reason);
        }

        Taro.showToast({
          title: `${actionText}成功`,
          icon: 'success'
        });

        // 重新获取酒店列表
        // 通过更新refreshKey来触发HotelAudit组件重新加载数据
        setRefreshKey(prev => prev + 1);
        // 同时更新selectedHotel以反映最新状态
        setSelectedHotel({...hotel, status: newStatus, rejectReason: reason || ''});
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('审核操作失败:', error);
      Taro.showToast({
        title: `${actionText}失败`,
        icon: 'none'
      });
    }
  };

  // 处理恢复酒店
  const handleRecoverHotel = async (hotel) => {
    Taro.showModal({
      title: '确认恢复',
      content: '您确定要恢复这家酒店吗？',
      confirmText: '确定',
      confirmColor: '#3690f7',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用API恢复酒店
            const response = await Taro.request({
              url: `http://localhost:3000/hotels/${hotel.id}`,
              method: 'PUT',
              data: {
                ...hotel,
                status: '已发布'
              }
            });

            if (response.statusCode === 200) {
              console.log('恢复酒店:', hotel.id);

              // 恢复成功
              Taro.showToast({
                title: '恢复成功',
                icon: 'success'
              });

              // 重新获取酒店列表
              // 通过更新refreshKey来触发HotelAudit组件重新加载数据
              setRefreshKey(prev => prev + 1);
              // 同时更新selectedHotel以反映最新状态
              setSelectedHotel({...hotel, status: '已发布'});
            } else {
              throw new Error('更新失败');
            }
          } catch (error) {
            console.error('恢复操作失败:', error);
            Taro.showToast({
              title: '恢复失败',
              icon: 'none'
            });
          }
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
      <HotelAudit activeTab={activeTab} userInfo={userInfo} onHotelSelect={handleHotelSelect} selectedHotel={selectedHotel} onAuditHotel={handleAuditHotel} onRecoverHotel={handleRecoverHotel} refreshKey={refreshKey} />
   </View>
 )
}
