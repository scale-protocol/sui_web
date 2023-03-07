<script setup lang="ts">
import { computed, ref } from 'vue'
import { ethosForVue } from "ethos-connect-vue"
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
import { formatAddress, getTokenObjectIds, formatNum } from '@/utils/filter'
import { deposit, withdraw } from '@/utils/sui'
import { PACKAGE_OBJECTID, TYPE } from '@/utils/token'
import type { objectInfo, tokenInfo } from '@/types'

const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)
const store = useStore()
const { context } = ethosForVue() || {};
const { wallet } = context?.wallet || {};
const scaleBalance = ref('0')
// console.log('wallet', wallet)

if (wallet) {
  // 存储 钱包地址 和 Provider
  store.commit('SET_WALLET', wallet)
  store.commit('SET_ADDRESS', wallet.address)
  store.commit('SET_PROVIDER', context.providerAndSigner.provider)

  // 存储用户账户account
  const { objects } = wallet?.contents || { objects: []}
  // console.log('objects', objects)
  objects.forEach((v: objectInfo) => {
    if (v.type === `${PACKAGE_OBJECTID}::account::UserAccount<${TYPE.T}>`) {
      store.commit('SET_ACCOUNT', v?.details?.data?.fields.account_id.fields.id)
    }
  })

  const { tokens } = wallet?.contents || { tokens: {}}
  const balanceList: Array<tokenInfo> = []
  
  // 存储 balanceList
  Object.keys(tokens).forEach(async (v) => {
    const obj = tokens[v]
    const symbol = v.substring(v.lastIndexOf(':') + 1)
    let tokenInfo: any
    try {
      tokenInfo = await store.state.provider.getCoinMetadata(v)
    } catch (e) {
      tokenInfo = { decimals: 0, symbol }
    }
    if (symbol === 'SUI') {
      balanceList.unshift({
        symbol,
        balance: obj.balance.toString(10),
        formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(tokenInfo.decimals)).toString(10),
        coins: obj.coins.sort((a: { balance: number }, b: { balance: number }) => { return b.balance - a.balance })
      })
    } else {
      balanceList.push({
        symbol,
        balance: obj.balance.toString(10),
        formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(tokenInfo.decimals)).toString(10),
        coins: obj.coins.sort((a: { balance: number }, b: { balance: number }) => { return b.balance - a.balance })
      })
    }
    store.commit('SET_BALANCELIST', balanceList)
    console.log('balanceList', balanceList)
    balanceList.forEach(v => {
      if (v.symbol === 'SCALE') {
        scaleBalance.value = v.formateBalance
      }
    })
  })
  setTimeout(() => {
    if (!store.state.account && store.state.balanceList[0]?.balance > 10000) {
      store.dispatch('fetchAndCreateAccount')
    }
  }, 1000)
  
} else {
  store.commit('SET_ADDRESS', '')
  store.commit('SET_PROVIDER', {})
  store.commit('SET_BALANCELIST', [])
}

// 出入金
const dialogVisible = ref(false)
const dialogType = ref('')
const amount = ref('')

function WithdrawOrDeposit (type: string) {
  dialogVisible.value = true
  dialogType.value = type
  amount.value = ''
}

async function handleConfirm () {
  const formatAmount = (new BigNumber(amount.value).times(BIG_TEN.pow(6))).toString(10)
  if (dialogType.value === 'Deposit') {
    const scaleObjectIds = getTokenObjectIds(store.state.balanceList, 'SCALE')
    const rp = await deposit(store.state.wallet, store.state.account, formatAmount, scaleObjectIds)
    if (rp.effects.status.status === 'success') {
      ElMessage({
        message: 'Deposit Successful!',
        type: 'success'
      })
    } else {
      ElMessage({
        message: 'Deposit fail, Please try again later',
        type: 'warning'
      })
    }
  } else if (dialogType.value === 'Withdraw') {
    const rp = await withdraw(store.state.wallet, store.state.account, formatAmount)
    if (rp.effects.status.status === 'success') {
      ElMessage({
        message: 'Withdraw Successful!',
        type: 'success'
      })
    } else {
      ElMessage({
        message: 'Withdraw fail, Please try again later',
        type: 'warning'
      })
    }
  }
  dialogVisible.value = false
}

// 欢迎
const welcomeDialog = ref(false)

function goGitbook () {
  window.open('https://scaleprotocol.gitbook.io/scale-protocol-1/')
  welcomeDialog.value = false
}

// 提示 Coming soon
function handleTip () {
  ElMessage({
    message: 'Coming soon!',
    type: 'warning'
  })
}
const address = computed(() => store.state.address)
const userInfo = computed(() => store.state.userInfo)
// console.log('store', store.state.ws.isConnected)

onMounted(() => {
  store.dispatch('wsOnMessage')
})
</script>

<template>
  <div class="mui-header">
    <div class="section">
      <div class="mui-fl-vert mui-fl-btw">
        <div class="mui-fl-vert">
          <p class="logo"></p>
          <div v-show="address" class="account mui-fl-vert">
            <p class="t1 mui-fl-vert taplight2" @click="handleTip">
              <span>Account</span>
              <i class="mico-arrow-right" />
            </p>
            <ul class="info mui-fl-vert">
              <li>
                <p>Balance</p>
                <p>$ {{ formatNum(userInfo.balance) }}</p>
              </li>
              <li>
                <p>Margin</p>
                <p>$ {{ formatNum(userInfo.margin_total) }}</p>
              </li>
              <li>
                <p>Margin Level</p>
                <!-- <p>$99,231,52.00</p> -->
                <p>$ --</p>
              </li>
              <li class="condition mui-fl-vert">
                <i class="mico-success"></i>
                <span>Good Condition</span>
              </li>
            </ul>
            <div class="btns mui-fl-vert">
              <p class="taplight2" @click="WithdrawOrDeposit('Deposit')">Deposit</p>
              <p></p>
              <p class="taplight2" @click="WithdrawOrDeposit('Withdraw')">Withdraw</p>
            </div>
          </div>
        </div>
        
        <div class="mui-fl-vert">
          <div class="global mui-fl-vert">
            <i class="mico-global"></i>
            <p class="mui-fl-vert taplight2">
              <span>US</span>
              <i class="mico-arrow-right" />
            </p>
          </div>
          <AddressWidget />
        </div>
      </div>
      <router-view />
    </div>
  </div>
  
  <ElDialog
    :title="dialogType"
    v-model="dialogVisible"
    custom-class="sty1-dialog"
    append-to-body
    width="386px">
      <div class="mui-fl-vert mui-fl-btw wallet-info">
        <p>{{ dialogType === 'Deposit' ? 'From' : 'To' }} Wallet</p>
        <p class="pubkey mui-fl-vert">
          {{ formatAddress(address) }}
        </p>
      </div>
      <div class="sty2-gp">
        <ElInput class="mui-fl-1 sty1-input" placeholder="USDC" v-model="amount"></ElInput>
      </div>
      <p class="wallet-tip">{{ dialogType === 'Deposit' ? `Your wallet: ${scaleBalance}` : `Your balance: ${userInfo.balance || '0.00'}` }}</p>
    <template #footer>
      <ElButton class="width-1 grey" @click="dialogVisible = false" round>Cancel</ElButton>
      <ElButton type="primary" class="width-1 black" round :disabled="amount === ''" @click="handleConfirm">Confirm</ElButton>
    </template>
  </ElDialog>

  <ElDialog
    v-model="welcomeDialog"
    custom-class="sty1-dialog"
    append-to-body
    width="386px">
    <div class="welcome mui-fl-col mui-fl-vert">
      <img src="@/assets/img/welcome.png" alt="">
      <p class="t1">Welcome !</p>
      <p class="t2">If you are new to Scale, please read our introduction, it may help you</p>
    </div>
    <template #footer>
      <ElButton class="sty2-button width-2" round @click="goGitbook">Go</ElButton>
    </template>
  </ElDialog>

  <!-- <m-dialog
      ="welcomeDialog"
      custom-class="sty1-dialog"
      width="386px">
      <template>
        <div class="welcome mui-fl-col mui-fl-vert">
          <img src="~@/assets/img/welcome.png" alt="">
          <p class="t1">Welcome !</p>
          <p class="t2">If you are new to Scale, please read our introduction, it may help you</p>
        </div>
      </template>
      <span slot="footer" class="mui-flex">
        <m-button class="mui-fl-1 sty7-button" round @click="goGitbook">Go</m-button>
      </span>
    </m-dialog> -->
</template>

<style lang="scss" src="@/assets/css/components/header-component.scss" scoped></style>