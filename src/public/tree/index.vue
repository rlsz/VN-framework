<template>
  <div class="app-tree-root scroll">
    <tree-list :data="data" :query="currentQuery" ref="treeList"></tree-list>
  </div>
</template>

<script>
import {AppTreeService} from "./app-tree.service";

/**
 * options: Array<any>
 * treeProps: { key: string, children: string, hasChildren: string | (this: undefined, context: VNode) => boolean, label: string }
 *
 * data: Array<any>
 * query: (page:number, size:number) => Promise<Array<any>>
 */
export default {
  name: "index",
  components: {
    treeList: () => import('./tree-list')
  },
  props: ['data', 'value', 'treeProps', 'query'],
  di: {
    providers: [AppTreeService],
    inject: {
      ats: AppTreeService
    }
  },
  data() {
    return {
    }
  },
  computed: {
    currentQuery() {
      if(!this.query) {
        return null
      }
      return (page, size) => {
        return this.query(page, size, null)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-tree-root {
  flex-basis: auto;
}
</style>
