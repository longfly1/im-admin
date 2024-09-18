<template>
  <CommonPage back :title="route.query.roomName">
    <template #title-suffix>
      <n-tag class="ml-12" type="warning">管理员: {{ route.query.admin }}</n-tag>
      <n-tag v-if="route.query.groupCard" class="ml-12" type="info">
        ID: {{ route.query.groupCard }}
      </n-tag>
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
        <n-button type="info" @click="handleAddOther()">
          <i class="i-fe:users mr-4 text-18" />
          添加僵尸号
        </n-button>
        <n-button type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" />
          添加用户
        </n-button>
      </n-space>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2200"
      :columns="columns"
      :get-data="api.fetchData"
      @on-delete="handleDelete"
    >
      <MeQueryItem label="手机号">
        <n-input
          v-model:value="queryItems.phone"
          type="text"
          placeholder="请输入手机号"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="用户昵称">
        <n-input
          v-model:value="queryItems.originNick"
          type="text"
          placeholder="请输入用户昵称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="用户类型">
        <n-select
          v-model:value="queryItems.role"
          clearable
          :options="[
            { label: '群主', value: 1 },
            { label: '管理员', value: 2 },
            { label: '普通成员', value: 3 },
            { label: '财务', value: 4 },
            { label: '红包机器人', value: 5 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="僵尸号">
        <n-checkbox
          v-model:checked="queryItems.fromType"
          :checked-value="4"
          :unchecked-value="null"
        >
          是
        </n-checkbox>
        <!-- <n-select
          v-model:value="queryItems.fromType"
          clearable
          :options="[
            { label: '是', value: 4 },
            { label: '否', value: null },
          ]"
        /> -->
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
        <n-form-item v-if="['add'].includes(modalAction)" label="群ID" path="groupId">
          {{ modalForm.groupId }}
        </n-form-item>
        <n-form-item v-if="['add'].includes(modalAction)" label="群名称">
          {{ modalForm.name }}
        </n-form-item>
        <n-form-item v-if="['add'].includes(modalAction)" label="新成员" path="uidList">
          <n-select
            v-model:value="modalForm.uidList"
            multiple
            :options="userOptions"
            :render-label="renderUserLabel"
            :render-tag="renderUserSelectTag"
            value-field="id"
            filterable
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="头像" path="avatar">
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>
        <n-form-item
          v-if="['edit'].includes(modalAction)"
          label="用户名"
          path="originNick"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.originNick"
            :disabled="!['edit', 'add'].includes(modalAction)"
          />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="手机号"
          path="phone"
          :rule="{
            required: true,
            message: '请输入手机号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.phone" :disabled="modalAction !== 'add'">
            <template #suffix>
              <i class="i-fe:refresh-ccw cursor-pointer" @click="handleGetPhone()" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item v-if="['resetPwd'].includes(modalAction)" label="类型">
          <n-radio-group v-model:value="modalForm.type" name="changePwdType">
            <n-space>
              <n-radio :value="1">登录密码</n-radio>
              <n-radio :value="2">支付密码</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          v-if="['resetPwd'].includes(modalAction)"
          :label="modalForm.type == '1' ? '登陆密码' : '支付密码'"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>

        <n-form-item
          v-if="['addOther'].includes(modalAction)"
          label="数量"
          path="num"
          :rule="{
            required: true,
            message: '请输入数量',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-input-number v-model:value="modalForm.num" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag, NSpace, NText } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import apiUser from '../../user/list/api'
import { useClipboard } from '@vueuse/core'

const route = useRoute()

const { copy, copied } = useClipboard()

const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({
  groupId: route.query.roomId,
  type: route.query.roomType,
  sortField: 'createTime',
  sortType: 'desc',
  op: { groupId: 'eq', fromType: 'eq' },
  ignore: ['type'],
})

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleEdit,
  handleSave,
} = useCrud({
  name: '用户',
  initForm: {
    groupId: route.query.roomId,
    name: route.query.roomName,
    uidList: [],
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

watch(copied, (val) => {
  val && $message.success('已复制到剪切板')
})
onMounted(() => {
  $table.value?.handleSearch()
})
// 用户table
const columns = [
  {
    fixed: 'left',
    type: 'selection',
  },
  {
    fixed: 'left',
    title: 'ID',
    key: 'uid',
    width: 70,
    ellipsis: {
      tooltip: true,
    },
    render: ({ id }) =>
      h(
        NText,
        {
          class: 'cursor-pointer',
          type: 'info',
          onClick: () => copy(id),
        },
        id
      ),
  },
  {
    title: '头像',
    width: 60,
    align: 'center',
    fixed: 'left',
    key: 'avatar',
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  {
    title: '昵称',
    key: 'originNick',
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '群昵称',
    key: 'groupNick',
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '手机号',
    key: 'phone',
    width: 120,
    render: ({ phone }) =>
      h(
        NText,
        {
          class: 'cursor-pointer',
          type: 'info',
          onClick: () => copy(phone),
        },
        phone
      ),
  },
  {
    title: '积分',
    width: 150,
    key: 'point',
    render: (row) => {
      return h(
        NButton,
        {
          quaternary: true,
          type: 'info',
          text: true,
          onClick: () =>
            handleOpen({
              action: 'point',
              title: '余额设置',
              row: { ...row, ...{ type: '1', gemCount: 0 } },
              onOk: onSave,
            }),
        },
        row.point
      )
    },
  },
  {
    title: '是否置顶',
    key: 'topFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.topFlag,
          loading: !!row.topFlagLoading,
          onUpdateValue: () => handleEnable(row, 'topFlag'),
        },
        {
          checked: () => '置顶',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否免死',
    key: 'avoidDieFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 2,
          uncheckedValue: 1,
          value: row.avoidDieFlag,
          loading: !!row.avoidDieFlagLoading,
          onUpdateValue: () => handleEnable(row, 'avoidDieFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否免打扰',
    key: 'msgFreeFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.msgFreeFlag,
          loading: !!row.msgFreeFlagLoading,
          onUpdateValue: () => handleEnable(row, 'msgFreeFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否加入通讯录',
    key: 'addressFlag',
    width: 130,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.addressFlag,
          loading: !!row.addressFlagLoading,
          onUpdateValue: () => handleEnable(row, 'addressFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否折叠群聊',
    key: 'archiveFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.archiveFlag,
          loading: !!row.archiveFlagLoading,
          onUpdateValue: () => handleEnable(row, 'archiveFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '用户类型',
    key: 'role',
    width: 120,
    render: ({ role }) =>
      h(
        NTag,
        {
          type: role == 1 ? 'primary' : role == 2 ? 'info' : '',
        },
        role == 1 ? '群主' : role == 2 ? '管理员' : '普通成员'
      ),
  },
  {
    title: '是否股东',
    width: 120,
    render: ({ shareholderFlag }) =>
      shareholderFlag != null
        ? h(
            NTag,
            {
              type: shareholderFlag == 1 ? 'warning' : shareholderFlag == 2 ? 'primary' : 'error',
            },
            shareholderFlag == 1 ? '待审批' : shareholderFlag == 2 ? '是' : '拒绝'
          )
        : h(
            NTag,
            {
              type: '',
            },
            '否'
          ),
  },
  {
    title: '僵尸号',
    key: 'fromType',
    render: (row) =>
      row.fromType == 4
        ? h(
            NTag,
            {
              type: 'info',
            },
            '是'
          )
        : '--',
  },
  // {
  //   title: '上级账号',
  //   key: 'pmobile',
  //   width: 150,
  //   render({ pmobile }) {
  //     return h(
  //       'span',
  //       {
  //         onClick: () => tableFieldSearch('keyword', pmobile),
  //       },
  //       pmobile
  //     )
  //   },
  // },
  { title: '群备注', key: 'remark', render: ({ remark }) => remark },
  {
    title: '最后上下线时间',
    key: 'lastOptTime',
    width: 130,
    render: (row) => formatDateTime(row.lastOptTime),
  },
  {
    title: '添加时间',
    key: 'createTime',
    width: 120,
    render: (row) => formatDateTime(row.createTime),
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
              secondary: true,
              onClick: () => handleEdit(row),
            },
            {
              default: () => '查看详情',
              icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'warning',
              onClick: () =>
                handleOpen({
                  action: 'resetPwd',
                  title: '修改密码',
                  row: { ...row, ...{ type: 1 } },
                  onOk: onSave,
                }),
            },
            {
              default: () => '修改密码',
              icon: () => h('i', { class: 'i-fe:shield text-14' }),
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
              default: () => '移除',
              icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
            }
          ),
        ]
      ),
  },
]

function handleAddOther() {
  handleOpen({
    action: 'addOther',
    title: '添加僵尸粉',
    row: { groupId: route.query.roomId, num: null },
    onOk: onSave,
  })
}

function onSave() {
  if (modalAction.value === 'balance') {
    return handleSave({
      api: () => api.updateGem(modalForm.value),
      cb: () => $message.success('修改成功'),
    })
  } else if (modalAction.value === 'resetPwd') {
    return handleSave({
      api: () => apiUser.editPsd(modalForm.value),
      cb: () => $message.success('修改成功'),
    })
  } else if (modalAction.value === 'addOther') {
    return handleSave({
      api: () => api.addOther(modalForm.value),
      cb: () => $message.success('添加成功'),
    })
  }
  handleSave()
}

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

// 用户查找
const userOptions = ref()
const userLoading = ref(false)
function userHandleSearch(query = '') {
  userLoading.value = true
  apiUser
    .fetchData({
      pageNum: 1,
      pageSize: 30,
      id: query,
      name: query,
      phone: query,
    })
    .then((res) => {
      res.data.list.forEach((item) => {
        item.disabled = item.realStock == 0
      })
      userOptions.value = res.data.list
      userLoading.value = false
    })
}
function renderUserSelectTag({ option, handleClose }) {
  console.log(option)
  return h(
    NTag,
    {
      style: {
        padding: '0 6px 0 4px',
      },
      round: true,
      closable: true,
      onClose: (e) => {
        e.stopPropagation()
        handleClose()
      },
    },
    {
      default: () =>
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
            },
          },
          [
            h(NAvatar, {
              src: option.avatar,
              round: true,
              size: 22,
              style: {
                marginRight: '4px',
              },
            }),
            option.name,
          ]
        ),
    }
  )
}
function renderUserLabel(option) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(NAvatar, {
        src: option.avatar,
        round: true,
        size: 'small',
      }),
      h(
        'div',
        {
          style: {
            marginLeft: '12px',
            padding: '4px 0',
          },
        },
        [
          h('div', null, [option.name]),
          h(
            NText,
            { depth: 3, tag: 'div' },
            {
              default: () => option.phone,
            }
          ),
        ]
      ),
    ]
  )
}
</script>
