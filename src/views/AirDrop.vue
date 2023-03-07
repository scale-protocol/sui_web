<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
import type { FormInstance, FormRules } from 'element-plus'
import { CONIN_RESERVE, CONIN_PACKAGE_OBJECTID } from '@/utils/token'
import { getTokenObjectIds, formatTenDecimalNum } from '@/utils/filter'

const store = useStore()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  amount: ''
})
const rules = reactive<FormRules>({
  amount: [
    { required: true, message: 'Please enter amount!', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!store.state.wallet) return
  
  const suiObjectIds = getTokenObjectIds(store.state.balanceList, 'SUI')
  const amount = (new BigNumber(ruleForm.amount).times(formatTenDecimalNum(6))).toString(10)
  
  const rp = await store.state.wallet.signAndExecuteTransaction({
    kind: "moveCall",
    data: {
      packageObjectId: CONIN_PACKAGE_OBJECTID,
      module: "scale",
      function: "airdrop",
      typeArguments: [],
      arguments: [
        CONIN_RESERVE,
        suiObjectIds.slice(0, suiObjectIds.length - 2), // Object id, 字符串
        amount
      ],
      gasBudget: 10000,
    },
  });
  if (rp.effects.status.status === 'success') {
    ElMessage({
      message: 'Airdrop successful!',
      type: 'success'
    })
  }
}
</script>

<template>
  <div class="mui-fl-central">
    <div class="pg-gettoken">
      <p class="title">AirDrop</p>
      <ElForm
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        size="large"
        class="sty1-form"
        @submit.prevent>
        <ElFormItem label="Scale Amount" prop="amount">
          <ElInput v-model="ruleForm.amount" placeholder="Please enter amount!"></ElInput>
        </ElFormItem>
        <div class="signup mui-flex">
          <ElButton type="primary" class="mui-fl-1" round size="large" native-type="submit" @click="submitForm(ruleFormRef)">Sign up</ElButton>
        </div>
      </ElForm>
    </div>
  </div>
</template>


<style
  lang="scss"
  scoped
  src="@/assets/css/views/gettoken.scss"
></style>
