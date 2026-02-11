import { View, Text,Button,Input,Picker} from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import classNames from 'classnames'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('酒店查询页加载')
  })
  const [array] = useState(['上海', '北京', '广州', '深圳'])
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const onPickerChange = (e) => {
    setIndex(e.detail.value)
    setIsOpen(!isOpen)
  }
  const rotate=():void=>{
    setIsOpen(!isOpen)
  }
  return (
    <View className='index'>
      <View className='advertisement'></View>
      <View className='message'>
        <View className='pos-time'>
        <View className='position'>
          <Picker
            mode='selector'
            range={array}
            onChange={onPickerChange}
            onClick={rotate}
            onCancel={rotate}
          >
            <View className='picker'>
              {array[index]}
            </View>
            <Text className={classNames('iconfont', 'icon-jiantou-copy','arrow-up', {
            'arrow-down': isOpen
            })}
            />
          </Picker>
          <View className='input'>
            <Input placeholder='位置/品牌/酒店'></Input>
          </View>
          <View className='iconfont icon-dingwei icon'></View>
        </View>
        <View className='date'>
          <View className='check-in'>
            <Text className='check-in-date'>2月13日</Text>
            <Text className='check-in-week'>周五</Text>
          </View>
          <View className='decoration'></View>
          <View className='check-out'>
            <Text className='check-out-date'>2月14日</Text>
            <Text className='check-out-week'>周六</Text>
          </View>
          <View className='time-interval'>共1晚</View>
        </View>
        </View>
        <View className='fil-lab'>
        <Button className='search'>
          <Text>查询</Text>
        </Button>
        </View>
      </View>
    </View>
  )
}
