<!--<template>-->
<!--  <div class="app-table table flex vertical">-->
<!--    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>-->
<!--    <AppTableRow header></AppTableRow>-->
<!--    <template v-for="(row, index) in ats.list">-->
<!--      <AppTableRow :data="row" :index="index" :key="'table-row-'+index+'-level-'+0"></AppTableRow>-->
<!--    </template>-->
<!--    <span v-if="ats.loading" class="table-loading flex center">-->
<!--      <i class="loading-general"></i>-->
<!--    </span>-->
<!--    <span v-if="!ats.loading && (!ats.list || !ats.list.length)" class="table-empty">-->
<!--      <i class="empty"></i>-->
<!--    </span>-->
<!--    <AppPagination v-if="ats.showPagination"></AppPagination>-->
<!--  </div>-->
<!--</template>-->

<script>
import {AppTableService} from "./app-table.service";
import AppTableRow from './app-table-row.vue'
import AppPagination from './app-pagination.vue'

/**
 * data: any[] | Promise<any[]>
 * query: (page:number,size:number) => Promise<{ data: any[], total: number }>
 * page start from 0
 */
export default {
  name: "app-table",
  props: ['data', 'query', 'size', 'tree-props', 'row-key'],
  components: {AppTableRow, AppPagination},
  di: {
    providers: [AppTableService],
    inject: {
      ats: AppTableService
    }
  },
  render(h) {
    let loading,empty,children
    if(this.ats.loading) {
      loading = (
          <span class="table-loading flex center">
            <i class="loading-general"></i>
          </span>
      )
    }
    if(!this.ats.loading && (!this.ats.list || !this.ats.list.length)) {
      empty = (
          <span class="table-empty">
            <i class="empty"></i>
          </span>
      )
    }
    if(this.ats.list) {
      children = this.renderChildren(this.ats.list)
    }

    return (
        <div class="app-table table flex vertical">
          <div class="hidden-columns" ref="hiddenColumns">{this.$slots.default}</div>
          <AppTableRow header></AppTableRow>
          { loading }
          { empty }
          { children }
        </div>
    )
  },
  methods: {
    renderChildren(list, parent = null, parents = []) {
      let level = parents.length
      return list.reduce((arr, row, index) => {
        arr.push(
            <AppTableRow data={row}
                         index={index} key={'table-row-' + index + '-level-' + level}
                         level={level}
                         parent={parent}
                         parents={parents}
            >
            </AppTableRow>
        )
        const {children} = this.ats.treeProps || {}
        if(children && row[children]) {
          arr.push(this.renderChildren(row[children], row, [...parents, row]))
        }
        return arr
      }, [])
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

.table-empty {
  padding: 20px;
}

.table-loading {
  padding: 40px 20px;
}
</style>
