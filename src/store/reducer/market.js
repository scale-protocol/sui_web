const marketList = (state = [], action) => {
    switch (action.type) {
      case 'SET_MARKETLIST_DATA': 
        return action.marketListData
  
      default: 
        return state
    }
  }
  
  export default marketList