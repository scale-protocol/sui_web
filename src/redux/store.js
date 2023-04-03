import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from './reducers/counter';
// import addressSlice from './reducers/address';
// import accountSlice from './reducers/account';
import accountReducer from './account/index';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    // address: addressSlice,
    // account: accountSlice,
    account: accountReducer
  }
})