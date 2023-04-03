import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    value: ''
  },
  reducers: {
    setAccount (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;