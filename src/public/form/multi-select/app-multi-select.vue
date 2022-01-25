<template>
  <span class="flex wrap cross-center app-multi-select">
    <slot name="prefix"></slot>
    <slot v-bind:value="item" v-bind:index="index" v-bind:active="mss.isActive(item)" v-for="(item,index) in mss.valueOptions"></slot>
    <span ref="dropdownContent" class="dropdown-content">
      <slot name="dropdown-option" v-bind:value="item" v-bind:index="index" v-bind:active="mss.isActive(item)" v-for="(item,index) in mss.allOptions"></slot>
    </span>
    <slot name="suffix"></slot>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";

export default {
  name: "app-multi-select",
  props: ['value', 'valueKey', 'remoteMethod', 'multiple', 'multipleLimit'],
  di: {
    providers: [MultiSelectService],
    inject: {
      mss: MultiSelectService
    }
  },
  mounted() {
    this.mss.dropdownOption = this.$scopedSlots['dropdown-option']
    // this.$refs.dropdownContent.remove()
  }
}
</script>

<style lang="less" scoped>
.app-multi-select {

}
.dropdown-content {
  display: none;
}
</style>
