<template>
  <div class="app-pagination">
    <span class="prev" :class="{disabled:current === 1}" @click="goPrev()">上一页</span>
    <span class="page-wrapper">{{current}}/{{pageCount}}</span>
    <span class="next" :class="{disabled:current === pageCount}" @click="goNext()">下一页</span>
  </div>
</template>

<script>
import {AppTableService} from "./app-table.service";

export default {
  name: "app-pagination",
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
    pageCount() {
      return Math.max(1, Math.ceil(this.ats.total / this.ats.pageSize));
    },
    current() {
      return this.ats.page + 1;
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
.app-pagination {
  background: #EBEDF3;
  border-radius: 2px;
  padding: 8px 10px;
  margin: 12px auto;
  align-self: center;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #323335;
  line-height: 20px;
}
.prev,.next {
  color: #3667D4;
  cursor: pointer;
  &.disabled {
    color: #AFB2BB;
    cursor: not-allowed;
  }
}
.page-wrapper {
  margin: 0 19px;
}
</style>
