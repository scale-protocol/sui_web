/**
 * 通过 vuex 插件解决子模块 mutation 不能修改 rootState 的问题，
 * 监听子模块的 mutation 从而修改 rootState
 */

// import * as types from './mutation-types'

export default (store: any) => {
  store.subscribe((mutation: any, state: any) => {
    if (mutation.type === 'SOCKET_ONMESSAGE') {
      const pl = mutation.payload
      const u = state.auth.user
      const mt5Acc = Number(pl.data.mt5_account)
      switch (pl.mt) {
        // 消息中心-新增未读消息
        // case 'message_unread':
        //   store.commit(types.SET_USER, { unread_messgae_num: pl.data.cnt })
        //   break

        // // 仓位更新消息
        // case 'position_update':
        //   if (u.mt5_account === mt5Acc) {
        //     store.commit(types.SET_POSITION_UPDATE_STACK, pl.data)
        //     // 重新拉取仓位列表
        //     store.dispatch('fetchPositionList')
        //     if (pl.data.command !== 2) { // 1开仓（创建订单），2更新订单，3平仓，不是2的话需要更新资产
        //       store.dispatch('fetchProfile')
        //     }
        //   }
        //   break

        // // 挂单更新消息
        // case 'pending_order':
        //   if (u.mt5_account === mt5Acc) {
        //     store.commit(types.SET_LIMIT_UPDATE_STACK, pl.data)
        //   }
        //   break

        // // 资产变化消息
        // case 'balance_update':
        //   if (u.mt5_account === mt5Acc) {
        //     store.dispatch('fetchProfile')
        //   }
        //   break

        // // KYC 认证结果消息
        // case 'kyc_certification_result':
        //   store.commit(types.SET_USER, { opening_status: Number(pl.data.opening_status) })
        //   break

        // // 强制退出登录消息（在后台系统禁用用户会触发该消息）
        // case 'logout':
        //   if (Number(pl.data.user_id) === u.id) {
        //     store.commit('SET_LOGOUT_MESSAGE', pl)
        //   }
        //   break

        default:
          break
      }
    }
  })
}
