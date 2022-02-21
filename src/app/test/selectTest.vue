<template>
  <div class="flex vertical">
    <span>select test</span>
    <app-select placeholder="请选择" :options="testOptions"></app-select>
  </div>
</template>

<script>
export default {
  name: "selectTest",
  data() {
    return {
      testOptions: Promise.resolve([{label: "普通语料", value: 1,}, {label: "对齐语料", value: 2}])
    }
  }
}
</script>

<style scoped>

</style>
