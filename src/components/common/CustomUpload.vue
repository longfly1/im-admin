<script setup>
import { ref } from 'vue'
const emit = defineEmits(['update:value'])
import api from '@/api'
import { isMaxFileSize } from '@/utils'

const token = JSON.parse(localStorage.getItem('vue-naivue-admin_auth'))

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})
const fileList = ref(
  props.value
    ? [
        {
          url: props.value,
          status: 'finished',
        },
      ]
    : []
)

watchEffect(() => {
  fileList.value = props.value
    ? [
        {
          url: props.value,
          status: 'finished',
        },
      ]
    : []
})

const handleFinish = (result) => {
  if (result.code == 200) {
    emit('update:value', result.data.originUrl)
  }
}

const customRequest = ({ file, data, onFinish, onError, onProgress }) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
  }
  if (!isMaxFileSize(file.file.size, 5)) {
    $message.error('文件大小不能超过5M')
    onError()
    return
  }
  formData.append('file', file.file)
  api
    .upload(formData, {
      onUploadProgress: (result) => {
        onProgress({ percent: result.progress * 100 })
      },
    })
    .then((result) => {
      $message.success('上传成功')
      handleFinish(result)
      onFinish()
    })
    .catch((error) => {
      $message.error(error.message)
      onError()
    })
}
</script>
<template>
  <n-upload
    :default-file-list="fileList"
    list-type="image-card"
    :max="1"
    :headers="{
      Authorization: token.accessToken,
    }"
    accept="image/"
    :custom-request="customRequest"
  >
    点击上传
  </n-upload>
</template>
