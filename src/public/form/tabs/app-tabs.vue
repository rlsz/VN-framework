<template>
  <span class="app-tabs">
    <slot name="prefix"></slot>
    <slot v-bind:value="item" v-bind:active="tabs.isActive(item)" v-for="(item,index) in options">
      use slotProps.value to access row data in slot template,
      https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots
    </slot>
    <slot name="suffix"></slot>
  </span>
</template>

<script>
import {TabsService} from "./tabs.service";

export default {
  name: "app-tabs",
  props: ['options', 'value', 'multiple', 'value-key'],
  di: {
    providers: [TabsService],
    inject: {
      tabs: TabsService
    }
  }
}
</script>

<style lang="less" scoped>
.app-tabs {
  display: flex;
  border-bottom: 1px solid #ebedf0;

  /deep/ .app-tab {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    border-bottom: 2px solid #ffffff;

    padding: 10px 0px 12px;
    margin: 0 20px;

    &.active {
      color: #4C7CEE;
      border-bottom-color: #4C7CEE;
      pointer-events: none;
    }

    &:hover {
      color: #4C7CEE;
      background: inherit;
    }
  }
}
</style>
