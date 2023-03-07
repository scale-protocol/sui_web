import type { tokenInfo } from '@/types'
import BigNumber from 'bignumber.js'
const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)


/**
 * 格式化钱包地址
 * @param account 钱包地址
 */
export const formatAddress = (account: string) => {
  return account ? account.substr(0, 4) + '...' + account.substr(-4, 4) : ''
}

/**
 * 获取特定代币的对象ids
 * @param balanceList 获取的balanceList
 * @param symbol 代币类型
 */
export const getTokenObjectIds = (balanceList: Array<tokenInfo>, symbol: string) => {
  const coins = balanceList.find(v => v.symbol === symbol)?.coins || []
  const objectIds = Array.from(coins, ({ objectId }) => objectId)
  return objectIds
}


export const formatTenDecimalNum = (decimal: any) => {
  return BIG_TEN.pow(decimal)
}

/**
 * 返回加减符号
 * @param {*} num 接收的值
 */
export const plusAndMinus = (num: any) => {
  if (!num) return
  const flag = (new BigNumber(num)).gt(new BigNumber(0))
  return {
    sign: flag ? '+' : '-',
    className: flag ? 'green' : 'red'
  }
}

/**
 * 保留两位小数
 * @param {*} num 传值
 */
export const formatNum = (num: any) => {
  if (!num) return '--'
  return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
  // const BN_DP0 = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 0 })
  // const step1 = new BN_DP0(num).toString(10)
  // return new BN_DP0(step1).toFormat()
}