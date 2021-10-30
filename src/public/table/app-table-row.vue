<script>
import {AppTableService} from "./app-table.service";

export default {
  name: "app-table-row",
  props: ['header', 'data', 'index'],
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
      return temp.join(' ')
    },
    isSelected() {
      const index = this.ats.checkedList.indexOf(this.data)
      return index >= 0
    }
  },
  render(h) {
    return (<div class={ this.rowClass }>{
      this.ats.columnsConfig.map(c => {
        if (this.isHeader) {
          return c.renderHeader(h, {
            column: c,
            context: this.ats,
            selected: this.ats.allSelected
          })
        } else {
          return c.renderCell(h, {
            row: this.data,
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

<style scoped>

</style>
