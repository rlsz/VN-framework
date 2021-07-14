<template>
  <div class="flex vertical">
    <span>多选测试:</span>
    <app-multi-select v-model="form.tags" :remote-method="query" value-key="value">
      <template v-slot:default="{value}">
        <app-option :option="value" :key="'app-multi-select-option-' + value.value">{{ value.label }}</app-option>
      </template>
      <template v-slot:dropdown-option="{value}">
        <app-option-dropdown :option="value" :key="'app-multi-select-dropdown-option-' + value.value">{{ value.label }}</app-option-dropdown>
      </template>
      <app-option-input slot="suffix" placeholder="请输入话题名称">
        +添加话题
        <span v-if="form.tags">（{{form.tags.length}}/5）</span>
      </app-option-input>
    </app-multi-select>
    <div>
      <app-textarea v-model="form.text"></app-textarea>
    </div>
    <div>
      <button class="app-form" @click="openDialog">弹窗表单测试</button>
    </div>
  </div>
</template>

<script>
import formTestDialog from "./components/formTestDialog";
import {DialogService} from "@/public/dialogs";
let i = 1
export default {
  name: "formTest",
  di: {
    inject: {
      ds: DialogService
    }
  },
  data() {
    return {
      form: {
        tags: [
          {label: 'test' + i, value: i++},
          {label: 'test' + i, value: i++},
          {label: 'test' + i, value: i++}
        ],
        text: 'test'
      }
    }
  },
  methods: {
    query(keyword) {
      return Promise.resolve([
        {label: 'test' + i, value: i++},
        {label: 'test' + i, value: i++},
        {label: 'test' + i, value: i++}
      ])
    },
    openDialog(e) {
      this.ds.open(formTestDialog)
    }
  }
}
</script>

<style lang="less" scoped>
//.test-2 {
//  color: red;
//}
</style>
