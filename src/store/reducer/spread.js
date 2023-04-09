import { combineReducers } from '@reduxjs/toolkit';
import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'

import market from './market'
console.log('market', market)
// const initialState = {
  
// }
const spreadMap = (state = null, action) => {
  switch (action.type) {
    case 'SET_SPREADMAP': 
      return {
        ...state,
        [action.spreadMap.id]: {
          ...action.spreadMap,
          spread: keepDecimal2((new BigNumber(action.spreadMap.spread).times(formatTenDecimalNum(-6))).toString(10))
        }
      }

    default: 
      return state
  }
}

const spreadModule = combineReducers({ spreadMap })
export default spreadModule