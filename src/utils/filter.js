// import { createChart } from 'lightweight-charts'
import BigNumber from 'bignumber.js'
const BIG_TEN = new BigNumber(10)

/**
 * 格式化钱包地址
 * @param account 钱包地址
 */
export const formatAddress = (account) => {
  return account ? account.substr(0, 4) + '...' + account.substr(-4, 4) : ''
}

/**
 * 获取特定代币的对象ids
 * @param balanceList 获取的balanceList
 * @param symbol 代币类型
 */
export const getTokenObjectIds = (balanceList, symbol) => {
  const _balanceList = JSON.parse(balanceList) || []
  const coins = _balanceList.find(v => v.symbol === symbol)?.coins || []
  const objectIds = Array.from(coins, ({ objectId }) => objectId)
  return objectIds
  // return ''
}

export const formatTenDecimalNum = (decimal) => {
  return BIG_TEN.pow(decimal)
}


export const keepDecimal2 = (num) =>{
  const fixedNum = parseFloat(num).toFixed(2);
  return fixedNum
}