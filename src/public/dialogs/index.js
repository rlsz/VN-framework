export * from './dialog'
export * from './dialog.service'
export * from './dialog-root'
export * from './dialog-parent'
export * from './dialog-container-target'
export {default as DialogsContainer} from './dialogs-container.vue'
import {DialogBridge} from '../adapter'
import './dialog-theme.less'

export default function (Vue) {
    Vue.component(DialogBridge.name, DialogBridge)
}
