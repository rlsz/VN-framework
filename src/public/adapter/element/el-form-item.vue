<template>
  <el-form-item-original
      v-bind="{ ...$attrs, value }"
      v-on="{ ...$listeners }"
  >
    <template v-for="(_, slot) of $slots" :slot="slot">
      <slot :name="slot"/>
    </template>
    <template v-for="(_, scopedSlot) of $scopedSlots" v-slot:[scopedSlot]="scope">
      <slot :name="scopedSlot" v-bind="scope"/>
    </template>
  </el-form-item-original>
</template>

<script>
import {FormItem} from 'element-ui';
import {BenchmarkService} from "../../base/services/benchmark.service";

export default {
  name: "el-input",
  components: {
    'el-form-item-original': FormItem
  },
  props: ['value'],
  di: {
    // providers: [BenchmarkService]
  }
}
</script>

<style lang="less" scoped>
.app-input-mode-detail {
  display: block;
  color: rgb(96, 98, 102);
}
</style>
