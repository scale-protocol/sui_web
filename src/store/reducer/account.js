import { combineReducers } from '@reduxjs/toolkit';

const account = (state = '', action) => {
  switch (action.type) {
    case 'SET_ACCOUNT': 
      // console.log('SET_ACCOUNT', action)
      return action.account

    default: 
      return state
  }
}


const address = (state = '', action) => {
  switch (action.type) {
    case 'SET_ADDRESS': 
    return action.address

    default: 
      return state
  }
}

const wallet = (state = null, action) => {
  switch (action.type) {
    case 'SET_WALLET': 
    return action.wallet
  
    default: 
      return state
  }
}

const balanceList = (state = [], action) => {
  switch (action.type) {
    case 'SET_BALANCELIST': 
    return action.balancelist
  
    default: 
      return state
  }
}

const provider = (state = [], action) => {
  switch (action.type) {
    case 'SET_PROVIDER': 
    return action.provider
  
    default: 
      return state
  }
}

const accountModule =combineReducers({ account, address, wallet, balanceList, provider })

export default accountModule