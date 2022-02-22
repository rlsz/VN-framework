<template>
  <div class="flex vertical">
    <span>表单测试 - 1</span>
    <input v-model="form.a"></input>
    <input v-model="form.b"></input>
    <input v-model="form.c"></input>
  </div>
</template>

<script>

class TestFormData {
  a = 'aa1'
  b = 'bb1'
}
export default {
  name: "cache-test-1",
  di: {
    providers: [TestFormData],
    inject: {
      form: TestFormData
    }
  }
}
</script>

<style scoped>

</style>
