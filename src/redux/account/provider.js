import { createSlice } from '@reduxjs/toolkit';

const providerSlice = createSlice({
  name: 'provider',
  initialState: {
    value: ''
  },
  reducers: {
    setProvider (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setProvider } = providerSlice.actions;
export default providerSlice.reducer;