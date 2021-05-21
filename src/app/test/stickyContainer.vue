<template>
  <div class="flex vertical">
    <app-sticky-container class="test-sticky-container" :auto-scroll="3000" loop>
      <template v-if="show">
        <img src="../../assets/public/search_icon.png"/>
        <img src="../../assets/public/no_search.png"/>
        <img src="../../assets/public/icon_minus-circle.png"/>
        <img src="../../assets/public/icon_plus-circle.png"/>
      </template>
      <span v-else>loading</span>
    </app-sticky-container>
    <app-sticky-container class="test-sticky-container" :auto-scroll="3000" loop>
      <div class="test-inner">1111</div>
      <div class="test-inner">2222</div>
      <div class="test-inner">3333</div>
    </app-sticky-container>
  </div>
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
  border: 1px solid yellow;
  margin: 10px 0;
  img {
    //border: 1px solid green;
    width: 100px;
    margin: 10px 5%;
    height: 100px;
  }
}
.test-inner {
  width: calc(100% - 40px);
  margin: 0 3px;
  height: 200px;
  &:nth-child(odd) {
    background: green;
  }
  &:nth-child(even) {
    background: #4c89ff;
  }
}
</style>
