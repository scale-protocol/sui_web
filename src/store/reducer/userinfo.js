import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'
const BIG_TEN = new BigNumber(10)

const userInfo = (state = null, action) => {
    switch (action.type) {
      case 'SET_USER_INFO': 
        const obj = {
          balance: new BigNumber(keepDecimal2((new BigNumber(action.userinfo.balance).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
          margin_total: new BigNumber(keepDecimal2((new BigNumber(action.userinfo.margin_total).times(formatTenDecimalNum(-6))).toString(10))).toFormat(),
        }
        if (action.userinfo?.margin_percentage) {
          obj.margin_percentage = (new BigNumber(action.userinfo.margin_percentage)).times(BIG_TEN.pow(2)).toString(10)
        }
        return Object.assign({},action.userinfo, obj)
  
      default: 
        return state
    }
  }
  
  export default userInfo