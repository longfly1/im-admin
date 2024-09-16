<script setup>
import commonApi from '@/api'

const loading = ref(false)
const config = reactive({
  alibaba_cloud: {},
  alibaba_cloud_sms: {},
})

function getConfig(type) {
  commonApi.getConfig(type).then((result) => {
    config[type] = result.data
  })
}
const update = (type) => {
  loading.value = true
  commonApi
    .batchUpdateValue(config[type])
    .then((result) => {
      $message.success(result.msg)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  // getConfig('alibaba_cloud')
  // getConfig('alibaba_cloud_sms')
})
</script>
<template>
  <n-form
    ref="formRef"
    label-placement="left"
    label-width="130"
    require-mark-placement="right-hanging"
  >
    <n-card :bordered="false" title="Android" content-style="padding-bottom: 0;">
      <n-form-item label="版本号" path="ali_sms_appcode">
        <n-input />
      </n-form-item>
      <n-form-item label="下载地址" path="ali_sms_signId">
        <n-input />
      </n-form-item>
      <n-form-item label="更新说明" path="sms_balance">
        <n-input type="textarea" />
      </n-form-item>
    </n-card>
    <n-card :bordered="false" title="IOS" content-style="padding-bottom: 0;">
      <n-form-item label="版本号" path="ali_sms_appcode">
        <n-input />
      </n-form-item>
      <n-form-item label="下载地址" path="ali_sms_signId">
        <n-input />
      </n-form-item>
      <n-form-item label="更新说明" path="sms_balance">
        <n-input type="textarea" />
      </n-form-item>
      <n-form-item label=" ">
        <n-space>
          <n-button strong secondary type="primary" @click="update('alibaba_cloud')">提交</n-button>
          <n-button strong secondary @click="getConfig('alibaba_cloud')">重置</n-button>
        </n-space>
      </n-form-item>
    </n-card>
  </n-form>
</template>
