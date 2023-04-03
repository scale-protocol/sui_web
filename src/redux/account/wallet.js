import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    value: ''
  },
  reducers: {
    setWallet (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setWallet } = walletSlice.actions;
export default walletSlice.reducer;