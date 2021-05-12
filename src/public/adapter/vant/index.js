console.warn('******* vant adapter imported *********')

import {Level} from "../../logger/logger";
import Vue from 'vue'
import './vant.less'
import './vConsole.less'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

if (process.env.VUE_APP_DEBUG === 'true') {
    const vConsole = require('vconsole')
    let vconsole = new vConsole()
}

export {default as DialogItem} from './dialog-item.vue'
export {default as DialogBridge} from './app-dialog-bridge.vue'

import {throttle} from '../../base/utils'
export function initUIMessage(subject) {
    const showLog = throttle(log => {
        if(log.level === Level.debug || !log.summary) {
            return
        }
        return new Promise(r => {
            let icon
            switch (log.level) {
                case Level.success:
                    icon = 'checked'
                    break;
                case Level.error:
                    icon = 'clear'
                    break;
                case Level.warning:
                    icon = 'warning'
                    break;
                case Level.info:
                    icon = 'info'
                    break;
                default:
            }
            Vue.prototype.$toast({
                message: log.summary,
                icon,
                onClose() {
                    r(true)
                }
            })
        })
    }, 1, log => log.summary)

    return subject.subscribe(showLog)
}

function msgbox(opts) {
    return Vue.prototype.$msgbox(opts)
}

export function confirm(opts) {
    let opt;
    if (typeof opts === 'string') {
        opt = {
            message: opts
        };
    } else {
        opt = opts || {};
    }
    opt = Object.assign({
        title: '提示',
        message: '你确定要执行该操作吗',
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        type: "warning"
    }, opt)
    return msgbox(opt)
}

export default function (Vue) {

}
