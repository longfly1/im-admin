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
      @on-delete="handleDelete"
    >
      <MeQueryItem label="名称">
        <n-input v-model:value="queryItems.name" type="text" placeholder="请输入名称" clearable />
      </MeQueryItem>

      <MeQueryItem label="状态">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '隐藏', value: 2 },
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
          label="名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item label="状态">
          <n-switch v-model:value="modalForm.status" :checked-value="1" :unchecked-value="2">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag, NSpace, NFlex } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'GroupList' })

const router = useRouter()

const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

const { modalRef, modalFormRef, modalForm, handleAdd, handleDelete, handleEdit } = useCrud({
  name: '表情分类',
  initForm: { status: 1 },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    fixed: 'left',
    type: 'selection',
  },
  {
    fixed: 'left',
    title: 'ID',
    key: 'id',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '名称',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.status,
          loading: !!row.statusLoading,
          onUpdateValue: () => handleEnable(row, 'status'),
        },
        {
          checked: () => '启用',
          unchecked: () => '隐藏',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatDateTime(row.createTime),
    sortOrder: 'createTime',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 300,
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
                  path: `/emoji/list`,
                  query: {
                    id: row.id,
                    name: row.name,
                  },
                }),
            },
            {
              default: () => '查看详情',
              icon: () => h('i', { class: 'i-fe:list text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete([row.id]),
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

async function handleEnable(row, key) {
  row[key + 'Loading'] = true
  try {
    let temp = {}
    temp[key] = row[key] == 1 ? 2 : 1
    await api.update({ ...{ id: row.id }, ...temp })
    Object.assign(row, temp)
    row[key + 'Loading'] = false
    $message.success('操作成功')
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
