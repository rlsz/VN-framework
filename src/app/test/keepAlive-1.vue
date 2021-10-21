<template>
  <div class="flex" style="flex: 1 1 0px;">
    <app-scroll hold="test-1">
      <app-list-scrollable class="data-list" :query="query" :size="50">
        <template v-slot:default="{value}">
          <div class="row-item">{{ value }}</div>
        </template>
      </app-list-scrollable>
    </app-scroll>
    <app-scroll hold="test-2">
      <app-list-scrollable class="data-list" :query="query" :size="50">
        <template v-slot:default="{value}">
          <div class="row-item">{{ value }}</div>
        </template>
      </app-list-scrollable>
    </app-scroll>
  </div>
</template>

<script>
export default {
  created() {
    console.log('keep alive test 1 created')
  },
  activated() {
    console.log('keep alive test 1 activated')
  },
  data() {
    return {
      query: (page, size) => {
        return new Promise((r) => {
          setTimeout(() => {
            r(page > 5 ? ['end 1', 'end 2'] :
                new Array(size).fill(0).map((c, i) => 'aaa ' + (page * size + i)))
          }, 1000)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
