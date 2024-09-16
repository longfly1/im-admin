<template>
  <CommonPage>
    <template #action>
      <n-space>
        <n-button type="primary" @click="handleReset('resetFinance')">
          <i class="i-fe:refresh-ccw mr-4 text-18" />
          刷新反水
        </n-button>
        <n-button type="primary" @click="handleReset('resetFinanceByGroupId')">
          <i class="i-fe:refresh-ccw mr-4 text-18" />
          刷新股东反水
        </n-button>
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
          创建新群
        </n-button>
      </n-space>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :scroll-x="2000"
      :get-data="api.fetchData"
      @on-delete="handleDelete"
    >
      <MeQueryItem label="群 ID">
        <n-input v-model:value="queryItems.id" type="text" placeholder="请输入群 ID" clearable />
      </MeQueryItem>
      <MeQueryItem label="群名称">
        <n-input v-model:value="queryItems.name" type="text" placeholder="请输入群名称" clearable />
      </MeQueryItem>
      <MeQueryItem label="群靓号">
        <n-input
          v-model:value="queryItems.groupCard"
          type="text"
          placeholder="请输入群靓号"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="群管理账号">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入群管理账号"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="群类型">
        <n-select
          v-model:value="queryItems.type"
          clearable
          :options="[
            { label: '普通群', value: 1 },
            { label: '会员群', value: 2 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="群类型"
          path="groupType"
          :rule="{
            required: true,
            message: '请输入群类型',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select
            v-model:value="modalForm.groupType"
            clearable
            :options="[
              { label: '普通群', value: 1 },
              { label: '会员群', value: 2 },
            ]"
          />
        </n-form-item>
        <n-form-item v-if="['add'].includes(modalAction)" label="群主ID" path="groupUId">
          <n-select
            v-model:value="modalForm.groupUId"
            filterable
            placeholder="可搜索群主昵称"
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
        </n-form-item>
        <n-grid v-if="['groupConfig'].includes(modalAction)" x-gap="24" :cols="2">
          <n-gi>
            <n-form-item
              v-if="['groupConfig'].includes(modalAction)"
              label="自动回复关键字"
              path="autoReplayKeyword"
            >
              <n-input v-model:value="modalForm.autoReplayKeyword" />
            </n-form-item>
            <n-form-item label="自动回复内容" path="autoReplayContent">
              <n-input v-model:value="modalForm.autoReplayContent" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="是否开启统计机器人">
              <n-radio-group
                v-model:value="modalForm.statisticsRobotFlag"
                name="statisticsRobotFlag"
              >
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="2">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="拉人SU奖励">
              <n-input-number v-model:value="modalForm.coin" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="最小充值金额">
              <n-input-number v-model:value="modalForm.priceMin" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="最大充值金额">
              <n-input-number v-model:value="modalForm.priceMax" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="SU兑换比例">
              <n-input-number v-model:value="modalForm.walletExchangeRatio" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="充值手续费">
              <n-input-number v-model:value="modalForm.rechargeFee" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="提现手续费">
              <n-input-number v-model:value="modalForm.withholdFee" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="流水限制">
              <n-input-number v-model:value="modalForm.welfareLimit" :min="0" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="点杀">
              <n-select
                v-model:value="clickKillArr"
                filterable
                placeholder="可搜索昵称"
                :options="userOptions"
                :loading="userLoading"
                :render-label="renderUserLabel"
                :render-tag="renderUserSelectTag"
                value-field="id"
                clearable
                remote
                multiple
                @search="userHandleSearch"
              />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="点杀率">
              <n-input v-model:value="modalForm.killRate" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="胜率">
              <n-input-number v-model:value="modalForm.winRate" :min="0" />
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="机器人发包出雷">
              <div>
                <n-input v-model:value="modalForm.robotGoNum" :min="0" />
                <p class="pt-5 text-12 text-gray-500">发机器人，想机器人多，使劲减</p>
              </div>
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="真人发包出雷">
              <div>
                <n-input v-model:value="modalForm.realGoNum" :min="0" />
                <p class="pt-5 text-12 text-gray-500">发真实人，想真人少，使劲加</p>
              </div>
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="真人抢包不种个数">
              <div>
                <n-input v-model:value="modalForm.realType" :min="0" />
                <p class="pt-5 text-12 text-gray-500">真人几个不会</p>
              </div>
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="N次后必中">
              <div>
                <n-input v-model:value="modalForm.realMun" :min="0" />
                <p class="pt-5 text-12 text-gray-500">连续N个不中后必中</p>
              </div>
            </n-form-item>
            <n-form-item v-if="['groupConfig'].includes(modalAction)" label="雷类型">
              <n-radio-group v-model:value="modalForm.type" name="type">
                <n-space>
                  <n-radio :value="1">单雷</n-radio>
                  <n-radio :value="2">多雷</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-form-item v-if="['moveAllUsers'].includes(modalAction)" label="选择目标群">
          <n-select
            v-model:value="clickKillArr"
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
        <!-- <n-form-item v-if="['resetPwd'].includes(modalAction)" label="类型">
          <n-radio-group v-model:value="modalForm.type" name="changePwdType">
            <n-space>
              <n-radio value="0">登录密码</n-radio>
              <n-radio value="1">支付密码</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          v-if="['resetPwd'].includes(modalAction)"
          :label="modalForm.type == '0' ? '登陆密码' : '支付密码'"
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
          <n-input v-model:value="modalForm.password" placeholder="请输入登陆密码" />
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
          <n-input v-model:value="modalForm.payPassword" placeholder="请输入支付密码" />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="允许登陆">
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
import { NAvatar, NButton, NSwitch, NTag, NSpace, NFlex, NText } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import apiGroupUser from '../user/api'
import apiUser from '../../user/list/api'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'GroupList' })

const router = useRouter()

const { copy, copied } = useClipboard()
const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({ sortField: 'createTime', sortType: 'desc', op: { type: 'eq' } })

const clickKillArr = ref([])
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
  name: '群',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: (data = false) => $table.value?.handleSearch(data),
})

watch(copied, (val) => {
  val && $message.success('已复制到剪切板')
})
watch(clickKillArr, (val) => {
  modalForm.value.clickKill = val.join(',')
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
    key: 'avatar',
    align: 'center',
    fixed: 'left',
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  {
    title: '名称',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '群靓号',
    key: 'groupCard',
    fixed: 'left',
    render: ({ groupCard }) =>
      h(
        NText,
        {
          class: 'cursor-pointer',
          type: 'info',
          onClick: () => copy(groupCard),
        },
        groupCard
      ),
  },
  {
    title: '管理员',
    render: ({ name }) =>
      h(
        NText,
        {
          class: 'cursor-pointer',
          type: 'info',
          onClick: () => copy(name),
        },
        name
      ),
  },
  {
    title: '群人数',
    key: 'numberTotal',
    sortOrder: 'numberTotal',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '群主余额',
    key: 'groupLeaderIntegral',
    sortOrder: 'groupLeaderIntegral',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '玩家总余额',
    key: 'groupNumberIntegral',
    sortOrder: 'groupNumberIntegral',
    sorter(sorters) {
      tableSorterSearch(sorters)
    },
  },
  {
    title: '群类型',
    render: (row) =>
      h(
        NTag,
        {
          type: row.type == 2 ? 'success' : '',
        },
        row.type == 2 ? '会员群' : '普通群'
      ),
  },
  {
    title: '修改群名',
    key: 'changeNameFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.changeNameFlag,
          loading: !!row.changeNameFlagLoading,
          onUpdateValue: () => handleEnable(row, 'changeNameFlag'),
        },
        {
          checked: () => '仅管理',
          unchecked: () => '全员',
        }
      ),
  },
  {
    title: '是否禁言',
    key: 'forbiddenFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.forbiddenFlag,
          loading: !!row.forbiddenFlagLoading,
          onUpdateValue: () => handleEnable(row, 'forbiddenFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否禁止加入',
    key: 'friendFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.friendFlag,
          loading: !!row.friendFlagLoading,
          onUpdateValue: () => handleEnable(row, 'friendFlag'),
        },
        {
          checked: () => '允许',
          unchecked: () => '禁止',
        }
      ),
  },
  {
    title: '是否进群审核',
    key: 'reviewFlag',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.reviewFlag,
          loading: !!row.reviewFlagLoading,
          onUpdateValue: () => handleEnable(row, 'reviewFlag'),
        },
        {
          checked: () => '是',
          unchecked: () => '否',
        }
      ),
  },
  {
    title: '是否删除',
    key: 'deleteStatus',
    width: 120,
    render: (row) =>
      h(
        NTag,
        {
          type: row.deleteStatus == 0 ? 'success' : 'error',
        },
        row.deleteStatus == 0 ? '正常' : '删除'
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
    width: 350,
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
              type: 'info',
              onClick: () => {
                $message.loading('获取中', { key: 'groupConfig' })
                api.getConfig(row.id).then((res) => {
                  $message.destroy('groupConfig')
                  handleOpen({
                    action: 'groupConfig',
                    title: `群配置-${row.name}`,
                    row: res.data,
                    onOk: onSave,
                  })
                  if (res.data.groupUsers) {
                    let userIds = Object.keys(res.data.groupUsers)
                    userOptions.value = Object.values(res.data.groupUsers)
                    clickKillArr.value = userIds
                  }
                })
              },
            },
            {
              default: () => '获取群配置',
              icon: () => h('i', { class: 'i-fe:github text-14' }),
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
                  path: `/group/user`,
                  query: {
                    roomId: row.id,
                    roomName: row.name,
                    roomType: row.type,
                    admin: row.name,
                    groupCard: row.groupCard,
                  },
                }),
            },
            {
              default: () => '查看成员',
              icon: () => h('i', { class: 'i-fe:users text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () =>
                handleOpen({
                  action: 'moveAllUsers',
                  title: `转移群成员-${row.name}`,
                  row,
                  onOk: onSave,
                }),
            },
            {
              default: () => '转移成员',
              icon: () => h('i', { class: 'i-fe:git-branch text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              secondary: true,
              onClick: () =>
                router.push({
                  path: `/group/user`,
                  query: {
                    roomId: row.id,
                    roomName: row.name,
                    roomType: row.type,
                    admin: row.name,
                  },
                }),
            },
            {
              default: () => '历史上分',
              icon: () => h('i', { class: 'i-fe:file-text text-14' }),
            }
          ),
          row.deleteStatus == 0
            ? h(
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
              )
            : h(
                NButton,
                {
                  size: 'small',
                  type: 'warning',
                  onClick: () => handleDelete([row.id]),
                },
                {
                  default: () => '恢复',
                  icon: () => h('i', { class: 'i-fe:git-pull-request text-14' }),
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
  userLoading.value = true
  let params = {}
  if (modalAction.value == 'groupConfig') {
    params = {
      pageNum: 1,
      pageSize: 30,
      groupId: modalForm.value.groupId,
      originNick: query,
      type: modalForm.value.type,
      sortField: 'createTime',
      sortType: 'desc',
      ignore: ['type'],
      op: { groupId: 'eq' },
    }
  } else {
    params = {
      pageNum: 1,
      pageSize: 30,
      id: query,
      userRole: 2,
      sortField: 'createTime',
      sortType: 'desc',
      op: { userRole: 'eq' },
    }
  }
  const apiCall = modalAction.value === 'groupConfig' ? apiGroupUser : apiUser
  apiCall.fetchData(params).then((res) => {
    userOptions.value = res.data.list
    userLoading.value = false
  })
}

function renderUserSelectTag({ option, handleClose }) {
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
            modalAction.value === 'groupConfig' ? option.originNick || option.name : option.name,
          ]
        ),
    }
  )
}
function renderUserLabel(option) {
  return h(
    NFlex,
    {
      align: 'center',
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
            marginLeft: '10px',
            padding: '4px 0',
          },
        },
        [
          h('div', null, [
            modalAction.value === 'groupConfig' ? option.originNick || option.name : option.name,
            ' _ ',
            option.phone,
          ]),
          h(
            NText,
            { depth: 3, tag: 'div' },
            {
              default: () => option.id,
            }
          ),
        ]
      ),
    ]
  )
}
function onSave() {
  if (modalAction.value === 'groupConfig') {
    return handleSave({
      api: () => api.updateConfig(modalForm.value),
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

function handleReset(val) {
  $message.loading('刷新中')
  api[val]().then(() => {
    $message.success('操作成功')
  })
}
</script>
