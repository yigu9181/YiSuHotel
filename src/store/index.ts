import { configureStore } from '@reduxjs/toolkit'
import chooseDateReducer from './date/chooseDate'
import hotelLabelReducer from './label/hotelLabel'
import addressReducer from './address/positionAddress'
import chooseHotelReducer from './hotel/chooseHotel'


export const store = configureStore({
  reducer: {
    chooseDate: chooseDateReducer,
    hotelLabel: hotelLabelReducer,
    address: addressReducer,
    chooseHotel: chooseHotelReducer,
  },
  // Taro 开发环境开启 Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
})

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
