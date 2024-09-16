<template>
  <CommonPage back>
    <template #title-suffix>
      <n-tag class="ml-12" type="warning">{{ route.query.name }}</n-tag>
    </template>
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
          创建新表情
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
        <n-input v-model:value="queryItems.title" type="text" placeholder="请输入名称" clearable />
      </MeQueryItem>

      <MeQueryItem label="类型">
        <n-select
          v-model:value="queryItems.type"
          clearable
          :options="[
            { label: '静图/GIF', value: 1 },
            { label: 'SVG', value: 2 },
            { label: 'lottie', value: 3 },
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
          label="类型"
          path="type"
          :rule="{
            required: true,
            message: '请选择类型',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select
            v-model:value="modalForm.type"
            clearable
            :options="[
              { label: '静图/GIF', value: 1 },
              { label: 'SVG', value: 2 },
              { label: 'Lottie', value: 3 },
            ]"
          />
        </n-form-item>
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
        <n-form-item
          label="表情图片"
          path="imgUrl"
          :rule="{
            required: true,
            message: '请上传表情图片',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.imgUrl"></CustomUpload>
        </n-form-item>
        <n-form-item label="状态">
          <n-switch v-model:value="modalForm.status" :checked-value="1" :unchecked-value="2">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NImage, NButton, NSwitch, NTag, NSpace } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'GroupList' })

const route = useRoute()

const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

const { modalRef, modalFormRef, modalForm, handleAdd, handleDelete, handleEdit } = useCrud({
  name: '表情',
  initForm: { status: 1, eid: route.query.id },
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
  },
  {
    title: '表情',
    width: 60,
    key: 'avatar',
    align: 'center',
    fixed: 'left',
    render: ({ imgUrl }) =>
      h(NImage, {
        size: 'medium',
        src: imgUrl,
      }),
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
    width: 230,
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
