<template>
  <div class="flex vertical">
    <span>表单测试</span>
    <input v-model="form.a"></input>
    <input v-model="form.b"></input>
    <input v-model="form.c"></input>
    <button class="app-form" @click="form.clear()">清除缓存</button>
  </div>
</template>

<script>
import {PersistenceBase} from "@/public/base";

class TestFormData extends PersistenceBase {
  a = 'aa'
  b = 'bb'
}

export default {
  name: "persistenceTest",
  di: {
    providers: [TestFormData],
    inject: {
      form: TestFormData
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin: 10px 5px;
}
</style>
