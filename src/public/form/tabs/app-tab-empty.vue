<template>
  <span class="app-tab-empty"
        @click="tabs.onSelectTab(null)"
        :class="{active: tabs.isActive(null)}"
  >
    <slot>不限</slot>
  </span>
</template>

<script>
import {TabsService} from "@/public/form";

export default {
  name: "app-tab-empty",
  di: {
    inject: {
      tabs: TabsService
    }
  }
}
</script>

<style lang="less" scoped>
.app-tab-empty {
  margin-right: 12px;
  cursor: pointer;
  &:hover {
    background: rgba(98, 87, 220, 0.3);
  }
  &.active {
    color: rgba(98, 87, 220, 1);
  }
}
</style>
