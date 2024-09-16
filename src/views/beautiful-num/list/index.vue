<template>
  <CommonPage back :title="route.query.name">
    <template #title-suffix>
      <n-tag v-if="route.query.type == 1" class="ml-12" type="primary">群</n-tag>
      <n-tag v-else class="ml-12" type="info">个人</n-tag>
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
          创建新靓号
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
      <MeQueryItem label="靓号">
        <n-input v-model:value="queryItems.liang" type="text" placeholder="请输入靓号" clearable />
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
          label="靓号"
          path="liang"
          :rule="{
            required: true,
            message: '请输入靓号',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-input v-model:value="modalForm.liang" :disabled="modalAction == 'setUse'" />
        </n-form-item>
        <n-form-item
          v-if="['setUse'].includes(modalAction)"
          :label="route.query.type == 1 ? '群ID' : '用户ID'"
          path="bizId"
          :rule="{
            required: true,
            message: '请输入ID',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select
            v-if="route.query.type == 1"
            v-model:value="modalForm.bizId"
            filterable
            placeholder="可搜索"
            :options="groupOptions"
            :loading="groupLoading"
            :render-label="renderGroupLabel"
            value-field="id"
            clearable
            remote
            @search="groupHandleSearch"
          />
          <n-select
            v-else
            v-model:value="modalForm.bizId"
            filterable
            placeholder="可搜索"
            :options="userOptions"
            :loading="userLoading"
            :render-label="renderUserLabel"
            value-field="id"
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>
        <!-- <n-form-item
          label="靓号归属类型"
          path="groupType"
          :rule="{
            required: true,
            message: '请选择靓号归属类型',
            trigger: ['change'],
          }"
        >
          <n-radio-group v-model:value="modalForm.type" name="type">
            <n-space>
              <n-radio value="1">群</n-radio>
              <n-radio value="2">个人</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item> -->
        <!-- <n-form-item
          v-if="['add'].includes(modalAction)"
          label="群主ID"
          path="groupUId"
          :rule="{
            required: true,
            message: '请输入群主ID',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select
            v-model:value="modalForm.groupUId"
            filterable
            placeholder="可搜索"
            :options="userOptions"
            :loading="userLoading"
            :render-label="renderUserLabel"
            value-field="id"
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>
        <n-form-item
          v-if="['edit'].includes(modalAction)"
          label="头像"
          path="avatar"
          :rule="{
            required: true,
            message: '请上传头像',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>
        <n-form-item
          v-if="['edit'].includes(modalAction)"
          label="公告"
          path="notice"
          :rule="{
            required: true,
            message: '请输入公告',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.notice" type="textarea" />
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="公告时间">
          {{ formatDateTime(modalForm.noticeTime) }}
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="修改群名">
          <n-switch
            v-model:value="modalForm.changeNameFlag"
            :checked-value="1"
            :unchecked-value="2"
          >
            <template #checked>仅管理</template>
            <template #unchecked>全员</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="是否禁言">
          <n-switch v-model:value="modalForm.forbiddenFlag" :checked-value="1" :unchecked-value="2">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="是否禁止加入">
          <n-switch v-model:value="modalForm.friendFlag" :checked-value="1" :unchecked-value="2">
            <template #checked>禁止</template>
            <template #unchecked>允许</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="是否进群审核">
          <n-switch v-model:value="modalForm.reviewFlag" :checked-value="1" :unchecked-value="2">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item> -->
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
import apiUser from '../../user/list/api'
import apiGroup from '../../group/list/api'

defineOptions({ name: 'GroupList' })

const route = useRoute()

const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({
  nameId: route.query.id,
  sortField: 'createTime',
  sortType: 'desc',
  op: { nameId: 'eq' },
})

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleEdit,
  handleOpen,
  handleSave,
} = useCrud({
  name: '靓号',
  initForm: {
    type: route.query.type,
    nameId: route.query.id,
  },
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
    title: '靓号',
    key: 'liang',
    fixed: 'left',
  },
  {
    title: '状态',
    render: ({ status }) =>
      h(
        NTag,
        {
          type: status == 0 ? '' : status == 1 ? 'primary' : 'info',
        },
        status == 0 ? '未使用' : status == 1 ? '推荐' : '已使用'
      ),
  },
  {
    title: '群/用户信息',
    key: 'avatar',
    align: 'center',
    fixed: 'left',
    render: ({ bizId, bizName, bizAvatar }) =>
      bizId
        ? [
            h(NAvatar, {
              size: 'medium',
              src: bizAvatar,
            }),
            bizName,
          ]
        : '--',
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
              type: 'info',
              onClick: () =>
                handleOpen({
                  action: 'setUse',
                  title: '设置归属',
                  row,
                  onOk: onSave,
                }),
            },
            {
              default: () => '设置归属',
              icon: () => h('i', { class: 'i-fe:user text-14' }),
            }
          ),
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

// 用户查找
const userOptions = ref()
const userLoading = ref(false)
function userHandleSearch(query = '') {
  console.log(query)

  userLoading.value = true
  apiUser
    .fetchData({
      pageNum: 1,
      pageSize: 30,
      id: query,
      // name: query,
      // phone: query,
      userRole: '1,2',
      op: { userRole: 'in', id: 'eq' },
    })
    .then((res) => {
      // res.data.list.forEach((item) => {
      //   item.disabled = item.realStock == 0
      // })
      userOptions.value = res.data.list
      userLoading.value = false
    })
}
function renderUserLabel(option) {
  return h(
    NFlex,
    {
      justify: 'space-between',
    },
    [h('span', option.id), h('span', option.name), h('span', option.phone)]
  )
}

// 群查找
const groupOptions = ref()
const groupLoading = ref(false)
function groupHandleSearch(query = '') {
  groupLoading.value = true
  apiGroup
    .fetchData({
      pageNum: 1,
      pageSize: 30,
      id: query,
      // name: query,
      // phone: query,
      // groupRole: 2,
      sortField: 'createTime',
      sortType: 'desc',
      op: { groupRole: 'eq' },
    })
    .then((res) => {
      // res.data.list.forEach((item) => {
      //   item.disabled = item.realStock == 0
      // })
      groupOptions.value = res.data.list
      groupLoading.value = false
    })
}
function renderGroupLabel(option) {
  return h(
    NFlex,
    {
      justify: 'space-between',
    },
    [h('span', option.id), h('span', option.name), h('span', option.phone)]
  )
}

function onSave() {
  if (modalAction.value === 'setUse') {
    return handleSave({
      api: () => api.setUse(modalForm.value),
      cb: () => $message.success('修改成功'),
    })
  }
  handleSave()
}
function tableSorterSearch(sorter) {
  queryItems.value['sortField'] = sorter.columnKey
  queryItems.value['sortType'] = sorter.order == false ? 'desc' : sorter.order
  $table.value?.handleSearch()
}
</script>
