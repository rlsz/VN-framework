<template>
  <div class="flex vertical">
    <span>多选测试:</span>
    <app-multi-select v-model="form.tags" :remote-method="query" value-key="value">
      <template v-slot:default="{value}">
        <app-option :option="value" :key="value.value">{{ value.label }}</app-option>
      </template>
      <app-option-input slot="suffix" placeholder="请输入话题名称">
        +添加话题
        <span v-if="form.tags">（{{form.tags.length}}/5）</span>
      </app-option-input>
    </app-multi-select>
  </div>
</template>

<script>
let i = 1
export default {
  name: "formTest",
  data() {
    return {
      form: {
        tags: [
          {label: 'test' + i, value: i++},
          {label: 'test' + i, value: i++},
          {label: 'test' + i, value: i++}
        ]
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
