<template>
  <CommonPage>
    <template #action>
      <n-space>
        <n-button
          type="error"
          :disabled="$table?.rowKeysData?.length == 0"
          @click="handleDelete($table.rowKeysData), $table.clearKeys()"
        >
          <i class="i-material-symbols:delete-outline mr-4 text-18" />
          批量删除
        </n-button>
      </n-space>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.fetchData"
      @on-delete="handleDelete"
    ></MeCrud>
  </CommonPage>
</template>

<script setup>
import { NButton, NImageGroup, NImage, NSpace, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'FeedbackList' })

const $table = ref(null)
const typeList = [
  {
    value: 1,
    label: '建议',
    type: 'info',
  },
  {
    value: 2,
    label: '错误',
    type: 'error',
  },
  {
    value: 3,
    label: '其他',
    type: 'primary',
  },
]

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

const { handleDelete } = useCrud({
  name: '意见反馈',
  initForm: {},
  doDelete: api.delete,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

onMounted(() => {
  $table.value?.handleSearch()
})

// table
const columns = [
  {
    fixed: 'left',
    type: 'selection',
  },
  {
    fixed: 'left',
    title: 'ID',
    key: 'id',
  },
  {
    fixed: 'left',
    title: 'UID',
    key: 'uid',
  },
  {
    title: '名称',
    key: 'name',
    fixed: 'left',
  },
  { title: '账号', key: 'phone' },
  { title: '内容', key: 'content', ellipsis: { tooltip: true } },
  {
    title: '图片',
    width: 80,
    render: ({ images }) =>
      h(NImageGroup, {}, () =>
        images.map((item) =>
          h(NImage, {
            height: 50,
            src: item.url,
          })
        )
      ),
  },
  {
    title: '类型',
    key: 'type',
    render: (row) =>
      h(
        NTag,
        {
          type: typeList.find((item) => item.value == row.type).type,
        },
        typeList.find((item) => item.value == row.type).label
      ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatDateTime(row.createTime),
  },
  // {
  //   title: '操作',
  //   key: 'actions',
  //   align: 'center',
  //   fixed: 'right',
  //   render: (row) =>
  //     h(
  //       NSpace,
  //       {
  //         justify: 'center',
  //       },
  //       [
  //         h(
  //           NButton,
  //           {
  //             size: 'small',
  //             type: 'primary',
  //             secondary: true,
  //             onClick: () => handleEdit(row),
  //           },
  //           {
  //             default: () => '查看详情',
  //             icon: () => h('i', { class: 'i-fe:edit text-14' }),
  //           }
  //         ),
  //       ]
  //     ),
  // },
]
</script>
