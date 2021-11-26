<template>
  <div class="flex vertical">
    <app-drag-icon v-drag-start></app-drag-icon>
    <app-checkbox v-drag-start="dragData"></app-checkbox>
    <span id="drag-1" v-drag-start="dragData">item to drag 1</span>
    <span id="drag-2">item to drag 2 (invalid drag: no draggable attribute)</span>
    <span id="drag-3">item to drag 3, allow move</span>
    <span id="drag-4">item to drag 4, allow copy</span>
    <span id="target-1">target to drop 1 (invalid drop: no dragover listener)</span>
    <span id="target-2">target to drop 2</span>
    <span id="target-3">target to drop 3, allow move</span>
    <span id="target-4" v-drag-end="onDragEnd">
      <span>target to drop 4, allow copy</span>
      <span>inner item</span>
    </span>
  </div>
</template>

<script>

import {debounceTime} from "@/public/base";

export default {
  name: "dragTest",
  data() {
    return {
      dragData: 'test drag data'
    }
  },
  created() {
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    onDragEnd(data, sourceElement) {
      console.log('onDragEnd', data, sourceElement, this)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
