<template>
  <div class="flex vertical">
    <div class="flex vertical">
      <span>select test</span>
      <app-select placeholder="请选择"
                  :options="testOptions"
                  label-key="label"
                  v-model="testValue"
      ></app-select>
    </div>
    <div class="flex cross-center">
      <span>label-key: label</span>
      <app-select placeholder="请选择"
                  :options="testOptions"
                  label-key="label"
                  v-model="testValue"
      ></app-select>
    </div>
    <div class="flex cross-center">
      <span>label-key: label; value-key: value</span>
      <app-select placeholder="请选择"
                  :options="testOptions"
                  label-key="label"
                  value-key="value"
                  v-model="testValue1"
      ></app-select>
    </div>
    <div class="flex cross-center">
      <span>label-key: label; id-key: value</span>
      <app-select placeholder="请选择"
                  :options="testOptions"
                  label-key="label"
                  id-key="value"
                  v-model="testValue2"
      ></app-select>
    </div>
    <div class="flex cross-center">
      <span>label-key: label; id-key: value; max-width</span>
      <app-select placeholder="请选择"
                  :options="testOptions"
                  label-key="label"
                  id-key="value"
                  v-model="testValue2"
                  style="max-width: 250px"
      ></app-select>
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
      ]),
      testValue: {label: "对齐语料", value: 2},
      testValue1: 2,
      testValue2: {label: "对齐语料", value: 2},
      testValue3: [{label: "对齐语料", value: 2}, {label: "对齐语料", value: 2}]
    }
  }
}
</script>

<style scoped>

</style>
