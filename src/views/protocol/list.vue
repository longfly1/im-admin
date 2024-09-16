<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建协议
      </n-button>
    </template>

    <MeCrud ref="$table" :columns="columns" :get-data="api.fetchData"></MeCrud>

    <MeModal ref="modalRef" width="900px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="50"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item label="类型" path="uid">
          <n-radio-group
            v-model:value="modalForm.title"
            name="title"
            :disabled="['edit'].includes(modalAction)"
          >
            <n-space>
              <n-radio value="平台规则">平台规则</n-radio>
              <n-radio value="用户协议">用户协议</n-radio>
              <n-radio value="隐私协议">隐私协议</n-radio>
              <n-radio value="注销协议">注销协议</n-radio>
              <n-radio value="关于我们">关于我们</n-radio>
              <n-radio value="邀请规则">邀请规则</n-radio>
              <n-radio value="玩法规则">玩法规则</n-radio>
              <n-radio value="转赠说明">转赠说明</n-radio>
              <n-radio value="注册送卡">注册送卡说明</n-radio>
              <n-radio value="好友矿场介绍">好友矿场介绍</n-radio>
              <n-radio value="龙蛋矿场介绍">龙蛋矿场介绍</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="内容" path="content">
          <Editor ref="richEditor" v-model:value="modalForm.content" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NImage, NButton, NTag, NSpace } from 'naive-ui'
import { MeCrud, MeQueryItem, MeModal, Editor } from '@/components'
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
  { title: '类型', key: 'title' },
  {
    title: '更新时间',
    key: 'editDate',
  },

  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 180,
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
            }
          ),
        ]
      ),
  },
]

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleEdit } = useCrud({
  name: '协议',
  initForm: { content: '' },
  doCreate: api.create,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})
</script>
