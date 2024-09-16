<template>
  <CommonPage>
    <template #action>
      <n-space>
        <n-button type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" />
          创建新分类
        </n-button>
      </n-space>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.fetchData"
    >
      <MeQueryItem label="名称">
        <n-input v-model:value="queryItems.name" type="text" placeholder="请输入名称" clearable />
      </MeQueryItem>

      <MeQueryItem label="类型">
        <n-select
          v-model:value="queryItems.type"
          clearable
          :options="[
            { label: '群', value: 1 },
            { label: '个人', value: 2 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
      >
        <n-form-item
          label="分类"
          path="name"
          :rule="{
            required: true,
            message: '请输入分类',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="归属类型"
          path="type"
          :rule="{
            required: true,
            message: '请选择归属类型',
            trigger: ['change'],
            type: 'number',
          }"
        >
          <n-radio-group v-model:value="modalForm.type" name="type">
            <n-space>
              <n-radio :value="1">群</n-radio>
              <n-radio :value="2">个人</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NTag, NSpace } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'GroupList' })

const router = useRouter()

const isEdit = ref(false)
const keyworld = ref('')
const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({
  sortField: 'createTime',
  sortType: 'desc',
})

const { modalRef, modalFormRef, modalForm, handleAdd, handleDelete, handleEdit } = useCrud({
  name: '分类',
  initForm: {
    type: 1,
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
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
const columns = [
  {
    title: '分类',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    render: ({ type }) =>
      h(
        NTag,
        {
          type: type == 1 ? 'primary' : 'info',
        },
        type == 1 ? '群' : '个人'
      ),
  },
  {
    title: '更新时间',
    key: 'updateTime',
    render: (row) => formatDateTime(row.updateTime),
    sortOrder: 'updateTime',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 280,
    render: (row) =>
      h(
        NSpace,
        {
          justify: 'center',
        },
        [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleEdit(row),
            },
            {
              default: () => '编辑',
              icon: () => h('i', { class: 'i-fe:edit text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () =>
                router.push({
                  path: `/beautiful-num/list`,
                  query: {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                  },
                }),
            },
            {
              default: () => '查看',
              icon: () => h('i', { class: 'i-fe:list text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row.id),
            },
            {
              default: () => '删除',
              icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
            }
          ),
        ]
      ),
  },
]
function tableSorterSearch(sorter) {
  queryItems.value['sortField'] = sorter.columnKey
  queryItems.value['sortType'] = sorter.order == false ? 'desc' : sorter.order
  $table.value?.handleSearch()
}
</script>
