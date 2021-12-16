<script>
import {AppTableService} from "./app-table.service";
import AppTableRow from './app-table-row.vue'
import AppPagination from './app-pagination.vue'
import {LoggerService} from "../logger/logger.service";
import {Dialog} from "../dialogs/dialog";

/**
 * data: any[] | Promise<any[]>
 * query: (page:number,size:number) => Promise<{ data: any[], total: number }>
 * page start from 0
 */
export default {
  name: "app-table",
  props: ['data', 'query', 'size', 'tree-props'],
  components: {AppTableRow, AppPagination},
  di: {
    providers: [AppTableService],
    inject: {
      ats: AppTableService,
      ls: LoggerService
    }
  },
  data() {
    return {
      refreshToken: false,
      dialog: this.$injector.get(Dialog, {mute:true})
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
        <div class="app-table flex vertical">
          <div class="table flex vertical">
            <div class="hidden-columns" ref="hiddenColumns">{this.$slots.default}</div>
            <AppTableRow header></AppTableRow>
            {loading}
            {empty}
            {!this.refreshToken && children}
          </div>
          {this.$slots.pagination}
        </div>
    )
  },
  updated() {
    if(this.dialog) {
      this.dialog._vm.fixPositionByAnchor()
    }
  },
  methods: {
    renderChildren(list, parent = null, parents = [], indexes = []) {
      let level = parents.length
      return list.reduce((arr, row, index) => {
        let tempIndexes = [...indexes, index]
        let key = `table-level-${level}-row-${tempIndexes.join('-')}`
        arr.push(
            <AppTableRow data={row}
                         index={index}
                         key={key}
                         level={level}
                         parent={parent}
                         parents={parents}
                         indexes={tempIndexes}
            >
            </AppTableRow>
        )
        const {children} = this.ats.treeProps || {}
        if(children && row[children]) {
          arr.push(this.renderChildren(row[children], row, [...parents, row], tempIndexes))
        }
        return arr
      }, [])
    },
    refresh() {
      this.refreshToken = true
      this.$nextTick(() => {
        this.refreshToken = false
      })
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
.table {
  min-width: fit-content;
}
</style>
