console.warn('******* element adapter imported *********')

import {Level} from "../../logger/logger";
import Vue from 'vue'
import './element.less'
import ElementUI from 'element-ui';
// import ElementUI from '../../../../node_modules/element-ui/src/index.js';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

/** 测试代码，为了调试el-select组件下拉框在弹窗中位置无法跟随输入框的问题
 *
 通过调试插件源码，得出如下结果：
 问题代码位置：ElSelect --> ElSelectDropdown --> vue-popper --> popper --> _setupEventListeners --> getScrollParent
 该方法在定位滚动容器时有缺陷，当沿着parentNode搜索滚动容器时，只要对应容器的overflow/overflow-x/overflow-y具有特征值就会停止搜索，但实际上这个节点并不一定是真正的滚动容器，可能需要判断容器scrollHeight来决定是否跳过该节点继续搜索

 暂时先不改getScrollParent方法，而是通过调整样式框架满足该方法的搜索逻辑
 */
// import Select from './select';
// Vue.component('test-select', Select);

/** el-table组件当数据中含有hasChildren字段时，会干扰正常的lazy处理，
 * 需要修改table/src/store/tree文件中的normalize方法以及table/src/util中的walkTreeNode方法进行修正
 *
 */
import {Table} from './fixTableBug'

Vue.component('el-table', Table);

export {default as DialogItem} from './dialog-item.vue'
export {default as DialogBridge} from './app-dialog-bridge.vue'


import {throttle} from '../../base/utils'
export function initUIMessage(subject) {
    const showLog = throttle(log => {
        const level = log.level && log.level.replace('[', '').replace(']', '');
        if(!Vue.prototype.$message[level] || !log.summary) {
            return
        }
        return new Promise(r => {
            setTimeout(() => {
                Vue.prototype.$message({
                    message: log.summary,
                    type: level,
                    onClose(vm) {
                        r(vm)
                    }
                })
            }, 0)
        })
    }, 3, log => log.summary)

    return subject.subscribe(showLog)
}

// export function confirm(opts) {
//     return Vue.prototype.$message(opts)
// }
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

import VElSelectModifyDirective from './v-el-select-modify.directive'
import MultiSelectBridge from './multi-select-bridge'
import TableBridge from './table-bridge'

export default function (Vue) {
    Vue.use(VElSelectModifyDirective)
    Vue.component(MultiSelectBridge.name, MultiSelectBridge)
    Vue.component(TableBridge.name, TableBridge)
}
