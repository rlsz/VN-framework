<template>
  <el-pagination class="pagination-bridge"
                 v-if="showPagination"
                 :current-page="current"
                 @current-change="ats.skip($event)"
                 @size-change="ats.handleSizeChange($event)"
                 :layout="layout || defaultConfig.tableDefaultLayout"
                 :page-size="ats.pageSize"
                 :page-sizes="ats.pageSizeList"
                 :total="ats.total"
  >
  </el-pagination>
</template>

<script>
import {AppTableService} from "../../table/app-table.service";
import {ConfigService} from "../../config.service";

export default {
  name: "pagination-bridge",
  props: ['layout'],
  di: {
    inject: {
      ats: AppTableService,
      defaultConfig: ConfigService
    }
  },
  computed: {
    pageCount() {
      return Math.max(1, Math.ceil(this.ats.total / this.ats.pageSize));
    },
    current() {
      return this.ats.page + 1;
    },
    showPagination() {
      if(this.ats.total === undefined) {
        return false
      }
      if (this.ats.size === 0 || this.ats.size === '0') {
        return false
      }
      if(this.ats.defaultConfig.tableAlwaysShowPagination) {
        return true
      }
      if (this.ats.pageSize < 0) {
        return false
      }
      if (this.ats.total <= this.ats.pageSize) {
        return false
      }
      return true
    }
  },
  methods: {
    goPrev() {
      if (this.current > 1) {
        this.ats.skip(this.current - 1)
      }
    },
    goNext() {
      if (this.current < this.pageCount) {
        this.ats.skip(this.current + 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  padding: 5px 0;
}
</style>
