<template>
  <span class="app-tab"
        @click="tabs.onSelectTab(option)"
        :class="{active: tabs.value === option, disabled: disabled}"
  >
    <slot>{{option}}</slot>
  </span>
</template>

<script>
import {TabsService} from "./tabs.service";

export default {
  name: "app-tab",
  props: ['option', 'cancelable'],
  di: {
    inject: {
      tabs: TabsService
    }
  },
  computed: {
    disabled() {
      let cancelable = !!this.cancelable
      if(this.cancelable === '') {
        cancelable = true
      }
      if(cancelable) {
        return false
      } else {
        return this.tabs.value === this.option
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-tab {
  cursor: pointer;
  &.disabled {
    pointer-events: none;
  }
  &:hover {
    background: rgba(98, 87, 220, 0.3);
  }
}
</style>
