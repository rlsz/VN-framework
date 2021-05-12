<template>
    <div class="page-frame">
      <div class="body">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    export default {
        created() {
        }
    }
</script>

<style lang="less" scoped>
a {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  padding: 0 12px;

  &.router-link-active {
    color: green;
  }
  &.router-link-exact-active {
    color: #42b983;
  }
}
.body {
  padding: 8px 20px;
}
.header {
  overflow-x: auto;
}
</style>
