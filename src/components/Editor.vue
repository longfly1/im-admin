<template>
  <div style="border: 1px solid #ccc" class="w-full">
    <!-- :default-config="toolbarConfig" -->
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :mode="mode" />
    <Editor
      style="height: 200px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, computed, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const emit = defineEmits(['update:value'])

const props = defineProps({
  value: String,
  default: '',
})
const apiUrl = import.meta.env.VITE_PROXY_TARGET
const token = JSON.parse(localStorage.getItem('vue-naivue-admin_auth'))

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// const toolbarConfig = {
//   // 显示操作菜单
//   toolbarKeys: [
//     'headerSelect',
//     'underline',
//     'italic',
//     'bold',
//     'fontSize',
//     'color',
//     'fontFamily',
//     'justifyLeft',
//     'justifyRight',
//     'justifyCenter',
//     'emotion',
//     'group-image',
//     'insertLink',
//     'insertTable',
//     'codeBlock',
//     'divider',
//     'undo',
//     'redo',
//     'fullScreen',
//   ],
// }
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: `${apiUrl}/file/upload`,
      headers: { Authorization: token.accessToken },
      fieldName: 'file',
      customInsert(res, insertFn) {
        if (res.code == 200) {
          // let { url, alt, href } = res.data
          insertFn(res.data)
        }
      },
    },
  },
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editorRef.value.setHtml(props.value)
}
const handleChange = (editor) => {
  emit('update:value', editor.getHtml())
}
</script>
