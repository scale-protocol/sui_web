import { createSlice } from '@reduxjs/toolkit';

const balanceListSlice = createSlice({
  name: 'balanceList',
  initialState: {
    value: []
  },
  reducers: {
    setBalanceList (state, {payload}) {
      state.value = payload
    }
  }
});

export const { setBalanceList } = balanceListSlice.actions;
export default balanceListSlice.reducer;