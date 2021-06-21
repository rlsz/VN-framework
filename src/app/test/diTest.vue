<template>
  <div class="flex vertical">
    <div>
      <span>-a:{{test.a}}-</span>
      <span>-aa:{{test.aa}}-</span>
    </div>
    <div>
      <span>-b:{{test.b}}-</span>
      <span>-bb:{{test.bb}}-</span>
    </div>
    <div>
      <span>-aabb:{{test.aabb}}-</span>
    </div>
    <button class="app-form" @click="tester">test</button>
  </div>
</template>

<script>
// https://vuejs.org/v2/api/#vm-watch
class Test {
  a = 1
  aa
  b = 2
  bb
  aabb
  diCreated(vm) {
    vm.$watch(
        () => {
          return this.a + this.b
        },
        (newVal, oldVal) => {
          this.aabb = newVal
        }
    )
  }
}
export default {
  name: "diTest",
  di: {
    providers: [Test],
    inject: {
      test: Test
    }
  },
  methods: {
    tester() {
      this.test.a += 2
      this.test.b += 2
    }
  }
}
</script>

<style scoped>

</style>
