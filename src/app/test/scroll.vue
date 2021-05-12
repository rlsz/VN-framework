<template>
  <div class="flex vertical" style="flex: 1 1 0px;">
    <div>frozen things,
      <button @click="refresh()">change query condition</button>
    </div>
    <app-scroll hold>
      <app-list-scrollable class="data-list" :query="query" :size="50">
        <template v-slot:default="{value}">
          <div class="row-item">{{ value }}</div>
        </template>
<!--        <template v-slot:finished>-->
<!--          <span class="flex center">已经到底了~</span>-->
<!--        </template>-->
<!--        <template v-slot:empty>-->
<!--          <span>暂无结果</span>-->
<!--          <i class="no-search"></i>-->
<!--        </template>-->
      </app-list-scrollable>
    </app-scroll>
  </div>
</template>

<script>
export default {
  name: "scroll",
  data() {
    return {
      query: null
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.query = (page, size) => {
        return new Promise((r) => {
          setTimeout(() => {
            r(page > 5 ? ['end 1', 'end 2'] :
                new Array(size).fill(0).map((c, i) => 'aaa ' + (page * size + i)))
          }, 1000)
        })
      }
    },
    // pullTop() {
    //   console.log('pullTop')
    // },
    // pullBottom() {
    //   console.log('pullBottom')
    // }
  }
}
</script>

<style lang="less" scoped>
.data-list {
  ///deep/ .content-wrapper {
  //  flex-direction: row;
  //  flex-wrap: wrap;
  //  > * {
  //    flex: 0 0 50%;
  //    min-width: 0px;
  //    //min-height: 100px;
  //  }
  //}
}
</style>
