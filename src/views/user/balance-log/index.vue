<template>
  <CommonPage>
    <MeCrud ref="$table" v-model:query-items="queryItems" :columns="columns" :get-data="api.read">
      <MeQueryItem label="关键词搜索">
        <n-input
          v-model:value="queryItems.nickname"
          type="text"
          placeholder="请输入 昵称 / 账号 / ID"
          clearable
        />
      </MeQueryItem>
      <!-- <MeQueryItem label="查询方式">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '单例模式', value: 1 },
            { label: '合并模式', value: 2 },
          ]"
        />
      </MeQueryItem> -->
      <MeQueryItem label="变动类型">
        <n-select v-model:value="queryItems.type" clearable :options="typeOptions" />
      </MeQueryItem>
      <MeQueryItem label="时间范围" content-width="260">
        <n-date-picker v-model:value="queryItems.date" type="datetimerange" clearable />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const typeOptions = [
  { label: '转赠', value: 1 },
  { label: '开启矿场', value: 2 },
  { label: '矿场奖励', value: 3 },
  { label: '矿场收入', value: 4 },
  { label: '游戏消耗', value: 5 },
  { label: '游戏收入', value: 6 },
  { label: '游戏奖励', value: 7 },
]
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  type: '',
})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    title: '支出用户',
    render(row) {
      return [h('span', row.fromMobile), h('p', row.fromNickname)]
    },
  },
  {
    title: '接收用户',
    render(row) {
      return [h('span', row.toMobile), h('p', row.toNickname)]
    },
  },
  {
    title: '变动类型',
    key: 'type',
    render(row) {
      // return h(NTag, {}, typeOptions.find((item) => item.value == row.type).label)
    },
  },
  { title: '变动金额', key: 'commission', width: 150, ellipsis: { tooltip: true } },
  { title: '费率', key: 'rate', width: 150, ellipsis: { tooltip: true } },
  { title: '变动前龙蛋', key: 'beforeBalance', width: 150, ellipsis: { tooltip: true } },
  { title: '变动后龙蛋', key: 'afterBalance', width: 150, ellipsis: { tooltip: true } },
  { title: '说明', key: 'remark', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['createDate']))
    },
  },
]

useCrud({
  name: '龙蛋日志',
  initForm: {},
  refresh: () => $table.value?.handleSearch(),
})
</script>
