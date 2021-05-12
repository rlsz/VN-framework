console.warn('******* default adapter imported *********')

import AppLogMessages from './app-log-messages'
import './log.less'

export {default as DialogItem} from './dialog-item.vue'
export {default as DialogBridge} from './app-dialog-bridge.vue'

export function initUIMessage(subject) {

}

export function confirm(opts) {
    return new Promise((r, j) => {
        if (window.confirm(opts.message || opts)) {
            r(true)
        } else {
            j('cancel')
        }
    })
}

export default function (Vue) {
    const Component = Vue.extend({
        render: h => h(AppLogMessages)
    });
    const instance = new Component();
    instance.$mount()
    document.body.appendChild(instance.$el)
}
