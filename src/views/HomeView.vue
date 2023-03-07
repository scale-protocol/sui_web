<script setup lang="ts">
import { ref, computed } from 'vue'
import { createChart } from 'lightweight-charts'
import { tradePair } from '@/utils/trade-pair'
// import { createAccount, deposit,  withdraw} from '@/utils/sui'
import { openPosition } from '@/utils/sui'
import axios from 'axios'
import { useStore } from 'vuex'
import { formatTenDecimalNum, plusAndMinus } from '@/utils/filter'


// import Positions from '@/components/Positions.vue'
import PositionsComponent from '@/components/PositionsComponent'
import areaLineImg from '@/assets/img/areaLine.png'
import candleImg from '@/assets/img/candle.png'
import BigNumber from 'bignumber.js'

const chartTypeActive = ref('areaLine')
const chartTypeArr = ref([
  { txt: 'areaLine', icon: areaLineImg },
  { txt: 'candle', icon: candleImg }
])

function switchChartType (i:string) {
  chartTypeActive.value = i
  getChartDataAndDraw(chartTypeActive.value)
}

async function getChartDataAndDraw (type: string) {
  axios({			
    url: `https://dev-api.scale.exchange/price/${type === 'areaLine' ? 'history': 'history_full'}`,		
    method: 'get',				
    params: {										
      symbol: tradePair[activeIndex.value].symbolOrigin,
      range: timeTypeActive.value
    }
  }).then(res => {									
    if (res.data.message === 'Ok') {
      if (type === 'areaLine') {
        res.data.data.forEach((v: { time: number; value: number }) => {
          v.time = Date.parse(v.time.toString()) / 1000
          v.value = Number(new BigNumber(v.value).idiv(new BigNumber(1000000)).toString(10))
        })
        drawChart('areaLine' ,res.data.data)
      } else {
        res.data.data.forEach((v: any) => {
          v.time = Date.parse(v.stop_time) / 1000
          v.open = v.open / 1000000
          v.close = v.close / 1000000
          v.low = v.low / 1000000
          v.high = v.high / 1000000
        })
        drawChart('candle', res.data.data)
      }
    }
  })
}

function drawChart (type: string, data: any) {
  const chartOptions: Object = {
    layout: {
      textColor: 'rgba(0, 0, 0, 0.45)',
      background: { type: 'solid', color: 'white' }
    },
    localization: {
      locale: 'en',
      dateFormat: "yyyy-MM-dd",
      timeFormat: 'hh-mm'
    },
    timeScale: {
      borderColor: 'white'
    },
    grid: {
      vertLines: {
          color: "#fff",
          style: 0,
          visible: 1
      },
      horzLines: {
          color: "#fff",
          style: 0,
          visible: 1
      }
    },
    rightPriceScale: {
      borderVisible: false
    }
  }
  if (type === 'areaLine') {
    const chart = createChart(document.getElementById('areaLine') || '', chartOptions);
    const areaSeries = chart.addAreaSeries({ lineColor: '#69D2F5', topColor: 'rgba(105, 210, 245, 0.1)', bottomColor: 'white' });
    areaSeries.setData(data);
    chart.timeScale().fitContent();
  }
  if (type === 'candle') {
    const chart = createChart(document.getElementById('candle') || '', chartOptions);
    const candlestickSeries = chart.addCandlestickSeries({ upColor: '#41BA63', downColor: '#E76464', borderVisible: false, wickUpColor: '#41BA63', wickDownColor: '#E76464' });
    candlestickSeries.setData(data);
    chart.timeScale().fitContent();
  }
}

const ruleForm = reactive({
  leverage: 1,
  size: 0
})

const activeIndex = ref(0)
const timeTypeActive = ref('1D')
const timeType = ref(['1H', '1D', '1W', '1M', '1Y'])

function switchTime (i: string) {
  // console.log(i)
  timeTypeActive.value = i
  getChartDataAndDraw(chartTypeActive.value)
}

const store = useStore()
const address = computed(() => store.state.address)
const priceMap = computed(() => store.state.priceMap)

async function trade (type: string) {
  // 交易手数，因为不能传小数，现在放大了10000
  const formatSize = (new BigNumber(ruleForm.size).times(formatTenDecimalNum(4))).toString(10)
  const rp = await openPosition(store.state.wallet, store.state.account, formatSize, ruleForm.leverage, 1, type === 'sell' ? 2 : 1)
  if (rp.effects.status.status === 'success') {
    ElMessage({
      message: 'Successfully opened a position!',
      type: 'success'
    })
  }
}

function connectTip () {
  ElMessage({
    message: 'Please click the sign up link wallet in the upper right corner!',
    type: 'warning'
  })
}

onMounted(() => {
  getChartDataAndDraw(chartTypeActive.value)
  store.dispatch('accountInfo')
  store.dispatch('getPositions')
})

</script>

<template>
  <div class="pg-home">
    <div class="section-1">
      <div class="mui-flex">
        <ul class="marketList">
          <li v-for="(i, index) of tradePair" :key="index" :class="{'active': activeIndex === index}">
            <div class="mui-fl-vert">
              <img :src="i.icon" alt="" class="img-icon">
              <div>
                <p class="s">{{ i.symbol }}</p>
                <p class="p">${{ priceMap?.current_price || '--' }}</p>
              </div>
            </div>
            <p 
            class="changeP"
            :class="[plusAndMinus(priceMap?.change_rate)?.className]">{{ plusAndMinus(priceMap?.change_rate)?.sign + (priceMap?.change_rate) || '--' }}</p>
          </li>
        </ul>
        <div class="chart-wrap">
          <div class="currency">
            <div class="mui-fl-vert token">
              <img :src="tradePair[activeIndex].icon" alt="">
              {{tradePair[activeIndex].symbol}}
            </div>
            <ul class="mui-fl-vert numlist">
              <li class="p">${{ priceMap?.current_price || '--' }}</li>
              <li>
                <p>Change( %)</p>
                <p :class="[plusAndMinus(priceMap?.change_rate)?.className]">{{ plusAndMinus(priceMap?.change_rate)?.sign + (priceMap?.change_rate) || '--' }}</p>
              </li>
              <li>
                <p>Change</p>
                <p :class="[plusAndMinus(priceMap?.change)?.className]">{{ plusAndMinus(priceMap?.change)?.sign + (priceMap?.change) || '--' }}</p>

              </li>
              <li>
                <p>24H High</p>
                <p>{{ priceMap?.high_24h || '--' }}</p>
              </li>
              <li>
                <p>24H Low</p>
                <p>{{ priceMap?.low_24h || '--' }}</p>
              </li>
            </ul>
          </div>
          <div class="mui-fl-vert time-chart">
            <ul class="mui-fl-vert timelist">
              <li v-for="(i, index) of timeType" :key="index" :class="{ 'taplight': 1, 'active': i === timeTypeActive }" @click="switchTime(i)">{{ i }}</li>
            </ul>
            <div class="mui-fl-vert chart">
              <p>Chat View</p>
              <div>
                <img v-for="(i, index) of chartTypeArr" :key="index" :src="i.icon" alt="" :class="{ 'active': chartTypeActive === i.txt, 'taplight': 1 }" @click="switchChartType(i.txt)">
              </div>
            </div>
          </div>

          <div v-if="chartTypeActive === 'areaLine'" id="areaLine" style="width: 640px;height: 278px;"></div>
          <div v-if="chartTypeActive === 'candle'" id="candle" style="width: 640px;height: 278px;"></div>

          <!-- <button @click="createAccount">创建用户交易账户（MVP）</button>
          <button @click="deposit">入金（MVP）</button> -->
        </div>
        <div class="right-form mui-fl-col">
          <p class="title mui-fl-shr-0">Market</p>

          <ElForm
            class="sty1-form mui-fl-1 mui-fl-col mui-fl-btw"
            ref="ruleFormRef"
            :model="ruleForm"
            label-position="top"
            size="large"
            @submit.prevent>
            <div class="mui-fl-1">
              <ElFormItem label="Size">
                <ElInputNumber v-model="ruleForm.size"
                  :min="0.01"
                  :max="10"
                  :step="0.01"
                  controls-position="right"
                  size="large"></ElInputNumber>
              </ElFormItem>
              <ElFormItem label="Leverage" prop="amount">
                <ElInputNumber v-model="ruleForm.leverage"
                  :min="1" :max="125" :step="1"
                  controls-position="right"
                  size="large" placeholder="1-125X"></ElInputNumber>
              </ElFormItem>
              
              <div class="mui-fl-vert mui-fl-btw">
                <p>Margin</p>
                <p>--</p>
              </div>
            </div>
            <div v-if="!address" class="mui-flex">
              <ElButton type="primary" class="mui-fl-1" round size="large" native-type="submit" @click="connectTip">Connect Wallet</ElButton>
            </div>
            <div v-else>
              <p class="gasfee">
                Gas fee
                <span>0.000005 SUI</span>
              </p>
              <ul class="tradeBtn mui-fl-vert">
                <li class="mui-fl-1 taplight" @click="trade('sell')">
                  <p>SELL</p>
                  <p>{{ priceMap && (priceMap?.current_price - 10) }}</p>
                </li>
                <li>20</li>
                <li class="mui-fl-1 taplight" @click="trade('buy')">
                  <p>BUY</p>
                  <!-- <p>62453.14</p> -->
                  <p>{{ priceMap && (priceMap?.current_price + 10) }}</p>
                </li>
              </ul>
            </div>
          </ElForm>
        </div>
      </div>
      <!-- <Positions></Positions> -->
      <PositionsComponent></PositionsComponent>
    </div>
  </div>
</template>

<style
  lang="scss"
  scoped
  src="@/assets/css/views/home-view.scss"
></style>
