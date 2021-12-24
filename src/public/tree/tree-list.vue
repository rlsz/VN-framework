<template>
  <div class="tree-list" :class="{['level-'+level]:true}" v-if="level !== 0 || (als.list && als.list.length) || als.loading">
    <tree-node v-for="(item, index) in als.list"
               :key="'app-tree-item-'+level+'-'+index"
               :value="item"
               :indexes="[...indexes, index]"
               :level="level"
    ></tree-node>
    <i v-if="isExpend && !als.finished && als.loading" class="loading" :style="{paddingLeft}"></i>
    <span v-if="isExpend && !als.finished && !als.loading" class="more" :style="{paddingLeft}">...</span>
<!--    <i v-if="isExpend && level === 0 && als.list && als.list.length && als.finished" class="no-more"></i>-->
  </div>
  <div v-else class="no-result flex center">
    <span class="flex center">暂无数据</span>
  </div>
</template>

<script>
import {AppListService} from "./app-list.service";
import {AppTreeService} from "./app-tree.service";

export default {
  name: "tree-list",
  components: {
    treeNode: () => import('./tree-node')
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    level: {
      type: Number,
      default: 0
    },
    indexes: {
      type: Array,
      default() {
        return []
      }
    },
    query: {
      type: Function,
      default: null
    }
  },
  di: {
    providers: [AppListService],
    inject: {
      als: AppListService,
      ats: AppTreeService
    }
  },
  computed: {
    isExpend() {
      if(this.parents.length) {
        const parent = this.parents[this.parents.length - 1]
        return this.ats.expendList.indexOf(parent) >= 0
      }
      return true
    },
    parents() {
      return this.ats.getPaths(this.indexes)
    },
    paddingLeft() {
      return this.ats.treeProps.indent * this.level + 'px'
    }
  },
  watch: {
    'als.list'(val) {
      const parents = this.ats.getPaths(this.indexes)
      const parent = parents[parents.length - 1]
      if(parent) {
        if(this.ats.lazy) {
          const {children} = this.ats.treeProps
          parent[children] = val
        }
      } else {
        this.ats.list = val
      }
      // console.log('als.list ', val, this.indexes.join('->'), this.ats.list, !!parent)
    }
  }
}
</script>

<style lang="less" scoped>
//.tree-list {
//  &:not(.level-0) {
//    padding-left: 16px;
//  }
//}
.more {
  opacity: 0.3;
  font-size: 14px;
  line-height: 20px;
}
i.no-more {
  padding: 0;
}
</style>
