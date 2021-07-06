<template>
  <quill-editor-bridge
      v-model="content"
      @change="onEditorChange($event)"
      :upload="upload"
  />

</template>

<script>
import {AjaxService} from "@/public/base";

export default {
  name: "richText",
  di: {
    inject: {
      ajax: AjaxService
    }
  },
  data() {
    return {
      content: '<strong>test</strong>'
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
    },
    upload(image) {
      console.log('on upload', image)
      let form = new FormData()
      form.append("file", image);
      return this.ajax.post('file/justUpload', form).then(res => {
        console.log('upload result:', res)
      })
    }
  }
}
</script>

<style scoped>

</style>
