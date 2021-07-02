<template>
  <span class="flex wrap cross-center app-multi-select">
    <slot name="prefix"></slot>
    <slot v-bind:value="item" v-bind:index="index" v-bind:active="mss.isActive(item)" v-for="(item,index) in mss.valueOptions">
      use slotProps.value to access row data in slot template,
      https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots
    </slot>
    <slot name="suffix"></slot>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";

export default {
  name: "app-multi-select",
  props: ['value', 'valueKey', 'remoteMethod', 'multiple'],
  di: {
    providers: [MultiSelectService],
    inject: {
      mss: MultiSelectService
    }
  }
}
</script>

<style lang="less" scoped>
.app-multi-select {

}
</style>
