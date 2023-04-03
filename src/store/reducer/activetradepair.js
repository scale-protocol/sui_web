const activeTradePair = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TRADE_PAIR': 
      return action.activeTradePair

    default: 
      return state
  }
}

export default activeTradePair