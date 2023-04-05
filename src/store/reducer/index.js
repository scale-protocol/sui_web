import { combineReducers } from '@reduxjs/toolkit';
import accountModule from './account'
import activeTradePair from './activetradepair'
import userInfo from './userinfo'
import wsModule from './ws'
import positionsModule from './positionsList'

export default combineReducers({
  accountModule,
  activeTradePair,
  userInfo,
  wsModule,
  positionsModule
})