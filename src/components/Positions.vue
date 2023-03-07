<template>
  <div class="">
    <div class="position">
      <div class="inner-position">
        <div class="header-title mui-fl-vert mui-fl-btw">
          <ElTabs v-model="activeName" @tab-click="handleClick" class="sty1-tabs">
            <ElTabPane label="Position" name="position"></ElTabPane>
            <ElTabPane label="History" name="history"></ElTabPane>
          </ElTabs>
          <div class="mui-fl-vert">
            <p v-if="pubKey" class="profit mui-fl-vert">
              <span>Profit:</span>
              <span :class="[plusAndMinus(userInfoDynamic?.profit).className, 'mui-fl-vert']">{{ plusAndMinus(userInfoDynamic?.profit).sign }}${{ (Math.abs(userInfoDynamic?.profit) || 0) | subRadio }}</span>
            </p>
          </div>
        </div>
        <div>
          <ElTable
            v-if="activeName === 'position'"
            :data="tableData"
            class="sty1-table"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <ElTableColumn prop="orderNum" label="Order Number" min-width="120" #default="{ row }">
              <p class="mui-fl-vert order-num">
                <!-- <img :src="row.logo" alt=""> -->
                #{{ row.account.position_seed_offset }}
              </p>
            </ElTableColumn>

            <ElTableColumn prop="type" label="Type" min-width="90" #default="{ row }">
              <p :class="{ 'green': row.account.direction === 'Buy', 'red': row.account.direction === 'Sell' }">{{ row.account.direction }}</p>
            </ElTableColumn>
            <ElTableColumn prop="size" label="Size" min-width="90" #default="{ row }">
              {{ row.account.size }}
            </ElTableColumn>
            <ElTableColumn prop="leverage" label="Leverage" min-width="90" #default="{ row }">
              <p class="leverage">{{ row.account.leverage }}X</p>
            </ElTableColumn>
            <ElTableColumn prop="open" label="Open" min-width="90">
              <template #default="{ row }">
                ${{ row.account.open_price | subRadio }}
              </template>
            </ElTableColumn>
            <!-- <ElTableColumn prop="latest" label="Latest" min-width="110" /> -->
            <ElTableColumn prop="profit" label="Profit" min-width="110" #default="{ row }">
              <p :class="[plusAndMinus(row.account.profit).className]">
                {{ plusAndMinus(row.account.profit).sign }}${{ row.account.profit | subRadio }}
              </p>
              <!-- <p :class="{ 'green': row.account.profit > 0, 'red': row.account.profit < 0 }">
                {{ plusAndMinus(row.account.profit).sign}}${{ row.account.profit | subRadio }}
              </p> -->
            </ElTableColumn>
            <ElTableColumn prop="margin" label="Magrin" min-width="100" #default="{ row }">
              ${{ row.account.margin | subRadio }}
            </ElTableColumn>
            <ElTableColumn prop="opentime" label="Open Time" min-width="150" #default="{ row }">
              {{ row.account.open_time | timestampDate }}
            </ElTableColumn>
            <ElTableColumn prop="address" label="Action" min-width="120">
              <template #default="{ row, index }">
                <ElButton round class="sty5-btn grey sty6-btn taplight" :loading="row.loading" @click="closePosition(row, index)">Close</ElButton>
              </template>
            </ElTableColumn>
          </ElTable>

          <ElTable
            v-if="activeName === 'history'"
            :data="tableData"
            class="sty1-table"
            style="width: 100%">
            <ElTableColumn prop="orderNum" label="Order Number" min-width="120" #default="{ row }">
              <p class="mui-fl-vert order-num">
                <!-- <img :src="row.logo" alt=""> -->
                #{{ row.account.position_seed_offset }}
              </p>
            </ElTableColumn>

            <ElTableColumn prop="type" label="Type" min-width="90" #default="{ row }">
              <p :class="{ 'green': row.account.direction === 'Buy', 'red': row.account.direction === 'Sell' }">{{ row.account.direction }}</p>
            </ElTableColumn>
            <ElTableColumn prop="size" label="Size" min-width="90" #default="{ row }">
              {{ row.account.size }}
            </ElTableColumn>
            <ElTableColumn prop="leverage" label="Leverage" min-width="90" #default="{ row }">
              <p class="leverage">{{ row.account.leverage }}X</p>
            </ElTableColumn>
            <ElTableColumn prop="closePrice" label="Close Price" min-width="125" #default="{ row }">
              ${{ row.account.close_price | subRadio }}
            </ElTableColumn>
            <ElTableColumn prop="profit" label="Profit" min-width="110" #default="{ row }">
              <p :class="[plusAndMinus(row.account.profit).className]">
                {{ plusAndMinus(row.account.profit).sign }}${{ Math.abs(row.account.profit) | subRadio }}
              </p>
            </ElTableColumn>
            <ElTableColumn prop="closetime" label="Close Time" min-width="150" #default="{ row }">
              {{ row.account.close_time | timestampDate('minute') }}
            </ElTableColumn>
            <ElTableColumn label="Status" min-width="90">
              Closed
            </ElTableColumn>
            <ElTableColumn prop="address" label="Action" min-width="120" #default="{ row }">
              <ElButton round class="sty5-btn grey sty6-btn taplight" @click="handleView(row)">View</ElButton>
            </ElTableColumn>
          </ElTable>
          <div v-if="tableData.length === 0" class="nodata mui-fl-col mui-fl-central">
            <p class="img-nodata"></p>
            <!-- <span>{{ address ? '' : 'Please connect the wallet first.' }}</span> -->
          </div>
        </div>
      </div>
    </div>

    <ElDialog
      title="Close Position"
      :visible.sync="dialogVisible"
      custom-class="sty1-dialog"
      width="386px"
      :before-close="handleClose">
      <template>
        <div class="sty2-gp mui-fl-vert">
          <p>Close</p>
          <ElInput class="mui-fl-1 sty1-input" placeholder="Size" v-model="positionSizeFormate"></ElInput>
        </div>
        <ul class="process mui-fl-vert">
          <li v-for="(i, index) of process" :key="index" :class="{'mui-fl-1': 1, 'active': processActiveIndex === index}" @click="handleProcee(i, index)">{{ i }}%</li>
        </ul>
        <ul class="profit-ul">
          <li class="mui-fl-vert mui-fl-btw">
            <span>Profit</span>
            <span class="green">+$45632.48</span>
          </li>
          <li class="mui-fl-vert mui-fl-btw">
            <span>Expected return margin</span>
            <span>$32.48</span>
          </li>
        </ul>
      </template>
      <span slot="footer" class="mui-fl-central">
        <ElButton class="sty5-btn grey" round @click="dialogVisible = false">Cancel</ElButton>
        <ElButton type="primary" class="sty5-btn black" round @click="confirmClosePosition">Close</ElButton>
      </span>
    </ElDialog>
  </div>
</template>

<script>
// import fakedata from '@/utils/fake-data'
// import mixin from '@/utils/mixin'
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  name: 'Position',
  // mixins: [mixin],
  data () {
    return {
      activeName: 'position',
      positionType: 'All',
      // positionTypeList: ['All', 'BTC-USD', 'ETH-USD', 'SOL-USD'],
      positionList0: [],
      historyList0: [],
      // dialogVisible: false,
      dialogVisible: true,
      positionIndex: null,
      positionSize: null,
      positionSizeFormate: null,
      processActiveIndex: 0,
      process: [25, 50, 75, 100]
    }
  },
  computed: {
    ...mapState(['positionsList', 'hisPositionsList', 'userAccount', 'pubKey', 'userInfo']),
    address () {
      console.log('store.state.address', store.state.address)
      return store.state.address
    },
    userInfoDynamic () {
      return this.userInfo ? this.userInfo.dynamic_data || {} : {}
    },
    tableData () {
      if (!this.pubKey) {
        return []
      }
      let list = []
      // if (this.positionType === 'All') {
      //   list = (this.activeName === 'position' ? this.positionsList : this.hisPositionsList) || []
      // } else {
      //   list = (this.activeName === 'position' ? this.positionsList : this.hisPositionsList) || []
      //   // list = list.filter(v => v.symbol === this.positionType)
      // }
      list = (this.activeName === 'position' ? this.positionsList : this.hisPositionsList) || []
      return list
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
    },
    handleClick () {
      this.$router.push({
        query: {
          prefix: this.activeName === 'position' ? 'active' : 'history'
        }
      })
    },
    handleView () {
      this.$message.info({
        message: 'Coming soon!',
        type: 'warning'
      })
    },
    closePosition (row) {
      row.loading = true
      this.instructionClosePosition(new PublicKey(row.pubkey).toBase58())
      // this.dialogVisible = true
      // this.positionIndex = row.index
      // this.positionSize = row.size
      // this.positionSizeFormate = this.positionSize * 25 / 100
      row.loading = false
    },
    handleClose () {
      // this.dialogVisible = false
      // this.processActiveIndex = 0
      this.instructionClosePosition()
    },
    handleProcee (i, index) {
      this.processActiveIndex = index
      this.positionSizeFormate = this.positionSize * i / 100
    },
    confirmClosePosition () {
      this.positionList0.splice(this.positionIndex, 1)
      this.handleClose()
    },
    plusAndMinus (num) {
      if (Number(num) === 0) {
        return {
          sign: '',
          className: ''
        }
      }
      const flag = (new BigNumber(num)).gt(new BigNumber(0))
      return {
        sign: flag ? '+' : '-',
        className: flag ? 'green' : 'red'
      }
    }
  }
}
</script>

<style lang="scss" src="@/assets/css/views/_positions.scss" scoped></style>
