<template>
  <div class="tree-list" :class="{['level-'+level]:true}" v-if="level !== 0 || (als.list && als.list.length) || als.loading">
    <tree-node v-for="(item, index) in als.list"
               :key="'app-tree-item-'+level+'-'+index"
               :value="item"
               :indexes="[...indexes, index]"
               :level="level"
    ></tree-node>
    <template name="loading" v-if="!als.finished && als.loading">
      <span class="padding flex center">正在加载...</span>
    </template>
    <i class="no-more" v-if="als.list && als.list.length && als.finished"></i>
  </div>
  <div v-else class="no-result flex center">
    <span class="padding flex center">暂无数据</span>
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
  watch: {
    'als.list'(val) {
      const parents = this.ats.getPaths(this.indexes)
      const parent = parents[parents.length - 1]
      if(parent) {
        const {children} = this.ats.treeProps
        parent[children] = val
      } else {
        this.ats.list = val
      }
      // console.log('als.list ', val, this.indexes.join('->'), this.ats.list, !!parent)
    }
  }
}
</script>

<style lang="less" scoped>
.tree-list {
  &:not(.level-0) {
    padding-left: 16px;
  }
}
</style>
