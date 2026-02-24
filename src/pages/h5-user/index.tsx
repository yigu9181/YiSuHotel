import { View, Text, Image } from '@tarojs/components'
import { useEffect,useState } from 'react'
import Taro from '@tarojs/taro'
import AddHotel from '../../components/userPage/addHotel/addHotel'
import MyHotel from '../../components/userPage/myHotel/myHotel'
import './index.scss'

export default function Index () {
  const [userInfo, setUserInfo] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [editHotel, setEditHotel] = useState(null)
  const [submitMode, setSubmitMode] = useState('submit') // submit: 提交新酒店, update: 更新现有酒店
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
    // 验证身份是否符合，用户页只能用户访问
    if (info.role !== '用户') {
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

  // 处理编辑酒店
  const handleEditHotel = (hotel) => {
    setEditHotel(hotel);
    setSubmitMode('update'); // 设置为更新模式
    setActiveTab(false); // 切换到编辑酒店标签页
  };

  // 处理删除酒店
  const handleDeleteHotel = (hotel) => {
    Taro.showModal({
      title: '确认删除',
      content: '您确定要删除这家酒店吗？此操作不可恢复。',
      confirmText: '确定删除',
      confirmColor: '#ff4d4f',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 要求用户输入账户密码
          Taro.showModal({
            title: '验证身份',
            content: '请输入您的账户密码以确认删除操作。',
            editable: true,
            placeholderText: '请输入密码',
            success: (passRes) => {
              if (passRes.confirm && passRes.content === userInfo?.password) {
                // 密码正确，执行删除操作
                console.log('删除酒店:', hotel.id);
                // 这里应该调用API删除酒店
                // 模拟删除成功
                Taro.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                // 重新获取酒店列表
                // 这里应该刷新酒店列表
              } else {
                // 密码错误
                Taro.showToast({
                  title: '密码错误，删除失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      }
    });
  };
 return(
   <View className='user-page'>
      <View className='user-nav-tab'>
        <View className={`user-nav-tab-text my-hotel ${activeTab ? 'active' : ''}`}
          onClick={() => {
            if (!activeTab) {
              Taro.showModal({
                title: '确认切换',
                content: '切换到我的酒店后，当前编辑的内容将不会保存，确定要切换吗？',
                confirmText: '确定',
                confirmColor: '#3690f7',
                cancelText: '取消',
                success: (res) => {
                  if (res.confirm) {
                    setActiveTab(true);
                    setEditHotel(null);
                    setSubmitMode('submit');
                  }
                }
              });
            } else {
              setActiveTab(true);
            }
          }}
        >
          <Text className='iconfont  icon-jiudian1 icon'></Text>
          我的酒店
        </View>
        <View className={`user-nav-tab-text add-hotel ${!activeTab ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(false);


            setSubmitMode('submit');
          }}
        >
          <Text className='iconfont icon-jia icon'></Text>
          编辑酒店
        </View>
       <View className='user-nav-tab-text name'><Text className='iconfont icon-yonghu icon'></Text>用户名：{userInfo?.username || 'hhhc123'}</View>
       <View className='user-nav-tab-text logout' onClick={handleLogout}>退出登录</View>
      </View>
      <MyHotel activeTab={activeTab} userInfo={userInfo} onHotelSelect={handleHotelSelect} selectedHotel={selectedHotel} onEditHotel={handleEditHotel} onDeleteHotel={handleDeleteHotel} />
      <AddHotel activeTab={activeTab} userInfo={userInfo} editHotel={editHotel} submitMode={submitMode} />
   </View>
 )
}
