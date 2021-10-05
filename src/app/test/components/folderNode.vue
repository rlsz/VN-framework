<template>
  <div class="folder-node">
    <div v-for="(item, key) in value">
      <span>{{key}}:</span>
      <fileNode v-if="isFile(item)" :value="item" :level="level+1"></fileNode>
      <folderNode v-else :value="item" :level="level+1"></folderNode>
    </div>
  </div>
</template>

<script>
import fileNode from './fileNode.vue'
export default {
  name: "folderNode",
  components: {
    fileNode,
    folderNode: () => import('./folderNode')
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: {}
    }
  },
  methods: {
    isFile(target) {
      return target instanceof Blob
    }
  }
}
</script>

<style lang="less" scoped>
.folder-node {

}
</style>
