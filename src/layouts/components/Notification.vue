<script setup>
import api from '@/api'
import { MeModal } from '@/components'
import { useModal, useUserSelect } from '@/composables'
const [modelRef, okLoading] = useModal()

class ModalForm {
  content = ''
  uidList = []
}

const modalForm = ref(new ModalForm())

const { userOptions, userLoading, userHandleSearch, renderUserSelectTag, renderUserLabel } =
  useUserSelect({ modalForm })
function open() {
  modelRef.value.open({
    async onOk() {
      if (modalForm.value.content == '') {
        $message.warning('请输入内容')
        return false
      }
      $message.loading('发布中...', { key: 'modal' })
      okLoading.value = true
      await api.notification(modalForm.value)
      $message.success('发布成功', { key: 'modal' })
      modalForm.value = new ModalForm()
      okLoading.value = false
    },
  })
}
</script>
<template>
  <i class="i-fe:send mr-16 cursor-pointer" @click="open()" />
  <MeModal ref="modelRef" title="官方公告">
    <n-input
      v-model:value="modalForm.content"
      type="textarea"
      placeholder="请输入公告内容"
      :autosize="{
        minRows: 10,
      }"
    />
    <n-select
      v-model:value="modalForm.uidList"
      class="mt-10"
      multiple
      filterable
      placeholder="请添加指定用户"
      :options="userOptions"
      :render-label="renderUserLabel"
      :render-tag="renderUserSelectTag"
      :loading="userLoading"
      value-field="id"
      clearable
      remote
      @search="userHandleSearch"
    />
  </MeModal>
</template>
