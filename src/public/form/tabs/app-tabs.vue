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

</style>
