<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        添加页面
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
          label="图标"
          path="icon"
          :rule="{
            required: true,
            message: '请上传图标',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.icon"></CustomUpload>
        </n-form-item>
        <n-form-item
          label="名称"
          path="title"
          :rule="{
            required: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" />
        </n-form-item>
        <n-form-item
          label="分组"
          path="group"
          :rule="{
            required: true,
            message: '请输入分组',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.group" />
        </n-form-item>
        <n-form-item
          label="类型"
          path="type"
          :rule="{
            required: true,
            message: '请输入类型',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-radio-group v-model:value="modalForm.type" name="changePwdType">
            <n-space>
              <n-radio :value="1">内链</n-radio>
              <n-radio :value="2">外链</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="跳转地址"
          path="link"
          :rule="{
            required: true,
            message: '请输入跳转地址',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.link" />
        </n-form-item>
        <n-form-item
          label="排序"
          path="sort"
          :rule="{
            required: true,
            message: '请输入排序',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.sort" />
        </n-form-item>
        <n-form-item
          label="状态"
          path="status"
          :rule="{
            required: true,
            message: '请选择状态',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-radio-group v-model:value="modalForm.status" name="changePwdType">
            <n-space>
              <n-radio :value="1">启用</n-radio>
              <n-radio :value="2">隐藏</n-radio>
              <!-- <n-radio :value="3">开发中</n-radio> -->
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch, NAvatar } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    fixed: 'left',
    title: 'ID',
    key: 'uid',
    width: 70,
    ellipsis: {
      tooltip: true,
    },
  },
  { title: 'key', key: 'configKey' },
  {
    title: '头像',
    width: 60,
    align: 'center',
    fixed: 'left',
    key: 'icon',
    render: ({ icon }) =>
      h(NAvatar, {
        size: 'medium',
        src: icon,
      }),
  },
  { title: '名称', key: 'title' },
  { title: '备注', key: 'remark' },
  {
    title: '状态',
    key: 'status',
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
          value: row.status,
          loading: !!row.statusLoading,
          onUpdateValue: () => handleEnable(row, 'status'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  // {
  //   title: '创建时间',
  //   key: 'createTime',
  //   render(row) {
  //     return h('span', formatDateTime(row['createTime']))
  //   },
  // },
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
  name: '页面',
  initForm: { type: 1, status: 1 },
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
