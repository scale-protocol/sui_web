import { formatTenDecimalNum,  keepDecimal2 } from './../../utils/filter'
import BigNumber from 'bignumber.js'

const userInfo = (state = null, action) => {
    switch (action.type) {
      case 'SET_USER_INFO': 
        return Object.assign(action.userinfo, {
          balance: keepDecimal2((new BigNumber(action.userinfo.balance).times(formatTenDecimalNum(-6))).toString(10)),
          margin_total: keepDecimal2((new BigNumber(action.userinfo.margin_total).times(formatTenDecimalNum(-6))).toString(10)),
        })
  
      default: 
        return state
    }
  }
  
  export default userInfo