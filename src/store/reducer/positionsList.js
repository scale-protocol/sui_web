import { combineReducers } from '@reduxjs/toolkit';
import { formatTenDecimalNum, keepDecimal2, formatAddress } from './../../utils/filter'
import BigNumber from 'bignumber.js'

const activePositions = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_POSITIONS':
      action.activePositions.forEach(v => {
        v.margin = keepDecimal2((new BigNumber(v.margin).times(formatTenDecimalNum(-6))).toString(10))
        v.open_price = keepDecimal2((new BigNumber(v.open_price).times(formatTenDecimalNum(-6))).toString(10))
        v.lot = ((new BigNumber(v.open_price).times(formatTenDecimalNum(-4))).toString(10))
        v.leverageFormat = v.leverage + 'X'
        v.formatID = formatAddress(v.id)
      })
      return action.activePositions

    default:
      return state
  }
}


const historyPositions = (state = null, action) => {
  switch (action.type) {
    case 'SET_HISTORY_POSITIONS':
      action.historyPositions.forEach(v => {
        v.formatID = formatAddress(v.id)
        v.close_price = keepDecimal2((new BigNumber(v.close_price).times(formatTenDecimalNum(-6))).toString(10))
        v.profit =  keepDecimal2((new BigNumber(v.profit).times(formatTenDecimalNum(-6))).toString(10))
        v.lot = ((new BigNumber(v.open_price).times(formatTenDecimalNum(-4))).toString(10))
        v.leverageFormat = v.leverage + 'X'
      })
      return action.historyPositions

    default:
      return state
  }
}


const positionsModule = combineReducers({ activePositions, historyPositions })
export default positionsModule