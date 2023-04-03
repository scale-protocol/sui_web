import { get } from './index'
const API = {
  getMarkets: () => get('/markets/active'),
  getChartsData: (type, symbol, range) => get(`/price/${type}`, {
    symbol, range
  }),
  getAccountInfo: (account) => get(`/account/info/${account}`, {
    account
  }),
  getAccountPositions: (prefix, account) => get(`/account/positions/${prefix}/${account}`, {
    prefix, account
  })
  
}

export default API