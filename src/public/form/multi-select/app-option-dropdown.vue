<template>
  <span class="app-option-dropdown" :class="{active: mss.isActive(option)}" @click="onClick">
    <slot>{{option}}</slot>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";

export default {
  name: "app-option-dropdown",
  props: ['option'],
  di: {
    inject: {
      mss: MultiSelectService
    }
  },
  methods: {
    onClick() {
      this.mss.onSelectOption(this.option)
    }
  }
}
</script>

<style lang="less" scoped>
.app-option-dropdown {
  padding: 9px 2px;
  border-radius: 4px;
  border-bottom: 1px solid #E9EEF8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &.active {
    color: #6257DC;
    &:after {
      cursor: pointer;
      content: "";
      margin-left: 8px;
      margin-right: 8px;
      border: solid #6257DC;
      border-width: 0 1px 1px 0;
      padding: 4px 2px;
      transform: rotate(45deg) translateY(-2px);
      margin-left: auto;
    }
  }
}
</style>
