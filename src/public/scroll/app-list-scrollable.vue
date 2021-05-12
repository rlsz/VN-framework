<template>
  <div class="scrollable-list flex vertical" v-if="(data && data.length) || loading">
    <div class="content-wrapper flex vertical">
      <slot v-bind:value="item" v-for="(item,index) in data">
        use slotProps.value to access row data in slot template,
        https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots
      </slot>
    </div>
    <slot name="loading" v-if="!finished && loading">
      <span class="padding flex center">正在加载...</span>
    </slot>
    <i class="no-more" v-if="data && data.length && finished">
      <slot name="finished"></slot>
    </i>
  </div>
  <div v-else class="no-result flex center">
    <slot name="empty">
      <span>暂无数据</span>
    </slot>
  </div>
</template>

<script>
import {ScrollType, ScrollService} from "./scroll.service";
import {LoggerService} from "../logger/logger.service";

export default {
  name: "app-list-scrollable",
  /**
   * query: (page: number, size: number) => Promise<any[]>;
   * page number start from 0
   * size: number
   */
  props: ['query', 'size', 'column'],
  di: {
    inject: {
      ss: ScrollService,
      ls: LoggerService
    }
  },
  data() {
    return {
      page: 0,
      loading: false,
      data: [],
      sequence: 0,    // used to cancel pending query
      sub: null,
      finished: false
    }
  },
  watch: {
    query(val, oldVal) {
      this.sequence++
      this.page = 0
      this.data = []
      this.finished = false
      this.getData()
    },
    data(val) {
      this.$nextTick(() => {
        if(this.data?.length && this.ss.isBottomArea) {
          this.pullBottom()
        }
      })
    }
  },
  methods: {
    getData() {
      if (!this.query || this.finished) {
        return
      }
      const currentSeq = this.sequence
      this.loading = true
      this.query(this.page, this.size).finally(() => {
        if (currentSeq !== this.sequence) {
          return
        }
        this.loading = false
      }).then(newData => {
        if (currentSeq !== this.sequence) {
          return
        }
        if (newData && newData.length) {
          this.data = this.data.concat(newData)
        }
        if (!newData || !newData.length || (this.size && newData.length < this.size)) {
          this.finished = true
        } else {
          this.finished = false
        }
      }).catch(err => {
        if (currentSeq !== this.sequence) {
          return
        }
        this.ls.error(err.message)
        this.page = Math.max(this.page - 1, 0);
      })
    },
    pullTop() {
      if (!this.loading) {
        this.page = 0
        this.data = []
        this.finished = false
        this.getData()
      }
    },
    pullBottom() {
      if (!this.loading) {
        this.page++
        this.getData()
      }
    }
  },
  mounted() {
    this.sub = this.ss.scrollEvents.subscribe(e => {
      if (e.type === ScrollType.pull_top) {
        this.pullTop()
      } else if (e.type === ScrollType.pull_bottom) {
        this.pullBottom()
      }
    })
    this.getData()
  },
  destroyed() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
}
</script>

<style lang="less" scoped>
.no-result {
  flex: 1 0 auto;

  i {
    flex: 0 0 auto;
  }
}

.padding {
  padding: 20px;
}
</style>
