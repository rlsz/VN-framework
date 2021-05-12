<template>
  <div :key="value.path" class="app-menu-item">
    <router-link :to="value.path">{{ value.text }}</router-link>
    <app-menu v-if="value.children && value.children.length"
              :value="value.children"
              :level="level + 1"
              class="flex vertical"
    ></app-menu>
  </div>
</template>
<script>
export default {
  name: "app-menu-item",
  components: {
    appMenu: () => import('./app-menu')
  },
  props: ['value', 'level'],
  created() {

  }
}
</script>

<style lang="less" scoped>
.app-menu-item {
  a {
    padding: 0 8px;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-active {
      color: green;
    }

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  .app-menu {
    margin-left: 8px;
  }
}
</style>
