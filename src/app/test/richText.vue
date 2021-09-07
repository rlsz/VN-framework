<template>
  <quill-editor-bridge
      v-model="content"
      @change="onEditorChange($event)"
      :upload="upload"
  />

</template>

<script>
import {AjaxService, ConvertImageToCanvas, ReadImage} from "@/public/base";

export default {
  name: "richText",
  di: {
    inject: {
      ajax: AjaxService
    }
  },
  data() {
    return {
      content: "<p>asd<img src=\"https://doc.aigauss.com/header_img/20210707/nlpCommunity__29525dfcf52bd6fa506f92b90cce3261.png\">sdaw<img src=\"https://doc.aigauss.com/header_img/20210708/nlpCommunity__a2126f2d05a30635236913e2c64f0eb8.jpeg\" crossorigin=\"anonymous\">s<img src=\"https://doc.aigauss.com/header_img/20210707/nlpCommunity__4e4cbf702226ca0db4973c453016c310.png\">da</p>"
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      console.log('onEditorChange richtext', { quill, html, text })
    },
    upload(image) {
      console.log('on upload', image)
      return ReadImage(image).then(res => res.src)
      // let form = new FormData()
      // form.append("file", image);
      // return this.ajax.post('file/justUpload', form).then(res => {
      //   console.log('upload result:', res)
      // })
    }
  }
}
</script>

<style scoped>

</style>
