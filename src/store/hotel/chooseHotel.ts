import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const chooseHotelStore = createSlice({
  name: 'chooseHotel',
  initialState: {
    hotelId: 0
  },
  reducers: {
    setChooseHotel(state, action: PayloadAction<{ hotelId: number }>) {
      state.hotelId = action.payload.hotelId
    }
  }
})
const { setChooseHotel } = chooseHotelStore.actions
export { setChooseHotel }
export default chooseHotelStore.reducer
