import BigNumber from 'bignumber.js'

import API from './../api/api'
import { setActivePositions, setHistoryPositions } from './../store/action'
import { formatTenDecimalNum, formatAddress, addPosNeg } from './filter'

export const getPositionsListFun = (tabActive, account, _dispatch) => {
  API.getAccountPositions(tabActive, account).then(result => {
    if (tabActive === 'active') {
      result.data && result.data.forEach(v => {
        v.point = v.symbol === 'Crypto.DOGE/USD' ? 6 : 2
        v.margin = new BigNumber(addPosNeg((new BigNumber(v.margin).times(formatTenDecimalNum(-6))).toString(10), false, v.point)).toFormat()
        v.open_price = new BigNumber(addPosNeg(new BigNumber(v.open_price).times(formatTenDecimalNum(-6)).toString(10), false, v.point)).toString(10)
        v.lot = ((new BigNumber(v.lot).times(formatTenDecimalNum(-4))).toString(10))
        v.leverageFormat = v.leverage + 'X'
        v.formatID = formatAddress(v.id)
        v.latest = null
      })
      _dispatch(setActivePositions(result.data))
    }
    if (tabActive === 'history') {
      result.data.forEach(v => {
        v.point = v.symbol === 'Crypto.DOGE/USD' ? 6 : 2
        v.formatID = formatAddress(v.id)
        v.close_price = new BigNumber(addPosNeg(new BigNumber(v.close_price).times(formatTenDecimalNum(-6)).toString(10), false, v.point)).toFormat()
        v.open_price = new BigNumber(addPosNeg(new BigNumber(v.open_price).times(formatTenDecimalNum(-6)).toString(10), false, v.point)).toFormat()
        
        v.profit = new BigNumber(addPosNeg(new BigNumber(v.profit).times(formatTenDecimalNum(-6)).toString(10), false, v.point)).toFormat()
        v.lot = ((new BigNumber(v.lot).times(formatTenDecimalNum(-4))).toString(10))
        v.leverageFormat = v.leverage + 'X'
      })
      _dispatch(setHistoryPositions(result.data))
    }
  });
}