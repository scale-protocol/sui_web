import BigNumber from 'bignumber.js'
import { CONIN_MODULE, CONIN_PACKAGE_OBJECTID, CONIN_RESERVE, PACKAGE_OBJECTID, MODULE, TYPE, ORACLE_ROOT, MARKET_LIST, MARKET } from './token'
import { formatTenDecimalNum } from './filter'
import { TransactionBlock } from 'ethos-connect'

// 空投
export const airdrop = async (wallet) => {
  // const transactionBlock = new TransactionBlock();
  //   transactionBlock.moveCall({
  //     target: `0xb2a4c86233ad80cfa5706a54fabf87d589f2f34e5d8d5d4967a0c143beb17cf6::ethos_example_nft::mint_to_sender`,
  //     arguments: [
  //       transactionBlock.pure("Ethos Example NFT"),
  //       transactionBlock.pure("A sample NFT from Ethos Wallet."),
  //       transactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png"),
  //     ]
  //   })

  //   const response = await wallet.signAndExecuteTransactionBlock({
  //     transactionBlock,
  //     options: {
  //       showObjectChanges: true,
  //     }
  //   });
  //   console.log('response', response)
  const amount = (new BigNumber(10000).times(formatTenDecimalNum(6))).toString(10)
  const transactionBlock = new TransactionBlock();

  transactionBlock.moveCall({
    target: `${CONIN_PACKAGE_OBJECTID}::${CONIN_MODULE}::airdrop`,
    arguments: [
      transactionBlock.pure(CONIN_RESERVE),
      transactionBlock.pure(amount),
    ]
  })
  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('airdrop response', response)
  return response
}

// 创建用户交易账户（MVP）
export const createAccount = async (wallet, objectId) => {
  const transactionBlock = new TransactionBlock();
  transactionBlock.moveCall({
    target: `${PACKAGE_OBJECTID}::${MODULE}::create_account`,
    arguments: [
      transactionBlock.pure(objectId)
    ],
    typeArguments: [TYPE.T],
    gasBudget: 100000
  })
  
  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('createAccount response', response)
  return response
}


// 入金
export const deposit  = async (wallet, account, amount, objectIds) => {
  const transactionBlock = new TransactionBlock();
  const vec = transactionBlock.makeMoveVec({
    objects: objectIds.map(id => transactionBlock.object(id))
  });

  console.log({
    account: account,
    objectIds: objectIds,
    amount: amount
  })
  transactionBlock.moveCall({
    target: `${PACKAGE_OBJECTID}::${MODULE}::deposit`,
    arguments: [
      transactionBlock.pure(account),
      vec,
      transactionBlock.pure(amount),
    ],
    typeArguments: [TYPE.T],
    gasBudget: 100000
  })
  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('deposit response', response)
  return response
}

// 出金
export const withdraw  = async (wallet, account, amount) => {
  const transactionBlock = new TransactionBlock();
  console.log({
    market_list: MARKET_LIST,
    account: account,
    root: ORACLE_ROOT,
    amount: amount
  })
  transactionBlock.moveCall({
    target: `${PACKAGE_OBJECTID}::${MODULE}::withdrawal`,
    arguments: [
      transactionBlock.pure(MARKET_LIST),
      transactionBlock.pure(account),
      transactionBlock.pure(ORACLE_ROOT),
      transactionBlock.pure(amount),
    ],
    typeArguments: [TYPE.P, TYPE.T],
    gasBudget: 100000
  })
  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('withdraw response', response)
  return response
}


// 开仓
export const openPosition  = async (wallet, account, size, leverage, position_type, direction, market) => {
  console.log({
    market_list: MARKET_LIST,
    market: market,
    account: account,
    root: ORACLE_ROOT,
    lot: size,
    leverage: leverage,
    position_type: position_type,
    direction: direction,
  })  
  const transactionBlock = new TransactionBlock();
  transactionBlock.moveCall({
    target: `${PACKAGE_OBJECTID}::${MODULE}::open_position`,
    arguments: [
      transactionBlock.pure(MARKET_LIST),
      // transactionBlock.pure(market),
      transactionBlock.pure(MARKET),
      transactionBlock.pure(account),
      transactionBlock.pure(ORACLE_ROOT),
      transactionBlock.pure(size),
      transactionBlock.pure(leverage),
      transactionBlock.pure(position_type),
      transactionBlock.pure(direction),
    ],
    typeArguments: [TYPE.P, TYPE.T],
    gasBudget: 100000
  })
  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('openPosition response', response)
  return response
}

// 关仓
export const closePosition  = async (wallet, account, position, market) => {
  const transactionBlock = new TransactionBlock();
  console.log({
    MARKET_LIST,
    market,
    account,
    ORACLE_ROOT,
    position
  })
  transactionBlock.moveCall({
    target: `${PACKAGE_OBJECTID}::${MODULE}::close_position`,
    arguments: [
      transactionBlock.pure(MARKET_LIST),
      transactionBlock.pure(market),
      transactionBlock.pure(account),
      transactionBlock.pure(ORACLE_ROOT),
      transactionBlock.pure(position),
    ],
    typeArguments: [TYPE.P, TYPE.T],
    gasBudget: 100000
  })

  const response = await wallet.signAndExecuteTransactionBlock({
    transactionBlock,
    options: {
      showObjectChanges: true,
    }
  });
  console.log('closePosition response', response)
  return response
}

