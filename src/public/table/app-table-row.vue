<script>
import {AppTableService} from "./app-table.service";

export default {
  name: "app-table-row",
  props: ['header', 'data', 'index', 'level', 'parent', 'parents'],
  di: {
    inject: {
      ats: AppTableService
    }
  },
  computed: {
    isHeader() {
      return this.header === '' || this.header
    },
    rowClass() {
      const temp = ['row']
      if(this.isHeader) {
        temp.push('header')
      }
      if(this.isHidden) {
        temp.push('expend-hidden')
      }
      temp.push('row-level-' + (this.level || 0))
      return temp.join(' ')
    },
    isSelected() {
      const index = this.ats.checkedList.indexOf(this.data)
      return index >= 0
    },
    isHidden() {
      if(!this.level) {
        return false
      }
      const {children} = this.ats.treeProps || {}
      const expendParent = this.ats.expendList.find(c => {
        return c[children] && c[children].indexOf(this.data) >= 0
      })
      if(expendParent) {
        return false
      }
      return true
    }
  },
  render(h) {
    return (<div class={ this.rowClass }>{
      this.ats.columnsConfig.map((c, index) => {
        if (this.isHeader) {
          return c.renderHeader(h, {
            column: c,
            context: this.ats,
            selected: this.ats.allSelected
          })
        } else {
          return c.renderCell(h, {
            row: this.data,
            parent: this.parent,
            parents: this.parents,
            level: this.level,
            column: c,
            $index: this.index,
            context: this.ats,
            selected: this.isSelected
          })
        }
      })
    }</div>)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.expend-hidden {
  display: none
}
</style>
