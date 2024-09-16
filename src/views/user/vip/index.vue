<template>
  <CommonPage>
    <template #action>
      <n-space>
        <n-button type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" />
          创建新等级
        </n-button>
      </n-space>
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
        :label-width="120"
        :model="modalForm"
      >
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="封面图"
          path="icon"
          :rule="{
            required: true,
            message: '请上传封面图',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.icon"></CustomUpload>
        </n-form-item>
        <n-form-item
          label="名称"
          path="name"
          :rule="{
            valit: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="等级"
          path="level"
          :rule="{
            required: true,
            message: '请选择等级',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="modalForm.level"
            clearable
            :options="[
              { label: '0', value: '0' },
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
            ]"
          />
        </n-form-item>
        <n-form-item label="价格" path="price">
          <n-input v-model:value="modalForm.price" placeholder="请输入价格" />
        </n-form-item>
        <n-form-item label="好友上限" path="friendLimit">
          <n-input v-model:value="modalForm.friendLimit" placeholder="请输入好友上限" />
        </n-form-item>
        <n-form-item label="群上限" path="groupLimit">
          <n-input v-model:value="modalForm.groupLimit" placeholder="请输入群上限" />
        </n-form-item>
        <n-form-item label="群成员上限" path="groupMemberLimit">
          <n-input
            v-model:value="modalForm.groupMemberLimit"
            type="number"
            placeholder="请输入群成员上限"
          />
        </n-form-item>
        <n-form-item label="提现手续费" path="withholdFee">
          <n-input
            v-model:value="modalForm.withholdFee"
            type="number"
            placeholder="请输入提现手续费"
          />
        </n-form-item>
        <!-- <n-form-item
          label="每日提现上限"
          path="groupMemberLimit"
          :rule="{
            required: true,
            message: '请输入每日提现上限',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-input v-model:value="modalForm.groupMemberLimit" placeholder="请输入每日提现上限" />
        </n-form-item> -->
        <n-form-item label="状态">
          <n-switch v-model:value="modalForm.status" :checked-value="1" :unchecked-value="2">
            <template #checked>显示</template>
            <template #unchecked>隐藏</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NImage, NSpace, NSelect, NSwitch } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'WithholdList' })

const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

const isEmptyValue = (value) => !value || value.trim() === ''

const commonValidator = (rule, value) => {
  if (isEmptyValue(value)) {
    return new Error('请输入')
  }
  return true
}

const rules = {
  price: [{ required: true, validator: commonValidator, trigger: ['input', 'blur'] }],
  friendLimit: [{ required: true, validator: commonValidator, trigger: ['input', 'blur'] }],
  groupLimit: [{ required: true, validator: commonValidator, trigger: ['input', 'blur'] }],
  groupMemberLimit: [{ required: true, validator: commonValidator, trigger: ['input', 'blur'] }],
  withholdFee: [{ required: true, validator: commonValidator, trigger: ['input', 'blur'] }],
}

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleEdit } = useCrud({
  name: '等级',
  initForm: { status: 1 },
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

onMounted(() => {
  $table.value?.handleSearch()
})

// table
const columns = [
  {
    fixed: 'left',
    title: 'ID',
    key: 'id',
  },
  {
    title: '封面',
    width: 80,
    render: ({ icon }) =>
      h(NImage, {
        height: '30',
        src: icon,
      }),
  },
  {
    title: '名称',
    key: 'name',
    fixed: 'left',
  },
  { title: '等级', key: 'level', defaultSortOrder: 'ascend', sorter: 'default' },
  { title: '价格', key: 'price' },
  { title: '好友上限', key: 'friendLimit' },
  { title: '群上限', key: 'groupLimit' },
  { title: '群成员上限', key: 'groupMemberLimit' },
  { title: '提现手续费', key: 'withholdFee' },
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
          checked: () => '显示',
          unchecked: () => '隐藏',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatDateTime(row.createTime),
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
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
              default: () => '查看详情',
              icon: () => h('i', { class: 'i-fe:edit text-14' }),
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
    row.isEdit = false
    $message.success('操作成功')
  } catch (error) {
    row[key + 'Loading'] = false
  }
}
</script>
