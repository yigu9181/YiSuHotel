import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const hotelLabelStore = createSlice({
  name: 'hotelLabel',
  initialState: {
    priceRange: '',
    hotelStar:'',
    Labels: [] as string[]
  },
  reducers: {
    setHotelLabel(state, action: PayloadAction<{ priceRange: string, hotelStar: string, Labels: string[] }>) {
      state.priceRange = action.payload.priceRange
      state.hotelStar = action.payload.hotelStar
      state.Labels = action.payload.Labels
    }
  }
})
const { setHotelLabel } = hotelLabelStore.actions
export { setHotelLabel }
export default hotelLabelStore.reducer
