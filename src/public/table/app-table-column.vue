<script>
import {AppTableService} from "./app-table.service";

function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
};
function defaultRenderCell(h, { row, column, $index }) {
  const property = column.property;
  const value = property && getPropByPath(row, property).v;
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value;
}
let index = 0
export default {
  name: "app-table-column",
  props: ['type', 'label', 'align', 'width', 'min-width', 'vertical'],
  di: {
    inject: {
      ats: AppTableService
    }
  },
  data() {
    return {

    }
  },
  computed: {
    config() {
      const {type, label, align, width, minWidth, $scopedSlots, vertical} = this
      const renderHeader = (h, scope) => {
        return (<div class="cell" style={ this.calcCellStyle(scope.column) }>{
          $scopedSlots.header ? $scopedSlots.header(scope) : label
        }</div>);
      }
      const renderCell = (h, scope) => {
        return (<div class="cell" style={ this.calcCellStyle(scope.column) }>{
          $scopedSlots.default? $scopedSlots.default(scope): defaultRenderCell(h, scope)
        }</div>);
      };
      return {
        type, label, align, width, minWidth,
        renderHeader, renderCell,
        vertical: vertical === '' || !!vertical
      }
    }
  },
  created() {

  },
  mounted() {
    this.ats.addColumn(this.config)
  },
  render(h) {
    return h('div', this.$slots.default);
  },
  methods: {
    calcCellStyle(column) {
      let style = {}
      if(column.minWidth) {
        style['flex'] = `1 0 ${column.minWidth}px`
      }
      if(column.width) {
        style['flex'] = `0 0 ${column.width}px`
      }
      if(column.vertical) {
        style['flex-direction'] = 'column'
      }
      return Object.keys(style).map(key => key + ':' + style[key]).join(';')
    }
  }
}
</script>

<style scoped>

</style>
