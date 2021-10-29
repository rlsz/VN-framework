<template>
  <div class="table">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <AppTableRow header></AppTableRow>
    <template v-for="(row, index) in ats.list">
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
 * page start from 0
 */
export default {
  name: "app-table",
  props: ['data', 'query', 'size'],
  components: { AppTableRow },
  di: {
    providers: [AppTableService],
    inject: {
      ats: AppTableService
    }
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
