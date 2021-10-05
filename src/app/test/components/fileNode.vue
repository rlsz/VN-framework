<template>
  <div class="file-node">
    <span>file-to-show</span>
  </div>
</template>

<script>
export default {
  name: "fileNode",
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: null
  }
}
</script>

<style lang="less" scoped>
.file-node {

}
</style>
