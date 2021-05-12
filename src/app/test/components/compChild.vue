<template>
  <div>
    <span>child</span>
  </div>
</template>

<script>
export default {
  name: "compChild",
  created() {
    console.log('parent of compChild:',this.$parent)
  }
}
</script>

<style scoped>

</style>
