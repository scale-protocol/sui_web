import { combineReducers } from '@reduxjs/toolkit';
import priceMap from './priceMap';

const accountReducer = combineReducers({
  priceMap
});

export default accountReducer;