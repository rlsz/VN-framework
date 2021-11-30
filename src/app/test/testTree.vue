<template>
  <div class="flex vertical fill-content padding test-page">
    <span class="divider"></span>
    <!--    <app-tree :data="options"></app-tree>-->
    <span class="divider"></span>
    <!--    <app-tree v-model="users" :data="options"></app-tree>-->
    <span class="divider"></span>
    <app-tree :query="query" :tree-props="treeProps">
      <template v-slot:label="{value}">
        <span>test-{{ value.label }}</span>
      </template>
    </app-tree>
    <span class="divider"></span>
  </div>
</template>

<script>
import {timer} from "@/public/base";
export default {
  name: "testTree",
  data() {
    return {
      treeProps: {
        hasChildren: (node) => {
          // console.log('hasChildren', this, node)
          return true
        }
      },
      users: [],
      options: [{
        id: 'id-1',
        label: 'label-1'
      }, {
        id: 'id-2',
        label: 'label-2',
        children: []
      }, {
        id: 'id-3',
        label: 'label-3',
        children: [{
          id: 'id-3-1',
          label: 'label-3-1'
        }, {
          id: 'id-3-2',
          label: 'label-3-2'
        }, {
          id: 'id-3-3',
          label: 'label-3-3',
          children: [{
            id: 'id-3-3-1',
            label: 'label-3-3-1'
          }, {
            id: 'id-3-3-2',
            label: 'label-3-3-2'
          }, {
            id: 'id-3-3-3',
            label: 'label-3-3-3'
          }]
        }]
      }],
      query: null
    }
  },
  created() {
    this.query = (parents, page, size) => {
      return timer(1000).then(() => {
        console.log('query', parents, page, size)
        if(page > 3) {
          return null
        }
        if(!parents.length) {
          return  new Array(size).fill(0).map((c, i) => {
            const num = page * size + i
            return {
              id: 'id-' + num,
              label: 'label-' + num,
              hasChildren: true
            }
          })
        } else {
          const lastParent = parents[parents.length - 1]
          return  new Array(size).fill(0).map((c, i) => {
            const num = page * size + i
            return {
              id: lastParent.id + ':' + num,
              label: lastParent.label + ':' + num
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.divider {
  height: 1px;
  margin: 4px 0;
  background: gray;
  align-self: stretch;
}
.padding {
  padding: 20px;
}
.test-page {
  //align-items: flex-start;
  max-height: 100vh;
}
</style>
