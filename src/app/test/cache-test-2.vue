<template>
  <div class="flex vertical">
    <span>表单测试 - 2</span>
    <input v-model="form.a"></input>
    <input v-model="form.b"></input>
    <input v-model="form.c"></input>
  </div>
</template>

<script>

class TestFormData {
  a = 'aa2'
  b = 'bb2'
}
export default {
  name: "cache-test-2",
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
