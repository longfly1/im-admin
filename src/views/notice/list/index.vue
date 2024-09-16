<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新公告
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.fetchData"
    >
      <MeQueryItem label="分类">
        <n-select
          v-model:value="queryItems.cert"
          clearable
          label-field="title"
          value-field="id"
          :options="classOptions"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="800px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="封面"
          path="poster"
          :rule="{
            required: true,
            message: '请上传封面',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.poster"></CustomUpload>
        </n-form-item>
        <n-form-item
          label="标题"
          path="title"
          :rule="{
            required: true,
            message: '请输入标题',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" />
        </n-form-item>
        <n-form-item
          label="分类"
          path="cate"
          :rule="{
            required: true,
            message: '请选择分类',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-select
            v-model:value="modalForm.cate"
            clearable
            label-field="title"
            value-field="id"
            :options="classOptions"
          />
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
        <n-form-item label="状态">
          <n-radio-group v-model:value="modalForm.status" name="status">
            <n-space>
              <n-radio value="1">显示</n-radio>
              <n-radio value="0">隐藏</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="类型">
          <n-radio-group v-model:value="modalForm.type" name="type">
            <n-space>
              <n-radio value="1">内链</n-radio>
              <n-radio value="0">外链</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="modalForm.type == '0'" label="链接">
          <n-input v-model:value="modalForm.link" />
        </n-form-item>
        <n-form-item v-if="modalForm.type == '1'" label="内容">
          <Editor ref="richEditor" v-model:value="modalForm.content" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NImage, NButton, NSwitch, NTag, NSpace } from 'naive-ui'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import classfificationApi from '../classification/api.js'

defineOptions({ name: 'NoticeList' })
const classOptions = ref([])
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  balanceSort: 1,
})

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: '公告',
    initForm: {
      status: '1',
      type: '1',
    },
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    refresh: () => $table.value?.handleSearch(),
  })

function getClass() {
  classfificationApi.fetchData({ pageNum: 1, pageSize: 100 }).then((result) => {
    classOptions.value = result.data.data
  })
}
onMounted(() => {
  getClass()
  $table.value?.handleSearch()
})
// 用户table
const columns = [
  {
    title: '封面',
    width: 80,
    render: ({ poster }) =>
      h(NImage, {
        height: '30',
        src: poster,
      }),
  },
  {
    title: '分类',
    key: 'title',
  },
  {
    title: '标题',
    key: 'title',
  },
  {
    title: '排序',
    key: 'sort',
  },
  {
    title: '状态',
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
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '编辑时间',
    key: 'editTime',
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 280,
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
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row.id),
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
