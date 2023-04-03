import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'
const ws = (state = null, action) => {
  // console.log('action',action)
  switch (action.type) {
    case 'SET_PRICE_MAP': 
      // console.log('action.priceMap', action)
      const wsmsg = JSON.parse(action.priceMap)
      const wsData = JSON.parse(action.priceMap).data
      if (wsmsg.event === 'price_update') {
        return {
          "change_rate": wsData.change_rate,
          "change": keepDecimal2((new BigNumber(wsData.change).times(formatTenDecimalNum(-6))).toString(10)),
          "high_24h": keepDecimal2((new BigNumber(wsData.high_24h).times(formatTenDecimalNum(-6))).toString(10)),
          "low_24h": keepDecimal2((new BigNumber(wsData.low_24h).times(formatTenDecimalNum(-6))).toString(10)),
          "current_price": keepDecimal2((new BigNumber(wsData.current_price).times(formatTenDecimalNum(-6))).toString(10))
        }
      }
      return action.priceMap

    default: 
      return state
  }
}

export default ws