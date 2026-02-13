import { Map, View, CoverView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedAddress } from '../../../store/address/positionAddress'
import './position.scss'

interface Marker {
  id: number
  latitude: number
  longitude: number
  title: string
  address: string
  width?: number
  height?: number
}

interface LocationInfo {
  latitude: number
  longitude: number
  address: string
  name: string
  province: string
  city: string
  district: string
  street: string
  streetNumber: string
}

export default function PositionMap() {
  const dispatch = useDispatch()
  // 将默认地址设为上海市普陀区
  const [location, setLocation] = useState({ latitude: 31.23, longitude: 121.43 })
  const [marker, setMarker] = useState<Marker | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const mapRef = useRef<any>(null)

  // 高德地图 Key
  const GAODE_KEY = '3ff4c9df785c0c484a0303c44a53fe3f'

  useEffect(() => {
    mapRef.current = Taro.createMapContext('myMap')
    getCurrentLocation()
  }, [])

  const getCurrentLocation = async () => {
    try {
      const res = await Taro.getLocation({
        type: 'gcj02',
        isHighAccuracy: true
      })

      // 验证定位结果是否合理
      if (res.latitude && res.longitude) {
        setLocation({
          latitude: res.latitude,
          longitude: res.longitude
        })
      } else {
        // 定位结果不合理，使用默认的上海普陀区位置
        console.log('定位结果不合理，使用默认位置');
        setLocation({ latitude: 31.23, longitude: 121.43 });
      }

      // 移除 moveToLocation 调用
    } catch (err) {
      console.error('定位失败:', err);
      // 定位失败时，使用默认的上海普陀区位置
      setLocation({ latitude: 31.23, longitude: 121.43 });
    }
  }

  // 点击地图获取地址
  const onMapTap = async (e: any) => {
    const { latitude, longitude } = e.detail

    console.log('点击坐标:', latitude, longitude)

    setLoading(true)

    try {
      const requestData = {
        key: GAODE_KEY,
        location: `${longitude},${latitude}`,
        extensions: 'all',
        radius: 1000,
        output: 'JSON'
      }
      console.log('请求参数:', requestData)

      const res = await Taro.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: requestData,
        method: 'GET',
        timeout: 10000,
        header: {
          'Content-Type': 'application/json'
        }
      })

      console.log('返回数据:', res.data)

      if (!res.data) {
        throw new Error('返回数据为空')
      }

      if (res.data.status !== '1') {
        throw new Error(res.data.info || `错误码: ${res.data.status}`)
      }

      const regeocode = res.data.regeocode
      const addressComponent = regeocode.addressComponent

      // 处理 addressComponent 可能是数组的情况
      const component = Array.isArray(addressComponent) ? addressComponent[0] : addressComponent

      const formattedAddress = regeocode.formatted_address

      console.log('解析成功:', formattedAddress)

      // 确保字段是字符串
      const getStringValue = (data: any): string => {
        if (!data) return ''
        if (typeof data === 'string') return data
        if (typeof data === 'number') return data.toString()
        if (Array.isArray(data)) {
          // 如果是数组，返回第一个元素或空字符串
          return data.length > 0 ? getStringValue(data[0]) : ''
        }
        if (data.street) return data.street
        if (data.number) return data.number
        return JSON.stringify(data)
      }

      const streetString = getStringValue(component?.street)

      // 创建新标记 - 同时添加 lat/lng 和 latitude/longitude 以兼容不同 API
      const newMarker: any = {
        id: Date.now(),
        latitude,
        longitude,
        lat: latitude,  // 添加 lat 属性以兼容腾讯地图 API
        lng: longitude, // 添加 lng 属性以兼容腾讯地图 API
        title: streetString || '选中位置',
        address: formattedAddress,
        width: 40,
        height: 40
      }

      console.log('准备设置marker和locationInfo')
      
      // 提取地点信息 - 截取区后面的内容
      const extractLocation = (fullAddress: string, district: string): string => {
        if (!fullAddress || !district) return '';
        
        const districtIndex = fullAddress.indexOf(district);
        if (districtIndex === -1) return fullAddress;
        
        // 截取区后面的内容
        return fullAddress.substring(districtIndex + district.length).trim();
      };
      
      const locationName = extractLocation(formattedAddress, component?.district || '');

      // 先设置 locationInfo - 确保数据完整且所有字段都是字符串
      const newLocationInfo: LocationInfo = {
        latitude,
        longitude,
        address: getStringValue(formattedAddress),
        name: getStringValue(locationName || regeocode.pois?.[0]?.name || streetString || '未知位置'),
        province: getStringValue(component?.province || ''),
        city: getStringValue(component?.city || ''),
        district: getStringValue(component?.district || ''),
        street: streetString,
        streetNumber: getStringValue(component?.streetNumber || component?.number || '')
      }

      console.log('设置 locationInfo:', newLocationInfo)
      setLocationInfo(newLocationInfo)
      
      // 再设置 marker
      console.log('设置 marker:', newMarker)
      setMarker(newMarker)
      
      console.log('marker和locationInfo设置完成')

      // 移除 moveToLocation 调用
      console.log('准备进入finally块')

    } catch (err: any) {
      console.error('获取地址失败:', err)

      const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

      setMarker({
        id: Date.now(),
        latitude,
        longitude,
        lat: latitude,  // 添加 lat 属性以兼容腾讯地图 API
        lng: longitude, // 添加 lng 属性以兼容腾讯地图 API
        title: '选中位置',
        address: fallbackAddress,
        width: 40,
        height: 40
      })

      setLocationInfo({
        latitude,
        longitude,
        address: fallbackAddress,
        name: '未知位置',
        province: '',
        city: '',
        district: '',
        street: '',
        streetNumber: ''
      })

      Taro.showToast({
        title: err.message || '地址解析失败',
        icon: 'none',
        duration: 3000
      })
    } finally {
      console.log('进入finally块，设置loading为false')
      setLoading(false)
      console.log('设置loading为false完成')
    }
  }

  // 取消操作 - 移除标记点
  const handleCancel = () => {
    setMarker(null)
    setLocationInfo(null)
  }

  // 确认操作 - 返回首页并存储地址信息到Redux
  const handleConfirm = () => {
    if (locationInfo) {
      // 存储地址信息到Redux
      dispatch(setSelectedAddress(locationInfo))
      console.log('确认选择的地址并存储到Redux:', locationInfo)
      
      // 返回首页
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }
  }

  // 重新定位
  const relocate = () => {
    getCurrentLocation()
  }

  return (
    <View className='map-container'>
      <Map
        id='myMap'
        latitude={location.latitude}
        longitude={location.longitude}
        scale={16}
        showLocation
        markers={marker ? [{
          ...marker,
          // 确保标记格式正确，避免 lat/lng 错误
          iconPath: 'https://cdn.example.com/marker.png' // 添加默认图标路径
        }] : []}
        style={{ width: '100%', height: '100vh' }}
        onTap={onMapTap}
      />

      {/* 重新定位按钮 */}
      <CoverView className='locate-btn' onClick={relocate}>
        <CoverView className='locate-icon'>📍</CoverView>
      </CoverView>

      {/* 加载中 */}
      {loading && (
        <CoverView className='loading-mask'>
          <CoverView className='loading-text'>获取地址中...</CoverView>
        </CoverView>
      )}

      {/* 地址信息弹出框 */}
      {locationInfo && !loading && (
        <CoverView className='popup-container'>
          <CoverView className='popup-content'>
            <CoverView className='popup-header'>
              <CoverView className='popup-title'>位置信息</CoverView>
            </CoverView>

            <CoverView className='popup-body'>
              <CoverView className='address-row'>
                <CoverView className='address-label'>详细地址</CoverView>
                <CoverView className='address-value'>{locationInfo.address}</CoverView>
              </CoverView>

              <CoverView className='address-row'>
                <CoverView className='address-label'>省 / 市 / 区</CoverView>
                <CoverView className='address-value'>
                  {locationInfo.province || ''} {locationInfo.city || ''} {locationInfo.district || ''}
                </CoverView>
              </CoverView>

              <CoverView className='address-row'>
                <CoverView className='address-label'>地点</CoverView>
                <CoverView className='address-value'>
                  {locationInfo.name || ''} 
                </CoverView>
              </CoverView>
            </CoverView>

            <CoverView className='popup-footer'>
              <CoverView className='btn-cancel' onClick={handleCancel}>取消</CoverView>
              <CoverView className='btn-confirm' onClick={handleConfirm}>确认</CoverView>
            </CoverView>
          </CoverView>
        </CoverView>
      )}

      {/* 提示文字 */}
      {!locationInfo && !loading && (
        <CoverView className='tip-text'>
          点击地图任意位置获取地址
        </CoverView>
      )}
    </View>
  )
}