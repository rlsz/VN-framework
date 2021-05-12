export * from './dialog'
export * from './dialog.service'
export {default as DialogsContainer} from './dialogs-container.vue'
import {DialogBridge} from '../adapter'

export default function (Vue) {
    Vue.component(DialogBridge.name, DialogBridge)
}
