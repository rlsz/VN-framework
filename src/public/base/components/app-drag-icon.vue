<template>
  <span class="app-drag-icon flex vertical">
    <span></span>
    <span></span>
    <span></span>
  </span>
</template>

<script>
export default {
  name: "app-drag-icon"
}
</script>

<style lang="less" scoped>
.app-drag-icon {
  width: 16px;
  height: 16px;
  padding: 0px 3px;
  cursor: pointer;
  > * {
    border: 1px solid #757c94;
    margin-top: auto;
    &:last-child {
      margin-bottom: auto;
    }
  }
}
</style>
