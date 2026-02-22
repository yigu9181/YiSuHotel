import { View, Text, Image } from '@tarojs/components'
import { useEffect,useState } from 'react'
import Taro from '@tarojs/taro'
import AddHotel from '../../components/userPage/addHotel/addHotel'
import MyHotel from '../../components/userPage/myHotel/myHotel'
import './index.scss'

export default function Index () {
  // 检查是否有 token 且身份符合，如果不符合则跳转到登录页
  useEffect(() => {
    console.log('Checking for token in user page...')
    const token = Taro.getStorageSync('token')
    const userInfo = Taro.getStorageSync('userInfo')
    console.log('Token found:', token)
    console.log('User info found:', userInfo)

    if (!token || !userInfo) {
      console.log('No token or user info, redirecting to login...')
      Taro.redirectTo({ url: '/pages/h5-login/index' })
      return
    }

    console.log('User role:', userInfo.role)
    // 验证身份是否符合，用户页只能用户访问
    if (userInfo.role !== '用户') {
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
 return(
   <View className='user-page'>
      <View className='user-nav-tab'>
        <View className={`user-nav-tab-text my-hotel ${activeTab ? 'active' : ''}`}
          onClick={() => setActiveTab(true)}
        >
          <Text className='iconfont  icon-jiudian1 icon'></Text>
          我的酒店
        </View>
        <View className={`user-nav-tab-text add-hotel ${!activeTab ? 'active' : ''}`}
          onClick={() => setActiveTab(false)}
        >
          <Text className='iconfont icon-jia icon'></Text>
          编辑酒店
        </View>
       <View className='user-nav-tab-text name'><Text className='iconfont icon-yonghu icon'></Text>用户名：hhhc123</View>
       <View className='user-nav-tab-text logout' onClick={handleLogout}>退出</View>
      </View>
      <MyHotel activeTab={activeTab} />
      <AddHotel activeTab={activeTab} />
   </View>
 )
}
