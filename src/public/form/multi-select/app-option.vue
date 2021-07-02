<template>
  <span class="flex inline cross-center app-option">
    <slot>{{option}}</slot>
    <svg @click="onDel()" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.853553 6.85355C0.658291 7.04882 0.341709 7.04882 0.146447 6.85355C-0.0488155 6.65829 -0.0488155 6.34171 0.146447 6.14645L2.79289 3.5L0.146447 0.853554C-0.0488155 0.658292 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488153 0.658291 -0.0488153 0.853553 0.146447L3.5 2.79289L6.14645 0.146447C6.34171 -0.0488156 6.65829 -0.0488156 6.85355 0.146447C7.04882 0.341709 7.04882 0.658291 6.85355 0.853553L4.20711 3.5L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355C6.65829 7.04882 6.34171 7.04882 6.14645 6.85355L3.5 4.20711L0.853553 6.85355Z" fill="#6257DC"/>
    </svg>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";

export default {
  name: "app-option",
  props: ['option'],
  di: {
    inject: {
      mss: MultiSelectService
    }
  },
  methods: {
    onDel() {
      console.log(this.option)
    }
  }
}
</script>

<style lang="less" scoped>
.app-option {
  padding: 4px 6px;
  background: #E9E7FF;
  border-radius: 4px;

  font-family: PingFang SC;
  font-size: 14px;
  line-height: 20px;
  color: #6257DC;

  margin-right: 10px;
  margin-bottom: 4px;
  svg {
    margin-left: 6px;
    cursor: pointer;
  }
}
</style>
