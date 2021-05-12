<template>
  <div class="app-menu" :class="{scroll: level === 0, 'app-menu-root': level === 0}">
    <app-menu-item v-for="item in value" :value="item" :level="level" :key="item.path"></app-menu-item>
  </div>
</template>

<script>
import appMenuItem from './app-menu-item.vue'
export default {
  name: "app-menu",
  components: {appMenuItem},
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style lang="less" scoped>
.app-menu {
  font-size: 16px;
  &.app-menu-root {
    flex: 0 0 200px;
    padding: 30px;
  }
}
</style>
