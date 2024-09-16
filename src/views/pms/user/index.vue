<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新用户
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    />

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="账号"
          path="account"
          :rule="{
            required: true,
            message: '请输入账号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.account" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? '重置密码' : '初始密码'"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password">
            <template #suffix>
              <i class="i-fe:refresh-ccw cursor-pointer" @click="handleGetPassword()" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="角色" path="role">
          <n-select v-model:value="modalForm.role" :options="roles" clearable filterable />
        </n-form-item>
      </n-form>
      <!--      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>-->
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime, generateRandomPassword } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc' })

onMounted(() => {
  $table.value?.handleSearch()
})

/*const genders = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]*/
const roles = ref([
  { label: '超级管理员', value: 'admin' },
  { label: '普通管理员', value: 'manager' },
])
// api.getAllRoles().then((data) => {
//   roles.value = data.roles
// })

const columns = [
  /*  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },*/
  { title: '账号', key: 'account', width: 150, ellipsis: { tooltip: true } },
  {
    title: '角色',
    key: 'role',
    width: 200,
    ellipsis: { tooltip: true },
    render: ({ role }) =>
      h(
        NTag,
        { type: 'success' },
        { default: () => roles.value.find((item) => item.value == role).label }
      ),
  },
  /*  {
    title: '性别',
    key: 'sex',
    width: 80,
    render: ({ gender }) => genders.find((item) => gender === item.value)?.label ?? '',
  },*/
  // { title: '手机号', key: 'phonenumber', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    },
  },
  // {
  //   title: '状态',
  //   key: 'status',
  //   width: 120,
  //   render: (row) =>
  //     h(
  //       NSwitch,
  //       {
  //         size: 'small',
  //         rubberBand: false,
  //         value: row.status === '0',
  //         loading: !!row.enableLoading,
  //         onUpdateValue: () => handleEnable(row),
  //       },
  //       {
  //         checked: () => '启用',
  //         unchecked: () => '停用',
  //       }
  //     ),
  // },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleOpen({ action: 'setRole', title: '修改角色', row, onOk: onSave }),
          },
          {
            default: () => '修改角色',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: '重置密码', row, onOk: onSave }),
          },
          {
            default: () => '重置密码',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.userId),
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

// async function handleEnable(row) {
//   row.enableLoading = true
//   try {
//     await api.updateStatus({ userId: row.userId, status: row.status == '1' ? '0' : '1' })
//     row.enableLoading = false
//     $message.success('操作成功')
//     $table.value?.handleSearch()
//   } catch (error) {
//     row.enableLoading = false
//   }
// }
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: '用户',
  initForm: { status: '0' },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  } else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}

function handleGetPassword() {
  modalForm.value.password = generateRandomPassword()
}
</script>
