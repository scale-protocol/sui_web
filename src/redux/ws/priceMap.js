import { createSlice } from '@reduxjs/toolkit';

const priceMapSlice = createSlice({
  name: 'priceMap',
  initialState: {
    value: ''
  },
  reducers: {
    setPriceMap (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setPriceMap } = priceMapSlice.actions;
export default priceMapSlice.reducer;