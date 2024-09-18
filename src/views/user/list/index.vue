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
        <n-button type="info" @click="handleDownload()">
          <i class="i-fe:download-cloud mr-4 text-18" />
          下载模板
        </n-button>
        <n-button type="info" @click="handleAdds()">
          <i class="i-fe:upload-cloud mr-4 text-18" />
          批量导入
        </n-button>
        <n-button type="primary" @click="handleAdd(), handleGetPhone()">
          <i class="i-material-symbols:add mr-4 text-18" />
          创建新用户
        </n-button>
      </n-space>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2000"
      :columns="columns"
      :get-data="api.fetchData"
      @on-delete="handleDelete"
    >
      <MeQueryItem label="id">
        <n-input v-model:value="queryItems.id" type="text" placeholder="请输入id" clearable />
      </MeQueryItem>
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
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入用户昵称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="用户类型">
        <n-select
          v-model:value="queryItems.userRole"
          clearable
          :options="[
            { label: '普通', value: 1 },
            { label: 'VIP', value: 2 },
            { label: '机器人', value: 3 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px" :show-footer="!['import'].includes(modalAction)">
      <n-upload
        v-if="['import'].includes(modalAction)"
        class="mx-auto w-[75%] p-20 text-center"
        :custom-request="importUser"
        :show-file-list="false"
        accept=".xls,.xlsx"
        @before-upload="onBeforeUpload"
      >
        <n-upload-dragger>
          <div class="h-150 f-c-c flex-col">
            <i class="i-mdi:upload mb-12 text-68 color-primary" />
            <n-text class="text-14 color-gray">点击或者拖动文件到该区域来上传</n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
      <n-form
        v-else
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
      >
        <n-form-item v-if="['edit'].includes(modalAction)" label="头像" path="avatar">
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>
        <n-form-item
          v-if="['edit'].includes(modalAction)"
          label="用户名"
          path="name"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.name"
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
          :label="modalForm.type == 1 ? '登陆密码' : '支付密码'"
          path="password"
          :rule="{
            required: ['add'].includes(modalAction),
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>
        <n-form-item
          v-if="['add'].includes(modalAction)"
          label="登陆密码"
          path="password"
          :rule="{
            required: ['add'].includes(modalAction),
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" placeholder="请输入登陆密码">
            <template #suffix>
              <i class="i-fe:refresh-ccw cursor-pointer" @click="handleGetPassword('password')" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item
          v-if="['add'].includes(modalAction)"
          label="支付密码"
          path="payPassword"
          :rule="{
            required: ['add'].includes(modalAction),
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.payPassword" placeholder="请输入支付密码">
            <template #suffix>
              <i
                class="i-fe:refresh-ccw cursor-pointer"
                @click="handleGetPassword('payPassword')"
              />
            </template>
          </n-input>
        </n-form-item>
        <!-- <n-form-item v-if="modalAction === 'add'" label="允许登陆">
          <n-switch v-model:value="modalForm.status" checked-value="0" unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="允许转赠">
          <n-switch v-model:value="modalForm.isGive" checked-value="0" unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item> -->
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag, NSpace, NText } from 'naive-ui'
import {
  formatDateTime,
  saveFile,
  generateRandomPhoneNumber,
  generateRandomPassword,
} from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'UserList' })

const { copy, copied } = useClipboard()
const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc', op: { id: 'eq' } })

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
    userRole: 1,
    password: '123456',
    payPassword: '123456',
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
    key: 'id',
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
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  {
    title: '昵称',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '手机号',
    key: 'phone',
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
    title: 'vip信息',
    key: 'vipLevelInfoData',
    sortOrder: 'vipLevelInfoData',
    render: (row) => {
      return [
        h('p', {}, row.vipLevelInfoData?.level),
        h('p', {}, row.vipLevelInfoData?.name),
        row.vipStartTime &&
          h('p', {}, `${formatDateTime(row.vipStartTime)}-${formatDateTime(row.vipEndTime)}`),
      ]
    },
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '积分',
    key: 'balance',
    sortOrder: 'balance',
    render: (row) => {
      return h(
        NButton,
        {
          quaternary: true,
          type: 'info',
          text: true,
          onClick: () =>
            handleOpen({
              action: 'balance',
              title: '余额设置',
              row: { ...row, ...{ type: 'balance', gemCount: 0 } },
              onOk: onSave,
            }),
        },
        row.balance
      )
    },
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: 'usdt',
    key: 'usdt',
    sortOrder: 'usdt',
    render: (row) => {
      return h(
        NButton,
        {
          quaternary: true,
          type: 'info',
          text: true,
          onClick: () =>
            handleOpen({
              action: 'usdt',
              title: '余额设置',
              row: { ...row, ...{ type: 'usdt', gemCount: 0 } },
              onOk: onSave,
            }),
        },
        row.usdt
      )
    },
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '在线状态',
    width: 120,
    key: 'activeStatus',
    render: (row) =>
      h(
        NTag,
        {
          type: row.activeStatus == '0' ? '' : 'success',
        },
        row.activeStatus == '0' ? '离线' : '在线'
      ),
  },
  {
    title: '最后上下线时间',
    key: 'lastOptTime',
    render: (row) => formatDateTime(row.lastOptTime),
  },
  {
    title: '允许登陆',
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
          checked: () => '允许',
          unchecked: () => '禁止',
        }
      ),
  },
  {
    title: '用户类型',
    key: '',
    render: ({ userRole }) =>
      h(
        NTag,
        {
          type: userRole == 1 ? '' : userRole == 2 ? 'error' : 'primary',
        },
        userRole == 1 ? '普通用户' : userRole == 2 ? 'vip' : '机器人'
      ),
  },
  // {
  //   title: '允许转赠',
  //   key: 'is_give',
  //   width: 120,
  //   render: (row) =>
  //     h(
  //       NSwitch,
  //       {
  //         size: 'small',
  //         rubberBand: false,
  //         checkedValue: '1',
  //         uncheckedValue: '0',
  //         value: row.isGive,
  //         loading: !!row.isGiveLoading,
  //         onUpdateValue: () => handleEnable(row, 'isGive'),
  //       },
  //       {
  //         checked: () => '允许',
  //         unchecked: () => '禁止',
  //       }
  //     ),
  // },
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
  { title: '注册IP', key: 'ipInfoData', render: (row) => row.ipInfoData?.createIp },
  {
    title: '注册时间',
    key: 'createTime',
    sortOrder: 'createTime',
    render: (row) => formatDateTime(row.createTime),
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  // {
  //   title: '注销状态',
  //   render: (row) =>
  //     h(
  //       NTag,
  //       {
  //         type: row.delFlag == '0' ? 'success' : '',
  //       },
  //       row.delFlag == '0' ? '正常' : '已注销'
  //     ),
  // },
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
          // h(
          //   NButton,
          //   {
          //     size: 'small',
          //     type: 'info',
          //     secondary: true,
          //     onClick: () => handleEdit(row),
          //   },
          //   {
          //     default: () => '群余额',
          //     icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          //   }
          // ),
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
          // h(
          //   NButton,
          //   {
          //     size: 'small',
          //     type: 'primary',
          //     onClick: () => handleTeam(row),
          //   },
          //   {
          //     default: () => '团队信息',
          //   }
          // ),
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

async function handleDownload() {
  const res = await api.download()
  saveFile(res, '用户列表.xlsx', 'application/vnd.ms-excel')
}

function handleAdds() {
  handleOpen({
    action: 'import',
    title: '导入用户',
  })
}
function importUser({ file, data, onFinish, onError, onProgress }) {
  const formData = new FormData()
  formData.append('file', file.file)
  api.import(formData).then(() => {
    $message.success('导入成功')
  })
}

function onSave() {
  if (modalAction.value === 'resetPwd') {
    return handleSave({
      api: () => api.editPsd(modalForm.value),
      cb: () => $message.success('修改成功'),
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

function tableSorterSearch(sorter) {
  queryItems.value['sortField'] = sorter.columnKey
  queryItems.value['sortType'] = sorter.order == false ? 'desc' : sorter.order
  $table.value?.handleSearch()
}

function handleGetPhone() {
  modalForm.value.phone = generateRandomPhoneNumber()
}
function handleGetPassword(params) {
  modalForm.value[params] = generateRandomPassword()
}
</script>
