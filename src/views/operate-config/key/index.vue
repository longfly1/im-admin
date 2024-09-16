<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        添加配置
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :remote="false"
      :is-pagination="false"
      :get-data="api.fetchData"
    ></MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
      >
        <n-form-item
          label="key(英文)"
          path="configKey"
          :rule="{
            required: true,
            message: '请输入key',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.configKey" />
        </n-form-item>
        <n-form-item
          label="value"
          path="configValue"
          :rule="{
            required: true,
            message: '请输入value',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.configValue" type="textarea" />
        </n-form-item>
        <n-form-item
          label="备注"
          path="remark"
          :rule="{
            required: true,
            message: '请输入备注',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.remark" />
        </n-form-item>
        <n-form-item
          label="类型"
          path="configType"
          :rule="{
            required: true,
            message: '请选择类型',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select v-model:value="modalForm.configType" clearable :options="types" />
        </n-form-item>
        <n-form-item label="状态" path="enabledFlag">
          <n-switch v-model:value="modalForm.enabledFlag" :checked-value="1" :unchecked-value="2">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <!--      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>-->
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions()

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref()

onMounted(() => {
  $table.value?.handleSearch()
})

const types = [
  { label: '钱包配置', value: 2 },
  { label: 'app版本配置', value: 3 },
  { label: '基础配置', value: 4 },
]

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 50,
    ellipsis: {
      tooltip: true,
    },
  },
  { title: 'key', key: 'configKey' },
  { title: 'value', key: 'configValue' },
  { title: '备注', key: 'remark' },
  {
    title: '类型',
    key: 'configType',
    width: 80,
    defaultFilterOptionValues: [2, 3, 4],
    filterOptions: types,
    filter(value, row) {
      return row.configType == value
    },
    render: ({ configType }) => types.find((item) => configType === item.value)?.label ?? '',
  },
  {
    title: '是否启用',
    key: 'enabledFlag',
    width: 80,
    align: 'center',
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.enabledFlag,
          loading: !!row.enabledFlagLoading,
          onUpdateValue: () => handleEnable(row, 'enabledFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    },
    defaultSortOrder: 'ascend',
    sorter: 'default',
  },
  {
    title: '更新时间',
    key: 'updateTime',
    render(row) {
      return h('span', formatDateTime(row['updateTime']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'right',
    width: 220,
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
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
            style: 'margin-left: 12px;',
            onClick: () => handleDelete([row.id], row.remark),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]
const { modalRef, modalFormRef, modalForm, handleAdd, handleDelete, handleEdit } = useCrud({
  name: '配置',
  initForm: { enabledFlag: 1 },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

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
</script>
