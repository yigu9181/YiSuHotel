import { useState, useMemo  } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { View } from '@tarojs/components'
import { Calendar } from '@taroify/core'
import Taro from '@tarojs/taro'
import "@taroify/core/calendar/style"

import { setChooseDate } from '@/store/date/chooseDate'
import './calendar.scss'

export default function CalendarPage() {
  const { startDate, endDate } = useSelector((state: any) => state.chooseDate)
  const [dateRange, setDateRange] = useState<Date[]>([])
    useMemo(() => {
      if (startDate && endDate) {
        setDateRange([new Date(startDate), new Date(endDate)])
      }
    }, [startDate, endDate])
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
  }

  // 计算两个月的日期范围
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDate = today.getDate()

    // 当前月1号
    const min = new Date(currentYear, currentMonth, currentDate)

    // 两个月后（当前月 + 2）
    const max = new Date(currentYear, currentMonth + 2, currentDate)

    return { minDate: min, maxDate: max }
  }, [])
  const dispatch = useDispatch()
  const setDate = (payload: { startDate: string, endDate: string }) => {
    dispatch(setChooseDate(payload))
  }
  const dayFormatter = (day: any) => {
    if (!day.value) {
      return day
    }
    if (day.type === "start") {
      day.bottom = "入住"
    } else if (day.type === "end") {
      day.bottom = "退房"
    } else if (day.type === "active") {
      day.bottom = "入住/退房"
    }
    return day
  }

  return (
    <View className='calendar-container'>
      <View className='calendar-body'>
        <Calendar
          style={{ height: "96vh" }}
          type='range'
          defaultValue={dateRange}
          min={minDate}      // 限制开始日期
          max={maxDate}      // 限制结束日期（只显示两个月）
          onConfirm={(value) => {
            const selectedDates = value as Date[]
            if (selectedDates.length === 2) {
              setDate({ startDate: formatDate(selectedDates[0]), endDate: formatDate(selectedDates[1]) })
              Taro.redirectTo({
                url: '/pages/index/index'
              })
            }
          }}
          title='选择入住时间'
          formatter={dayFormatter}
          confirmDisabledText='请选择退房时间'
        />
      </View>
    </View>
  )
}
