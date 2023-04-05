import { combineReducers } from '@reduxjs/toolkit';
// import { formatTenDecimalNum, keepDecimal2, formatAddress } from './../../utils/filter'
// import BigNumber from 'bignumber.js'

const activePositions = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_POSITIONS':
      return action.activePositions

    default:
      return state
  }
}


const historyPositions = (state = null, action) => {
  switch (action.type) {
    case 'SET_HISTORY_POSITIONS':
      return action.historyPositions

    default:
      return state
  }
}


const positionsModule = combineReducers({ activePositions, historyPositions })
export default positionsModule