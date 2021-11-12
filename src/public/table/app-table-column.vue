<script>
import {AppTableService} from "./app-table.service";
import Vue from 'vue'
import {GeneratorFactory} from "@/public/base";

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

function defaultRenderCell(h, {row, column, $index}) {
  const property = column.property;
  const value = property && getPropByPath(row, property).v;
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value;
}

const NewID = GeneratorFactory('table-column-id_')
export default {
  name: "app-table-column",
  props: [
    'type', 'property', 'prop', 'label', 'align', 'width', 'min-width',
    'vertical', 'limit-line', 'highlight',
    'expend-column'
  ],
  di: {
    inject: {
      ats: AppTableService
    }
  },
  data() {
    return {
      // id: Symbol('app-table-column-id')
      id: NewID()
    }
  },
  computed: {
    propConfig() {
      let {
        id,
        type, label, align, width, minWidth, property, prop,
        vertical,
        limitLine,
        highlight
      } = this
      property = property || prop
      vertical = vertical === '' || !!vertical
      limitLine = limitLine === '' ? 1 : limitLine
      highlight = typeof highlight === 'string' ? [highlight] : highlight
      return {
        id,
        type, label, align, width, minWidth, property,
        vertical, limitLine, highlight
      }
    },
    isShowExpendIcon() {
      const {type} = this.propConfig
      if (type === 'selection') {
        return false
      }
      if (type === 'expend') {
        return true
      }
      if(this.ats.columnsConfig.find(c => c.type === 'expend')) {
        return false
      }
      if (this.ats.columnsConfig.find(c => c.type !== 'selection') === this.config) {
        return true
      }
      return false
    },
    config() {
      const {$scopedSlots, propConfig: {type, label, limitLine, highlight}} = this
      const renderHeader = (h, scope) => {
        let children
        if ($scopedSlots.header) {
          children = $scopedSlots.header(scope)
        } else if (type === 'selection') {
          children = (
              <app-checkbox value={scope.selected}
                            on-input={$event => this.ats.toggleSelectAll($event)}
                            disabled={!this.ats.list || !this.ats.list.length}
              ></app-checkbox>
          )
        } else {
          children = label
        }
        return (
            <div class={this.calcCellClass(scope.column)} style={this.calcCellStyle(scope.column)}>{children}</div>);
      }
      const renderCell = (h, scope) => {
        let children
        if ($scopedSlots.default) {
          children = $scopedSlots.default(scope)
        } else if (type === 'selection') {
          children = (<app-checkbox value={scope.selected}
                                    on-input={$event => this.ats.toggleSelectRow(scope, $event)}></app-checkbox>)
        } else {
          children = defaultRenderCell(h, scope)
        }
        if (highlight && highlight.length) {
          const temp = new (Vue.extend({
            render: () => (<span>{children}</span>)
          }))();
          temp.$mount()
          children = (<span v-html-new={this.$options.filters.highlight(temp.$el.innerHTML, highlight)}></span>)
        }
        if (limitLine) {
          children = (<span v-limit-line={limitLine}>{children}</span>)
        }
        let expend, expendIndent
        if (this.isShowExpendIcon) {
          const {children} = this.ats.treeProps || {}
          if (scope.row[children] && scope.row[children].length) {
            let status = this.ats.expendList.indexOf(scope.row) >= 0
            expend = (<i class={status ? 'arrow down' : 'arrow right'} v-on:click={() => this.ats.toggleExpend(scope.row)}></i>)
          } else {
            expend = (<span class="app-table_expend_placeholder" style={'padding-left:21px'}></span>)
          }
          if(scope.level) {
            expendIndent = (<span class="app-table_indent" style={'padding-left:'+scope.level*21+'px'}></span>)
          }
        }
        return (
            <div class={this.calcCellClass(scope.column)}
                 style={this.calcCellStyle(scope.column)}
                // key={ 'cell-row-' + scope.$index + '-column-' + scope.column.id }
            >{expendIndent}{expend}{children}</div>
        );
      };
      return {...this.propConfig, renderHeader, renderCell}
    }
  },
  watch: {
    propConfig() {
      this.ats.setColumn(this.config)
    }
  },
  created() {
  },
  mounted() {
    this.ats.setColumn(this.config)
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
      if (column.minWidth) {
        style['flex'] = `1 0 ${column.minWidth}px`
      }
      if (column.width) {
        style['flex'] = `0 0 ${column.width}px`
      }
      if (column.vertical) {
        style['flex-direction'] = 'column'
        if (column.align === 'left') {
          style['align-items'] = 'flex-start'
        }
        if (column.align === 'right') {
          style['align-items'] = 'flex-end'
        }
      } else {
        if (column.align === 'left') {
          style['justify-content'] = 'flex-start'
        }
        if (column.align === 'right') {
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
