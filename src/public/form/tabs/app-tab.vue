<template>
  <span class="app-tab" @click="tabs.onSelectTab(option)" :class="{active: tabs.active === option}">
    <slot>{{option}}</slot>
  </span>
</template>

<script>
import {TabsService} from "./tabs.service";

export default {
  name: "app-tab",
  props: ['option'],
  di: {
    inject: {
      tabs: TabsService
    }
  }
}
</script>

<style lang="less" scoped>
.app-tab {
  cursor: pointer;
  &.active {
    pointer-events: none;
  }
  &:hover {
    background: rgba(98, 87, 220, 0.3);
  }
}
</style>
