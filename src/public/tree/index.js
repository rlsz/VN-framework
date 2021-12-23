import index from "./index.vue";
export * from './app-tree.service'
export * from './app-list.service'

export default function (Vue) {
    Vue.component('app-tree', index)
}
