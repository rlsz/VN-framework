export * from './el-validators'
export * from './tabs/tabs.service'
export * from './multi-select/multi-select.service'
export * from './form-model'

import tabs from './tabs/app-tabs'
import tab from './tabs/app-tab'
import tabEmpty from './tabs/app-tab-empty'
import multiSelect from './multi-select/app-multi-select'
import optionEmpty from './multi-select/app-option-empty'
import optionInput from './multi-select/app-option-input'
import option from './multi-select/app-option'
import optionDropdown from './multi-select/app-option-dropdown'

import "./form.less"
import select from './select'

export default function (Vue) {
    Vue.component(tabs.name, tabs)
    Vue.component(tab.name, tab)
    Vue.component(tabEmpty.name, tabEmpty)
    Vue.component(multiSelect.name, multiSelect)
    Vue.component(optionEmpty.name, optionEmpty)
    Vue.component(optionInput.name, optionInput)
    Vue.component(option.name, option)
    Vue.component(optionDropdown.name, optionDropdown)
    Vue.use(select)
}
