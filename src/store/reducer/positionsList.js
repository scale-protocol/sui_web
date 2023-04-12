import { combineReducers } from '@reduxjs/toolkit';
import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'

const activePositions = (state = [], action) => {
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

const wsPositionUpdateData = (state = null, action) => {
  switch (action.type) {
    case 'SET_WS_POSITION_UPDAT': 
    return {
      ...state,
      [action.wsData.id]: keepDecimal2((new BigNumber(action.wsData.profit).times(formatTenDecimalNum(-6))).toString(10))
    }

    default: 
      return state
  }
}

const positionsModule = combineReducers({ activePositions, historyPositions, wsPositionUpdateData })
export default positionsModule