<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { formatAddress, formatNum } from '@/utils/filter'
import { closePosition } from '@/utils/sui'
const store = useStore();

const address = computed(() => store.state.address);
const positionsList = computed(() => store.state.positionsList || [])

const activeName = ref("position");
const closeDialogVisible = ref(false)
const process = ref([25, 50, 75, 100])
const processActiveIndex = ref(0)
const positionSizeFormate = ref()
const positionSize = ref(1)

function handleTabClick() {
  router.push({
    query: {
      prefix: activeName.value === "position" ? "active" : "history",
    },
  })
  store.dispatch('getPositions', {prefix: activeName.value !== "position" ? "active" : "history"})
}

function handleDialogClose () {}

function handleProcee (i: number, index: number) {
  processActiveIndex.value = index
  positionSizeFormate.value = positionSize.value * i / 100
}

async function handleClosePosition (row: any) {
  row.loading = true
  const rp = await closePosition(store.state.wallet, store.state.account,row.id)
  if (rp.effects.status.status === 'success') {
    store.dispatch('getPositions', {prefix: 'active'})
    ElMessage({
      message: 'Successfully closed position!',
      type: 'success'
    })
  }
  row.loading = false

}
</script>

<template>
  <div class="position">
    <div class="inner-position">
      <div class="header-title mui-fl-vert mui-fl-btw">
        <ElTabs v-model="activeName" @tab-click="handleTabClick" class="sty1-tabs">
          <ElTabPane label="Position" name="position"></ElTabPane>
          <ElTabPane label="History" name="history"></ElTabPane>
        </ElTabs>
      </div>

      <div>
        <ElTable v-if="activeName === 'position'" :data="positionsList" class="sty1-table" style="width: 100%">
          <ElTableColumn prop="orderNum" label="Order Number" min-width="120" #default="{ row }">
            <p class="mui-fl-vert order-num">
              #{{ formatAddress(row.id) }}
            </p>
          </ElTableColumn>
          <ElTableColumn prop="type" label="Type" min-width="90" #default="{ row }">
            <p :class="{ green: row.direction === 'Buy', red: row.direction === 'Sell'}">
              {{ row.direction }}
            </p>
          </ElTableColumn>
          <ElTableColumn prop="size" label="Size" min-width="90" #default="{ row }">
            {{ row.lot }}
          </ElTableColumn>
          <ElTableColumn prop="leverage" label="Leverage" min-width="90" #default="{ row }">
            <p class="leverage">{{ row.leverage }}X</p>
          </ElTableColumn>
          <ElTableColumn prop="open" label="Open" min-width="90">
            <template #default="{ row }">
                ${{ (row.open_real_price) }}
              </template>
          </ElTableColumn>
          <ElTableColumn
            prop="profit"
            label="Profit"
            min-width="110"
            #default="{ row }"
          >
            {{ row.profit }}
          </ElTableColumn>
          <!-- <ElTableColumn
            prop="margin"
            label="Magrin"
            min-width="100"
            #default="{ row }"
          >
            {{ row }}
          </ElTableColumn> -->
          <!-- <ElTableColumn
            prop="opentime"
            label="Open Time"
            min-width="150"
            #default="{ row }"
          >
            {{ row }}
          </ElTableColumn> -->
          <ElTableColumn prop="address" label="Action" min-width="120">
            <template #default="{ row, index }">
              <ElButton round class="sty5-btn grey sty6-btn taplight" :loading="row.loading" @click="handleClosePosition(row, index)">
                Close
                </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <ElTable v-if="activeName === 'history'" :data="positionsList" class="sty1-table" style="width: 100%">
          <ElTableColumn prop="orderNum" label="Order Number" min-width="120" #default="{ row }">
            <p class="mui-fl-vert order-num">
              #{{ formatAddress(row.id) }}
            </p>
          </ElTableColumn>
          <ElTableColumn prop="type" label="Type" min-width="90" #default="{ row }">
            <p :class="{ green: row.direction === 'Buy', red: row.direction === 'Sell' }">
              {{ row.direction }}
            </p>
          </ElTableColumn>
          <ElTableColumn prop="size" label="Size" min-width="90" #default="{ row }">
            {{ row.lot }}
          </ElTableColumn>
          <ElTableColumn prop="leverage" label="Leverage" min-width="90" #default="{ row }">
            <p class="leverage">{{ row.leverage }}X</p>
          </ElTableColumn>
          <ElTableColumn prop="closePrice" label="Close Price" min-width="125" #default="{ row }">
            ${{ row.close_price }}
          </ElTableColumn>
          <ElTableColumn prop="profit" label="Profit" min-width="110" #default="{ row }">
            {{ row.profit }}
          </ElTableColumn>
          <ElTableColumn label="Status" min-width="90"> Closed </ElTableColumn>
        </ElTable>
        <div v-if="!address" class="nodata mui-fl-col mui-fl-central">
          <p class="img-nowallet"></p>
          <p>Link wallet to view your positions</p>
        </div>

        <div v-else-if="positionsList.length === 0" class="nodata mui-fl-col mui-fl-central">
          <p class="img-nodata"></p>
          <p>No records</p>
        </div>
      </div>
    </div>
  </div>


  <ElDialog
    title="Close Position"
    v-model="closeDialogVisible"
    custom-class="sty1-dialog"
    append-to-body
    width="386px"
    :before-close="handleDialogClose">
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
    <template #footer>
      <ElButton class="sty5-btn grey" round @click="closeDialogVisible = false">Cancel</ElButton>
      <ElButton type="primary" class="sty5-btn black" rounds>Close</ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss" src="@/assets/css/views/_positions.scss" scoped></style>
