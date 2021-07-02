export * from './el-validators'
export * from './tabs/tabs.service'
import tabs from './tabs/app-tabs'
import tab from './tabs/app-tab'
export default function (Vue) {
    Vue.component(tabs.name, tabs)
    Vue.component(tab.name, tab)
}
