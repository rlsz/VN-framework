<template>
  <router-view v-if="show"></router-view>
</template>

<script>
export default {
  data() {
    return {
      show: null
    }
  },
  watch: {},
  activated() {
    this.show = false
    this.$nextTick(() => {
      if (this.show === false) {
        this.show = true
      }
    })
  },
  deactivated() {
    this.show = null
  }
}
</script>

<style scoped>

</style>
