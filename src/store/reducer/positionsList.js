import { combineReducers } from '@reduxjs/toolkit';

const activePositions = (state = [], action) => {
  switch (action.type) {
    case 'SET_ACTIVE_POSITIONS':
      return action.activePositions

    default:
      return state
  }
}


const historyPositions = (state = null, action) => {
  switch (action.type) {
    case 'SET_HISTORY_POSITIONS':
      return action.historyPositions

    default:
      return state
  }
}

const wsPositionUpdateData = (state = null, action) => {
  switch (action.type) {
    case 'SET_WS_POSITION_UPDAT': 
    return action.wsData

    default: 
      return state
  }
}

const positionsModule = combineReducers({ activePositions, historyPositions, wsPositionUpdateData })
export default positionsModule