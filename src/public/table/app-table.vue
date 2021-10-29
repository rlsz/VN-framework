<template>
  <div class="table">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <AppTableRow header></AppTableRow>
    <template v-for="(row, index) in list">
      <AppTableRow :data="row" :index="index" :key="'table-row-'+index"></AppTableRow>
    </template>
  </div>
</template>

<script>
import {AppTableService} from "./app-table.service";
import AppTableRow from './app-table-row.vue'

/**
 * data: any[] | Promise<any[]>
 * query: (page:number,size:number) => Promise<{ data: any[], total: number }>
 */
export default {
  name: "app-table",
  props: ['data', 'query'],
  components: { AppTableRow },
  di: {
    providers: [AppTableService],
    inject: {
      ats: AppTableService
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    Promise.resolve(this.data).then(d => {
      this.list = d || []
    })
    console.log(this.ats)
  }
}
</script>

<style lang="less" scoped>
.hidden-columns {
  visibility: hidden;
  position: absolute;
  z-index: -1;
}
</style>
