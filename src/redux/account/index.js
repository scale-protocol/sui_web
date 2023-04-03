import { combineReducers } from '@reduxjs/toolkit';
import account from './account';
import address from './address';
import wallet from './wallet';
import provider from './provider';
import balanceList from './balanceList';

const accountReducer = combineReducers({
  account,
  address,
  wallet,
  provider,
  balanceList,
});

export default accountReducer;