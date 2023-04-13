import np from './number-precision'
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

/**
 * 返回带有加减号的数字
 */
export const formatNum = (num, type='') =>{
  if (np.isNum(num)) {
    return num > 0 ? `+${type+num}` : `-${type+Math.abs(num)}`
  }
  return num
}

/**
 * 返回一个前面带正负号且保留指定小数位（不足补零）的字符串
 * @param {boolean} needPos 是否需要补 “+” 号
 * @param {number} radio 保留的小数位数，默认 2
 */
export function addPosNeg (num, needPos, radio = 2) {
  if (np.isNum(num)) {
    const n = np.round(Number(num), radio)
    const f = n.toFixed(radio)
    return n > 0 && needPos ? '+' + f : f
  } else {
    return num
  }
}