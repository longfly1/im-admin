<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建游戏
      </n-button>
    </template>

    <MeCrud ref="$table" :columns="columns" :get-data="api.fetchData"></MeCrud>

    <MeModal ref="modalRef" width="800px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="封面"
          path="poster"
          :rule="{
            required: true,
            message: '请上传封面',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload
            v-if="['add', 'edit'].includes(modalAction)"
            v-model:value="modalForm.poster"
          ></CustomUpload>
        </n-form-item>
        <n-form-item label="游戏名称">
          <n-input v-model:value="modalForm.gameName" />
        </n-form-item>
        <n-form-item label="游戏类型">
          <n-radio-group v-model:value="modalForm.type" name="type">
            <n-space>
              <n-radio :value="1">内置游戏</n-radio>
              <n-radio :value="2">h5游戏</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="[1].includes(modalForm.type)" label="游戏模型">
          <n-input v-model:value="modalForm.model" class="w-full" />
        </n-form-item>
        <n-form-item v-if="[2].includes(modalForm.type)" label="游戏地址">
          <n-input v-model:value="modalForm.gameApi" class="w-full" />
        </n-form-item>
        <n-form-item v-if="[2].includes(modalForm.id)" label="单次消耗">
          <n-input-number v-model:value="modalForm.dragonEgg" class="w-full" />
        </n-form-item>
        <n-form-item
          label="排序"
          path="sort"
          :rule="{
            required: true,
            message: '请输入排序',
            trigger: ['input', 'blur'],
            type: 'number',
          }"
        >
          <n-input-number v-model:value="modalForm.sort" class="w-full" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="modalForm.status"
            :options="[
              { label: '隐藏', value: '1' },
              { label: '敬请期待', value: '2' },
              { label: '开启', value: '3' },
            ]"
          />
        </n-form-item>
        <n-form-item v-if="[2].includes(modalForm.id)" label="说明">
          <Editor ref="richEditor" v-model:value="modalForm.remark" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NImage, NSpace, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'CardList' })

const $table = ref(null)

onMounted(() => {
  $table.value?.handleSearch()
})

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
    title: '名称',
    key: 'gameName',
  },
  // { title: 'key', key: 'price' },
  {
    title: '游戏类型',
    key: 'type',
    align: 'center',
    render: (row) =>
      h(
        NTag,
        {
          size: 'small',
          bordered: false,
          type: row.type == 1 ? 'info' : 'success',
        },
        row.type == 1 ? '内置游戏' : 'h5游戏'
      ),
  },
  { title: '单次消耗', key: 'dragonEgg' },
  { title: '游戏地址', key: 'gameApi' },
  {
    title: '上架状态',
    key: 'status',
    align: 'center',
    render: (row) =>
      h(
        NTag,
        {
          size: 'small',
          bordered: false,
          type: row.status == '1' ? '' : row.status == '2' ? 'info' : 'success',
        },
        row.status == '1' ? '隐藏' : row.status == '2' ? '敬请期待' : '开启'
      ),
  },
  {
    title: '创建时间',
    key: 'reg_date',
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return h(
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
      )
    },
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

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleEdit, handleDelete } =
  useCrud({
    name: '游戏',
    initForm: { sort: 0, status: '1' },
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    refresh: () => $table.value?.handleSearch(),
  })
</script>
