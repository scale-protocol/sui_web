export const setAccount = account => ({
  type: 'SET_ACCOUNT',
  account
})

export const setAddress = address => ({
  type: 'SET_ADDRESS',
  address
})

export const setWallet = wallet => ({
  type: 'SET_WALLET',
  wallet
})

export const setBalanceList = balancelist => ({
  type: 'SET_BALANCELIST',
  balancelist
})

export const setProvider = provider => ({
  type: 'SET_PROVIDER',
  provider
})

export const setUserInfo = userinfo => ({
  type: 'SET_USER_INFO',
  userinfo
})

export const setPriceMap = priceMap => ({
  type: 'SET_PRICE_MAP',
  priceMap
})


export const setActivePositions = activePositions => ({
  type: 'SET_ACTIVE_POSITIONS',
  activePositions
})

export const setHistoryPositions = historyPositions => ({
  type: 'SET_HISTORY_POSITIONS',
  historyPositions
})

export const setWsPositionUpdateData = wsData => ({
  type: 'SET_WS_POSITION_UPDAT',
  wsData
})

// market
export const setMarketListData = marketListData => ({
  type: 'SET_MARKETLIST_DATA',
  marketListData
})

export const setActiveTradePair = activeTradePair => ({
  type: 'SET_ACTIVE_TRADE_PAIR',
  activeTradePair
})

// 点差
export const setSpreadMap = spreadMap => ({
  type: 'SET_SPREADMAP',
  spreadMap
})