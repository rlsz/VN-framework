<template>
  <app-sticky-container class="test-sticky-container" :auto-scroll="3000" loop>
    <template v-if="show">
      <img src="../../assets/public/search_icon.png"/>
      <img src="../../assets/public/no_search.png"/>
      <img src="../../assets/public/icon_minus-circle.png"/>
      <img src="../../assets/public/icon_plus-circle.png"/>
    </template>
    <span v-else>loading</span>
  </app-sticky-container>
</template>

<script>
export default {
  name: "stickyContainer",
  data() {
    return {
      show: false
    }
  },
  created() {
    setTimeout(() => {
      this.show = true
    }, 3000)
  }
}
</script>

<style lang="less" scoped>
.test-sticky-container {
  img {
    //border: 1px solid green;
    width: 100px;
    margin: 10px 5%;
    height: 100px;
  }
}
</style>
