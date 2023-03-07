// import { ethosForVue } from "ethos-connect-vue"
import { PACKAGE_OBJECTID, MODULE, TYPE, ORACLE_ROOT, MARKET_LIST, MARKET } from '@/utils/token'

// const { context } = ethosForVue() || {};
// const { wallet } = context?.wallet || {};


// 创建用户交易账户（MVP）
export const createAccount = async (wallet: any, objectId: string) => {
  const rp = await wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: PACKAGE_OBJECTID,
      module: MODULE,
      function: "create_account",
      typeArguments: [TYPE.T],
      arguments: [
        objectId // Scale, Object id, 字符串
      ],
      gasBudget: 10000,
    }
  })
  return rp
}


// 入金
export const deposit  = async (wallet: any, account: string, amount: any, objectIds: Array<string>) => {
  console.log(
    account,
    objectIds,
    amount)
  const rp = await wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: PACKAGE_OBJECTID,
      module: MODULE,
      function: "deposit",
      typeArguments: [TYPE.T],
      arguments: [
        account,
        objectIds,
        amount
      ],
      gasBudget: 10000,
    }
  })
  console.log('deposit rp', rp)
  return rp
}

// 出金
export const withdraw  = async (wallet: any, account: string, amount: any) => {
  const rp = await wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: PACKAGE_OBJECTID,
      module: MODULE,
      function: "withdrawal",
      typeArguments: [TYPE.P, TYPE.T],
      arguments: [
        MARKET_LIST,
        account,
        ORACLE_ROOT,
        amount
      ],
      gasBudget: 5000,
    }
  })
  console.log('deposit rp', rp)
  return rp
}


// 开仓
export const openPosition  = async (wallet:any, account: string, size: string, leverage: number, position_type: number, direction: number) => {
  const rp = await wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: PACKAGE_OBJECTID,
      module: MODULE,
      function: "open_position",
      typeArguments: [TYPE.P, TYPE.T],
      arguments: [
        MARKET_LIST,
        MARKET,
        account,
        ORACLE_ROOT,
        size, //lot 合约手数，即为 ui 上的 size 由于链上不能上传小数，所以现在放大了 1000
        leverage, // 杠杆倍率
        position_type, //仓位类型，1 全仓，2 逐仓
        direction // 做单方向，1 买，2 卖
      ],
      gasBudget: 10000,
    }
  })
  console.log('openPosition', rp)
  return rp
}

// 关仓
export const closePosition  = async (wallet:any, account: string, position: string) => {
  const rp = await wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: PACKAGE_OBJECTID,
      module: MODULE,
      function: "close_position",
      typeArguments: [TYPE.P, TYPE.T],
      arguments: [
        MARKET_LIST,
        MARKET,
        account,
        ORACLE_ROOT,
        position
      ],
      gasBudget: 5000,
    }
  })
  console.log('closePosition', rp)
  return rp
}

