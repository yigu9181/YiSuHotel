import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const chooseDateStore = createSlice({
  name: 'chooseDate',
  initialState: {
    startDate:  null,
    endDate: null
  },
  reducers: {
    setChooseDate(state, action: PayloadAction<{ startDate: string, endDate: string}>) {
      state.startDate = action.payload.startDate
      state.endDate = action.payload.endDate
    }
  }
})
const { setChooseDate } = chooseDateStore.actions
export { setChooseDate }
export default chooseDateStore.reducer
