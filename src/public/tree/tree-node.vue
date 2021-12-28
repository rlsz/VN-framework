<template>
  <div class="tree-node" :class="{['level-'+level]:true, 'expend-hidden': isHidden, 'selected': isSelected}">
    <div class="flex cross-center label-container" :style="{paddingLeft}">
      <app-checkbox v-if="ats.editable"></app-checkbox>
      <component :is="label"></component>
      <i v-if="hasChildren"
         class="arrow"
         :class="{right:!isExpend, down: isExpend}"
         @click="ats.toggleExpend(value)"
      ></i>
    </div>
    <tree-list v-if="hasChildren"
               :data="children"
               :query="currentQuery"
               :level="level + 1"
               :indexes="indexes"
               ref="treeList"
    ></tree-list>
  </div>
</template>

<script>
import {AppTreeService} from "./app-tree.service";

export default {
  name: "tree-node",
  components: {
    treeList: () => import('./tree-list')
  },
  props: ['value', 'level', 'indexes'],
  di: {
    inject: {
      ats: AppTreeService
    }
  },
  data() {
    return {
      currentQuery: null
    }
  },
  computed: {
    children() {
      const {children} = this.ats.treeProps
      if(this.value[children] && this.value[children].length) {
        return this.value[children]
      }
      return null
    },
    hasChildren() {
      return this.ats.hasChildren(this)
    },
    label() {
      const label = this.ats.vm.$scopedSlots.label
      const scope = {
        value: this.value,
        level: this.level,
        indexes: this.indexes,
        hasChildren: this.hasChildren,
        context: this
      }
      return {
        di: {
          inject: {
            ats: AppTreeService
          }
        },
        render(h) {
          if(label) {
            return (<span class="flex cross-center fill-content">{label(scope)}</span>)
          } else {
            return (<span>{scope.value[this.ats.treeProps.label]}</span>)
          }
        }
      }
    },
    isSelected() {
      const index = this.ats.checkedList.indexOf(this.value)
      if(index >= 0) {
        return true
      }
    },
    isHidden() {
      const parent = this.paths[this.paths.length - 2]
      if(!parent) {
        return false
      }
      if(this.ats.expendList.indexOf(parent) >= 0) {
        return false
      }
      return true
    },
    isExpend() {
      return this.ats.expendList.indexOf(this.value) >= 0
    },
    paths() {
      return this.ats.getPaths(this.indexes)
    },
    paddingLeft() {
      return this.ats.treeProps.indent * this.level + 'px'
    }
  },
  watch: {
    isExpend(val) {
      if(val && !this.currentQuery && this.ats.vm.query) {
        this.currentQuery = (page, size) => {
          return this.ats.vm.query(page, size, this)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.expend-hidden {
  display: none
}
.app-checkbox {
  margin-right: 6px;
}
i.arrow {
  margin-left: 6px;
}
.selected {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
</style>
