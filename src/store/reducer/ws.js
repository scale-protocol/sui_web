import { combineReducers } from '@reduxjs/toolkit';
import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'
const wsPrice = (state = null, action) => {
  switch (action.type) {
    case 'SET_PRICE_MAP': 
      const wsData = action.priceMap || {}
      return {
        "change_rate": keepDecimal2((new BigNumber(wsData.change_rate).times(formatTenDecimalNum(2))).toString(10)),
        "change": keepDecimal2((new BigNumber(wsData.change).times(formatTenDecimalNum(-6))).toString(10)),
        "high_24h": new BigNumber(keepDecimal2((new BigNumber(wsData.high_24h).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
        "low_24h": new BigNumber(keepDecimal2((new BigNumber(wsData.low_24h).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
        "current_price": keepDecimal2((new BigNumber(wsData.current_price).times(formatTenDecimalNum(-6))).toString(10)),
        "current_price_format": new BigNumber(keepDecimal2((new BigNumber(wsData.current_price).times(formatTenDecimalNum(-6))).toString(10))).toFormat()
      }

    default: 
      return state
  }
}

// const wsAccount = (state = null, action) => {
//   // console.log('action',action)
//   switch (action.type) {
//     case 'SET_PRICE_MAP': 
//       const wsmsg = JSON.parse(action.priceMap)
//       const wsData = JSON.parse(action.priceMap).data
//       if (wsmsg.event === 'price_update') {
//         return {
//           "change_rate": wsData.change_rate,
//           "change": keepDecimal2((new BigNumber(wsData.change).times(formatTenDecimalNum(-6))).toString(10)),
//           "high_24h": keepDecimal2((new BigNumber(wsData.high_24h).times(formatTenDecimalNum(-6))).toString(10)),
//           "low_24h": keepDecimal2((new BigNumber(wsData.low_24h).times(formatTenDecimalNum(-6))).toString(10)),
//           "current_price": keepDecimal2((new BigNumber(wsData.current_price).times(formatTenDecimalNum(-6))).toString(10))
//         }
//       }
//       return action.priceMap

//     default: 
//       return state
//   }
// }


const wsModule = combineReducers({ wsPrice })
export default wsModule