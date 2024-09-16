<script setup>
import { NAvatar, NTag, NText, NFlex } from 'naive-ui'
import api from '@/api'
import apiUser from '@/views/user/list/api'
import { MeModal } from '@/components'
import { useModal } from '@/composables'
const [modelRef] = useModal()

const query = ref({
  content: '',
  uidList: [],
})
function open() {
  modelRef.value.open()
}
function handleSend() {
  api.notification({})
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
      phone: query,
    })
    .then((res) => {
      userOptions.value = res.data.list
      userLoading.value = false
    })
}
const renderMultipleSelectTag = ({ option, handleClose }) => {
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
              src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
              round: true,
              size: 22,
              style: {
                marginRight: '4px',
              },
            }),
            option.label,
          ]
        ),
    }
  )
}
const renderLabel = (option) => {
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
          h('div', null, [option.name, ' _ ', option.phone]),
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
</script>
<template>
  <i class="i-fe:send mr-16 cursor-pointer" @click="open()" />
  <MeModal ref="modelRef" title="官方公告" @ok="handleSend()">
    <n-input
      v-model:value="query.content"
      type="textarea"
      placeholder="请输入公告内容"
      :autosize="{
        minRows: 10,
      }"
    />
    <n-select
      v-model:value="query.uidList"
      class="mt-10"
      multiple
      filterable
      placeholder="请添加指定用户"
      :options="userOptions"
      :render-label="renderLabel"
      :loading="userLoading"
      value-field="id"
      clearable
      remote
      @search="userHandleSearch"
    />
  </MeModal>
</template>
