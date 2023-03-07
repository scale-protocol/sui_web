import { createStore } from 'vuex'
import axios from 'axios'
// import ModuleWs from './modules/ws'
import { createAccount } from '@/utils/sui'
import { getTokenObjectIds, formatTenDecimalNum, formatNum } from '@/utils/filter'
import type { tokenInfo } from '@/types'
import BigNumber from 'bignumber.js'

export interface State {
  wallet: any,
  address: string,
  provider: any,
  balanceList: Array<tokenInfo>,
  account: string,
  userInfo: object,
  positionsList: Array<any>,
  priceMap: any,
  positionsMap: any
}

const store = createStore<State>({
  state: {
    wallet: null,
    address: '',
    provider: null,
    balanceList: [],
    account: '',
    userInfo: {},
    positionsList: [],
    priceMap: null,
    positionsMap: null
  },
  getters: {
    webSocket (state) {
      return new WebSocket(
        `wss://dev-api.scale.exchange/ws?account=${state.account}`
      ); 
    }
  },
  mutations: {
    SET_WALLET (state, payload) {
      state.wallet = payload
    },
    SET_ADDRESS (state, payload) {
      state.address = payload
    },
    SET_PROVIDER (state, payload) {
      state.provider = payload
    },
    SET_BALANCELIST (state, list) {
      state.balanceList = list
    },

    SET_ACCOUNT (state, payload) {
      state.account = payload
    },

    SET_USERINFO (state, payload) {
      // console.log('SET_USERINFO', payload)
      state.userInfo = payload
    },

    SET_POSITIONS (state, payload) {
      state.positionsList = payload
    },

    SET_BTC_PRICE_MAP (state, payload) {
      state.priceMap = payload
    },

    SET_POSITIONS_MAP (state, payload) {
      state.positionsMap = payload
    }
  },
  actions: {
    async fetchAndCreateAccount ({ state }) {
      if (state.balanceList.length > 0) {
        // 平台交易币
        const scaleObjectIds = getTokenObjectIds(state.balanceList, 'SCALE')
        if (scaleObjectIds.length > 0) {
          const rp = await createAccount(state.wallet, scaleObjectIds[0])
          if (rp.effects.status.status === 'success') {
            console.log(rp)
          } else {
            ElMessage({
              message: 'Insufficient balance, please reset enough'
            })
          }
        } else {
          ElMessage({
            message: 'please airdrop'
          })
        }
      }
    },
    async accountInfo ({ state, commit }) {
      if (!state.account) return
      axios({
        url: `https://dev-api.scale.exchange/account/info/${state.account}`,		
        method: 'get'
      }).then(rp => {
        if (rp.data.message === 'Ok') {
          // 代币的decimal为6，但是返回的原生的最小单位数，所以
          rp.data.data.balance = (new BigNumber(rp.data.data.balance).times(formatTenDecimalNum(-6))).toString(10)
          commit('SET_USERINFO', rp.data.data)
        }
      })
    },
    async getPositions ({ state, commit }, options = { prefix: 'active' }) {
      if (!state.account) return
      axios({
        url: `https://dev-api.scale.exchange/account/positions/${options.prefix}/${state.account}`,		
        method: 'get'
      }).then(rp => {
        if (rp.data.message === 'Ok') {
          if (options.prefix === 'history') {
            rp.data.data.forEach((v:any) => {
              v.lot = new BigNumber(v.lot).times(formatTenDecimalNum(-4))
              v.close_price = formatNum(new BigNumber(v.close_price).times(formatTenDecimalNum(-6)))
              v.profit = formatNum(new BigNumber(v.profit).times(formatTenDecimalNum(-6)))
            })
          }
          if (options.prefix === 'active') {
            rp.data.data.forEach((v:any) => {
              v.loading = false
              v.lot = new BigNumber(v.lot).times(formatTenDecimalNum(-4))
              v.profit = formatNum(new BigNumber(v.profit).times(formatTenDecimalNum(-6)))
              v.open_real_price = formatNum(new BigNumber(v.profit).times(formatTenDecimalNum(-6)))
            })
          }
          commit('SET_POSITIONS', rp.data.data)
        }
      })
    },
    async wsOnMessage ({ state, getters, commit }) {
      getters.webSocket.onmessage = function (e: any) {
        const data = JSON.parse(e.data)
        switch (data.event) {
          case 'price_update':
            // console.log('data.datadata.data', data.data)

            commit('SET_BTC_PRICE_MAP', Object.assign(data.data, {
              change: formatNum(new BigNumber(data.data.change).times(formatTenDecimalNum(-6))),
              current_price: formatNum(new BigNumber(data.data.current_price).times(formatTenDecimalNum(-6))),
              high_24h: formatNum(new BigNumber(data.data.high_24h).times(formatTenDecimalNum(-6))),
              low_24h: formatNum(new BigNumber(data.data.low_24h).times(formatTenDecimalNum(-6)))
            }))
            break

          case 'account_update':
            // console.log('addd', Object.assign({}, state.userInfo, data.data))
            commit('SET_USERINFO', Object.assign({}, state.userInfo, data.data))
            console.log('state.userinfo', state.userInfo)
            break

          case 'position_update':
            commit('SET_POSITIONS_MAP', data.data)
            state.positionsList.forEach(m => {
              data.data.forEach((n: any) => {
                if (m.id === n.id) {
                  m.profit = formatNum(new BigNumber(n.profit).times(formatTenDecimalNum(-6)))
                  m.profit_rate = n.profit_rate
                }
              })
            })
            break
            
          default:
            break
        }
      }

      setTimeout(() => {
        getters.webSocket.send(JSON.stringify({
          symbol: "Crypto.BTC/USD",
          sub_type: "subscribe"
        }))
      }, 10000)
    } 
  },
  modules: {
    // ws: ModuleWs
  }
})

export default store