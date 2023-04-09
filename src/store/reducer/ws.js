import { combineReducers } from '@reduxjs/toolkit';
import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'

import market from './market'
console.log('market', market)
// const initialState = {
  
// }
const wsPrice = (state = null, action) => {
  switch (action.type) {
    case 'SET_PRICE_MAP': 
      return {
        ...state,
        [action.priceMap.symbol]: {
          ...action.priceMap,
          "change_rate": keepDecimal2((new BigNumber(action.priceMap.change_rate).times(formatTenDecimalNum(2))).toString(10)),
          "change": keepDecimal2((new BigNumber(action.priceMap.change).times(formatTenDecimalNum(-6))).toString(10)),
          "high_24h": new BigNumber(keepDecimal2((new BigNumber(action.priceMap.high_24h).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
          "low_24h": new BigNumber(keepDecimal2((new BigNumber(action.priceMap.low_24h).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
          "current_price": keepDecimal2((new BigNumber(action.priceMap.current_price).times(formatTenDecimalNum(-6))).toString(10)),
          "current_price_format": new BigNumber(keepDecimal2((new BigNumber(action.priceMap.current_price).times(formatTenDecimalNum(-6))).toString(10))).toFormat()
        }
      }

    default: 
      return state
  }
}

const wsModule = combineReducers({ wsPrice })
export default wsModule