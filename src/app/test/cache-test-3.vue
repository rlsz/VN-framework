<template>
  <div class="flex vertical">
    <span>表单测试 - 3</span>
    <input v-model="form.a"></input>
    <input v-model="form.b"></input>
    <input v-model="form.c"></input>
  </div>
</template>

<script>

class TestFormData {
  a = 'aa3'
  b = 'bb3'
}
export default {
  name: "cache-test-3",
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
