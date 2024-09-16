<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建分类
      </n-button>
    </template>

    <MeCrud ref="$table" :columns="columns" :get-data="api.fetchData"></MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="标题"
          path="title"
          :rule="{
            required: true,
            message: '请输入分类名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" />
        </n-form-item>
        <n-form-item
          label="排序"
          path="sort"
          :rule="{
            required: true,
            message: '请输入排序',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-input v-model:value="modalForm.sort" placeholder="请输入排序" />
        </n-form-item>
        <n-form-item label="状态">
          <n-switch v-model:value="modalForm.status" checked-value="1" unchecked-value="0">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch, NTag, NSpace } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserList' })

const $table = ref(null)

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleEdit, handleSave } =
  useCrud({
    name: '用户',
    initForm: {
      status: '1',
      sort: 0,
    },
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    refresh: () => $table.value?.handleSearch(),
  })

onMounted(() => {
  $table.value?.handleSearch()
})
const columns = [
  {
    title: '标题',
    render: ({ title }) => h('span', title),
  },
  { title: '排序', key: 'sort' },
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
          checkedValue: '1',
          uncheckedValue: '0',
          value: row.status,
          loading: !!row.statusLoading,
          onUpdateValue: () => handleEnable(row, 'status'),
        },
        {
          checked: () => '显示',
          unchecked: () => '隐藏',
        }
      ),
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
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
              secondary: true,
              onClick: () => handleEdit(row),
            },
            {
              default: () => '编辑',
              icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
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
    temp[key] = row[key] == '1' ? '0' : '1'
    await api.update({ ...{ id: row.id }, ...temp })
    Object.assign(row, temp)
    row[key + 'Loading'] = false
    $message.success('操作成功')
  } catch (error) {
    row[key + 'Loading'] = false
  }
}
</script>
