<script>
import {AppTableService} from "./app-table.service";
import Vue from 'vue'

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
  props: ['type', 'property', 'label', 'align', 'width', 'min-width', 'vertical', 'limit-line', 'highlight'],
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
      let {
        type, label, align, width, minWidth, property,
        $scopedSlots, vertical,
        limitLine,
        highlight
      } = this
      limitLine = limitLine === '' ? 1 : limitLine
      highlight = typeof highlight === 'string'? [highlight]: highlight
      const renderHeader = (h, scope) => {
        return (<div class={ this.calcCellClass(scope.column) } style={ this.calcCellStyle(scope.column) }>{
          $scopedSlots.header ? $scopedSlots.header(scope) : label
        }</div>);
      }
      const renderCell = (h, scope) => {
        let children = $scopedSlots.default? $scopedSlots.default(scope): defaultRenderCell(h, scope)
        if(highlight) {
          const temp = new (Vue.extend({
            render: () => ( <span>{children}</span> )
          }))();
          temp.$mount()
          children = ( <span v-html-new={this.$options.filters.highlight(temp.$el.innerHTML, highlight)}></span> )
        }
        if(limitLine) {
          children = ( <span v-limit-line={limitLine}>{children}</span> )
        }
        return (<div class={ this.calcCellClass(scope.column) } style={ this.calcCellStyle(scope.column) }>{
          children
        }</div>);
      };
      return {
        type, label, align, width, minWidth, property,
        renderHeader, renderCell,
        vertical: vertical === '' || !!vertical,
        limitLine
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
    calcCellClass(column) {
      let temp = ['cell']
      return temp.join(' ')
    },
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
        if(column.align === 'left') {
          style['align-items'] = 'flex-start'
        }
        if(column.align === 'right') {
          style['align-items'] = 'flex-end'
        }
      } else {
        if(column.align === 'left') {
          style['justify-content'] = 'flex-start'
        }
        if(column.align === 'right') {
          style['justify-content'] = 'flex-end'
        }
      }
      return Object.keys(style).map(key => key + ':' + style[key]).join(';')
    }
  }
}
</script>

<style scoped>

</style>
