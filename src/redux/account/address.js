import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    value: ''
  },
  reducers: {
    setAddress (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setAddress } = addressSlice.actions;
export default addressSlice.reducer;