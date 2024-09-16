<template>
  <AppCard v-if="$slots.default" bordered bg="#fafafc dark:black" class="mb-30 min-h-60 rounded-4">
    <form class="flex justify-between p-16" @submit.prevent="handleSearch()">
      <n-space wrap :size="[32, 16]">
        <slot />
      </n-space>
      <div class="flex-shrink-0">
        <n-button ghost type="primary" @click="handleReset">
          <i class="i-fe:rotate-ccw mr-4" />
          重置
        </n-button>
        <n-button attr-type="submit" class="ml-20" type="primary">
          <i class="i-fe:search mr-4" />
          搜索
        </n-button>
      </div>
    </form>
  </AppCard>

  <n-data-table
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columns"
    :data="tableData"
    :row-key="(row) => row[rowKey]"
    :pagination="isPagination ? pagination : false"
    :checked-row-keys="rowKeysData"
    @update:sorter="handleUpdateSorter"
    @update:filters="handleUpdateFilter"
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
    @update:page-size="onPageSizeChange"
  />
  <div v-if="columns.some((item) => item.type === 'selection')" class="-mt-30">
    <n-button type="error" size="small" :disabled="rowKeysData.length == 0" @click="handleDelete">
      批量删除
    </n-button>
  </div>
</template>

<script setup>
import { NDataTable } from 'naive-ui'
import { ref } from 'vue'
import { utils, writeFile } from 'xlsx'

const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /**
   * ! 约定接口入参出参
   * * 分页模式需约定分页接口入参
   *    @pageSize 分页参数：一页展示多少条，默认10
   *    @pageNum   分页参数：页码，默认1
   * * 需约定接口出参
   *    @pageData 分页模式必须,非分页模式如果没有pageData则取上一层data
   *    @total    分页模式必须，非分页模式如果没有total则取上一层data.length
   */
  getData: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange', 'onDelete'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const rowKeysData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30, 50],
  prefix({ itemCount }) {
    return `共计 ${itemCount} 条`
  },
})

async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数
    if (props.isPagination && props.remote) {
      paginationParams = { pageNum: pagination.page, pageSize: pagination.pageSize }
    }
    const { data } = await props.getData({
      ...props.queryItems,
      ...paginationParams,
    })
    tableData.value = data?.list || data
    pagination.itemCount = data.total
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}
function handleSearch(data) {
  if (!data) {
    pagination.page = 1
  }
  handleQuery()
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}
function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onPageSizeChange(pageSize) {
  pagination.pageSize = pageSize
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  if (props.columns.some((item) => item.type === 'selection')) {
    rowKeysData.value = rowKeys
    emit('onChecked', rowKeys)
  }
}
function handleExport(columns = props.columns, data = tableData.value) {
  if (!data?.length) return $message.warning('没有数据')
  const columnsData = columns.filter((item) => !!item.title && !item.hideInExcel)
  const thKeys = columnsData.map((item) => item.key)
  const thData = columnsData.map((item) => item.title)
  const trData = data.map((item) => thKeys.map((key) => item[key]))
  const sheet = utils.aoa_to_sheet([thData, ...trData])
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, sheet, '数据报表')
  writeFile(workBook, '数据报表.xlsx')
}
function handleDelete() {
  emit('onDelete', rowKeysData.value)
  clearKeys()
}

function clearKeys() {
  rowKeysData.value = []
}

// 处理排序变化的回调函数
function handleUpdateSorter(sorters) {
  if (typeof sorters.sorter == 'function') {
    sorters.sorter(sorters)
  }
}

function handleUpdateFilter(filters, sourceColumn) {
  if (typeof sourceColumn.filterCustom == 'function') {
    sourceColumn.filterCustom(filters)
  }
}
// function handleSortChange({ prop, order }) {
//   // prop 是当前排序的字段名，order 是排序顺序（'ascending' 或 'descending'）
//   // 这里可以根据 prop 和 order 做相应的处理
//   console.log('排序字段：', prop)
//   console.log('排序顺序：', order)

//   // 可以在这里更新 tableData，实现自定义的排序逻辑或者其他操作
//   // 例如根据 prop 排序 tableData
//   // tableData.value.sort((a, b) => {
//   //   if (order === 'ascending') {
//   //     return a[prop] - b[prop] // 升序排序
//   //   } else {
//   //     return b[prop] - a[prop] // 降序排序
//   //   }
//   // })
// }
defineExpose({
  handleSearch,
  handleReset,
  handleExport,
  handleDelete,
  clearKeys,
  tableData,
  rowKeysData,
})
</script>
