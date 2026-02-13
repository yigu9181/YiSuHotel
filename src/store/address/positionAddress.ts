import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

interface AddressState {
  selectedAddress: LocationInfo | null
}

const initialState: AddressState = {
  selectedAddress: null
}

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<LocationInfo>) => {
      state.selectedAddress = action.payload
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null
    }
  }
})

export const { setSelectedAddress, clearSelectedAddress } = addressSlice.actions

export default addressSlice.reducer
