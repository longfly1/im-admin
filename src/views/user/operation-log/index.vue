

<template>
  <CommonPage>


    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="手机号" :label-width="50">
        <n-input
          v-model:value="queryItems.mobile"
          type="text"
          placeholder="请输入手机号"
          clearable
        />
      </MeQueryItem>

    </MeCrud>


  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})



const columns = [

  { title: '手机号', key: 'mobile', width: 100 },
  { title: '行为', key: 'type', width: 100, },
  { title: 'IP', key: 'ip', width: 100},
  {
    title: '时间',
    key: 'createDate',
    width: 100,
  },
]


const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
} = useCrud({
  name: '用户',
  initForm: { status: '0' },
  refresh: () => $table.value?.handleSearch(),
})


</script>
