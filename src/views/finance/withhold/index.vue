<template>
  <CommonPage>
    <template #action>
      <!-- <n-space>
        <n-button type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" />
          创建新用户
        </n-button>
      </n-space> -->
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :scroll-x="1800"
      :get-data="api.fetchData"
    >
      <MeQueryItem label="手机号">
        <n-input
          v-model:value="queryItems.phone"
          type="text"
          placeholder="请输入手机号"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="用户昵称">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入用户昵称"
          clearable
        />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NButton, NTag, NSpace, NSelect } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'WithholdList' })

const { copy, copied } = useClipboard()
const isEdit = ref(false)
const keyworld = ref('')
const $table = ref(null)
const statusList = [
  {
    value: 1,
    label: '待确认',
    type: 'info',
  },
  {
    value: 2,
    label: '完成',
    type: 'success',
  },
  {
    value: 3,
    label: '取消',
    type: '',
  },
  {
    value: 4,
    label: '超时',
    type: 'warning',
  },
  {
    value: 5,
    label: '失败',
    type: 'error',
  },
  {
    value: 6,
    label: '拒绝',
    type: 'error',
  },
]

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

useCrud({
  name: '提现',
  initForm: {},
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

watch(copied, (val) => {
  val && $message.success('已复制到剪切板')
})
// 修改龙蛋数量 end
onMounted(() => {
  $table.value?.handleSearch()

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(event) {
  keyworld.value = `${keyworld.value}${event.key}`
  if (event.key === 'Enter') {
    if (keyworld.value.includes('123456')) {
      keyworld.value = ''
      isEdit.value = true
    }
  }
}
// 用户table
const columns = [
  {
    fixed: 'left',
    title: 'ID',
    key: 'id',
  },
  {
    title: '昵称',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '手机号',
    key: 'phone',
    render: ({ phone }) =>
      h(
        NButton,
        {
          text: true,
          quaternary: true,
          type: 'info',
          onClick: () => copy(phone),
        },
        phone
      ),
  },
  { title: '交易地址', key: 'address' },
  {
    title: '交易金额',
    key: 'amount',
    sortOrder: 'amount',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  { title: '应到账', key: 'dueAmount' },
  { title: '实际到账', key: 'actualAmount' },
  { title: '手续费', key: 'fee' },
  {
    title: '状态',
    key: 'status',
    render: (row) =>
      !row.isEdit
        ? h(
            NTag,
            {
              type: statusList.find((item) => item.value == row.status).type,
            },
            statusList.find((item) => item.value == row.status).label
          )
        : h(
            NSelect,
            {
              options: statusList,
              value: row.status,
              loading: !!row.statusLoading,
              onUpdateValue: (val) => handleEnable(row, 'status', val),
            },
            statusList.find((item) => item.value == row.status).label
          ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatDateTime(row.createTime),
  },
  {
    title: '完成/超时时间',
    key: 'bizCompleteTime',
    render: (row) => formatDateTime(row.bizCompleteTime),
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render: (row) =>
      row.status == 1 &&
      h(
        NSpace,
        {
          justify: 'center',
        },
        [
          !row.isEdit &&
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                secondary: true,
                onClick: () => {
                  // $tableTemp.value[row.id] = row
                  row.isEdit = true
                  // modalAction.value = 'edit'
                  // modalForm.value.id = row.id
                  // modalForm.value.status = 2
                  // handleSave()
                },
              },
              {
                default: () => '编辑',
              }
            ),
          row.isEdit &&
            h(
              NButton,
              {
                size: 'small',
                type: 'info',
                onClick: () => {
                  row.isEdit = false
                  // modalAction.value = 'edit'
                  // modalForm.value.id = row.id
                  // modalForm.value.status = 6
                  // handleSave()
                },
              },
              {
                default: () => '完成',
              }
            ),
        ]
      ),
  },
]

async function handleEnable(row, key, val) {
  row[key + 'Loading'] = true
  try {
    let temp = {}
    temp[key] = val
    await api.update({ ...{ id: row.id }, ...temp })
    Object.assign(row, temp)
    row[key + 'Loading'] = false
    row.isEdit = false
    $message.success('操作成功')
    $table.value?.handleSearch(true)
  } catch (error) {
    row[key + 'Loading'] = false
  }
}

function tableSorterSearch(sorter) {
  queryItems.value['sortField'] = sorter.columnKey
  queryItems.value['sortType'] = sorter.order == false ? 'desc' : sorter.order
  $table.value?.handleSearch()
}
</script>
