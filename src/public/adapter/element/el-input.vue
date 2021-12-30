<template>
  <el-input-original
      v-bind="{ ...$attrs, value }"
      v-on="{ ...$listeners }"
      v-if="editable"
  >
    <template v-for="(_, slot) of $slots" :slot="slot">
      <slot :name="slot"/>
    </template>
    <template v-for="(_, scopedSlot) of $scopedSlots" v-slot:[scopedSlot]="scope">
      <slot :name="scopedSlot" v-bind="scope"/>
    </template>
  </el-input-original>
  <div v-else class="app-input-mode-detail">{{value}}</div>
</template>

<script>
import {Input} from 'element-ui';
import {FORM_MODEL, FormModel} from "../../form/form-model";
import {Optional} from "../../di.service";

export default {
  name: "el-input",
  components: {
    'el-input-original': Input
  },
  props: ['value'],
  di: {
    inject: {
      formModel: Optional(FORM_MODEL)
    }
  },
  computed: {
    editable() {
      if(this.formModel === FormModel.detail) {
        return false
      }
      if(this.$listeners.input) {
        return true
      }
      return true
    }
  },
  created() {

  }
}
</script>

<style lang="less" scoped>
.app-input-mode-detail {
  display: block;
  color: rgb(96, 98, 102);
}
</style>
