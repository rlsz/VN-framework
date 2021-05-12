<template>
  <!-- add class fill-available to fill container -->
  <div class="table-bridge flex vertical">
    <div class="operate-wrapper">
      <slot name="operate"></slot>
    </div>
    <div class="table-wrapper bg-white">
      <el-table ref="table"
                border
                fit
                highlight-current-row
                :header-cell-style="headerCellStyle"
                :data="list"
                @select-all="handleSelectAll"
                @select="handleSelect"
                :default-expand-all='false'
                row-key="id"
                v-loading="loading"
                v-bind="{...$props, ...$attrs}"
                v-on="{...$listeners, 'selection-change': onSelectionChange}"
      >
        <slot></slot>
      </el-table>
    </div>
    <el-pagination v-if="showPagination"
                   :current-page="page + 1"
                   @current-change="skip"
                   @size-change="handleSizeChange"
                   :layout="layout || 'prev, pager, next, sizes, jumper, slot'"
                   :page-size="pageSize"
                   :page-sizes="pageSizeList"
                   :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
/**
 * query: (page:Number,pageSize:Number) => Promise({data:Array<any>,total:Number})
 * layout: el-pagination layout, default - 'prev, pager, next, sizes, jumper, slot'
 * tree-props: el-table tree-props
 *
 * page start from 0
 * add class 'fill-available' to fill container
 * emit selection-change will be delayed for 50ms due to tree selection problems
 */
import {flattenTreeToArray, debounceTime, Distinct} from "../../base/utils";

export default {
  name: "table-bridge",
  props: ['query', 'size', 'layout', 'tree-props'],
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      pageSize: null,
      checkedList: [],
      sequence: 0,
      loading: false,
      /* 点击多选按钮 */
      emitSelectionChange: debounceTime(() => {
        this.$emit('selection-change', this.checkedList)
      }, 50),
    }
  },
  computed: {
    table() {
      return this.$refs.table
    },
    pageSizeList() {
      const size = this.pageSize
      const arr = Distinct([10, 20, 30, 40, 50, 100, size])
      arr.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0
      })
      return arr
    },
    showPagination() {
      if (this.size === 0 || this.size === '0') {
        return false
      }
      if (this.pageSize < 0) {
        return false
      }
      if (this.total <= this.pageSize) {
        return false
      }
      return true
    }
  },
  watch: {
    query(val, oldVal) {
      this.sequence++
      this.page = 0
      this.data = []
      this.getData()
    },
    size() {
      this.handleSizeChange()
    },
    pageSize(val) {
      if (val !== this.size) {
        this.$emit('size', val + '')
      }
    }
  },
  methods: {
    headerCellStyle() {
      return "background: #F8F8FA;color:#565659;font-size:12px;"
    },
    handleSizeChange(val) {
      this.pageSize = val || Number(this.size) || 20;
      this.page = 0;
      this.list = [];
      this.getData();
    },
    skip(index) {
      this.sequence++
      this.page = index - 1;
      this.list = []
      this.getData();
    },
    getData() {
      if (!this.query) {
        return
      }
      const currentSeq = this.sequence
      this.loading = true
      this.query(this.page, this.pageSize).finally(() => {
        if (currentSeq !== this.sequence) {
          return
        }
        this.loading = false
      }).then(newData => {
        if (currentSeq !== this.sequence) {
          return
        }
        this.list = newData.data;
        this.total = newData.total;
      }).catch(err => {
        if (currentSeq !== this.sequence) {
          return
        }
        this.$message.error({
          message: err.message || err,
          type: 'error'
        });
      })
    },
    onSelectionChange(selection) {
      this.checkedList = selection;
      this.emitSelectionChange()
    },
    // 手动选中某一行，自动选择所有子元素, 由于该事件会在selection-change之前触发，所以修改内容会被覆盖，需要添加setTimeout矫正时序
    handleSelect(rows, currentRow) {
      setTimeout(() => {
        const arr = flattenTreeToArray(currentRow, c => c[this.treeProps.children]).distinct()
        if (arr.length > 1) {
          const isChecked = rows.indexOf(currentRow) >= 0
          const table = this.table
          arr.forEach(row => {
            table.toggleRowSelection(row, isChecked)
          })
        }
      }, 0)
    },
    // 全选/取消全选，修复el-table配置tree-props时全选按钮无法控制子元素的问题
    handleSelectAll(rows) {
      const data = this.list
      if (data && data.length) {
        const arr = flattenTreeToArray(data, c => c[this.treeProps.children]).distinct()
        if (arr.length > data.length) {
          const isChecked = rows.indexOf(data[0]) >= 0
          const table = this.table
          arr.forEach(row => {
            table.toggleRowSelection(row, isChecked)
          })
        }
      }
    }
  },
  created() {
    this.handleSizeChange()
  }
}
</script>

<style lang="less" scoped>
.table-bridge {
  .table-wrapper {
    min-height: 300px;
  }

  &.fill-available {
    flex: 1 1 0px;

    .table-wrapper {
      flex: 1 1 0px;
      overflow-y: auto;
    }
  }
}

.operate-wrapper {
  padding: 5px 0;
}

.el-pagination {
  padding: 5px 0;
}
</style>
