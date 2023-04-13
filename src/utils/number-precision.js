import np from 'number-precision'

/**
 * 校验是否是有效的数字
 */
np.isNum = function (num) {
  const n = Number(num)
  try {
    const r = !(typeof n !== 'number' || isNaN(n) || (num.trim && num.trim() === ''))
    return r
  } catch (e) {
    return false
  }
}

/**
 * js 自带的 round 方法遇到负数的时候是 六入五舍，为了与 mt5 统一，负数的四舍五入计算规则需与正数相同
 * np.round(-4.465, 2) => -4.47, not -4.46
 */
const _round = np.round
np.round = function (num, radio) {
  if (np.isNum(num)) {
    if (num >= 0) {
      return _round(num, radio)
    } else {
      return np.times(_round(Math.abs(num), radio), -1)
    }
  } else {
    return num
  }
}

/**
 * 强制返回指定小数位的字符串数字
 */
np.roundToStr = function (num, radio) {
  return np.round(num, radio).toFixed(radio)
}

export default np
