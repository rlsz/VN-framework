<template>
  <div>keep alive test 4: {{$route.params}}</div>
</template>

<script>
export default {
  created() {
    console.log('keep alive test 4 created')
  },
  activated() {
    console.log('keep alive test 4 activated')
  },
}
</script>

<style scoped>

</style>
