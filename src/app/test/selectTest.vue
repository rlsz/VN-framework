<template>
  <div class="flex vertical">
    <div class="flex vertical">
      <span>select test</span>
      <app-select placeholder="请选择" :options="testOptions"></app-select>
    </div>
    <div class="flex">
      <span>select test</span>
      <app-select placeholder="请选择" :options="testOptions"></app-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectTest",
  data() {
    return {
      testOptions: Promise.resolve([
        {label: "普通语料", value: 1},
        {label: "对齐语料", value: 2},
        {label: "long text test long text test long text test long text test long text test long text test long text test", value: 3}
      ])
    }
  }
}
</script>

<style scoped>

</style>
