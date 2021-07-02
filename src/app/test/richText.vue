<template>
  <quill-editor
      ref="myQuillEditor"
      v-model="content"
      @change="onEditorChange($event)"
  />

</template>

<script>
export default {
  name: "richText",
  data() {
    return {
      content: '<strong>test</strong>'
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
    }
  }
}
</script>

<style scoped>

</style>
