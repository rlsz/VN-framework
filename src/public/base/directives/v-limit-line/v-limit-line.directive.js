import "./v-limit-line.less"
import Vue from 'vue'
import {Directive, DirectiveContext} from "../directive-base";
import {getContext, ResizeContext} from "../../event-context";

class VLimitLineDirective extends DirectiveContext {
    subs = []
    el
    bind(el, binding) {
        this.el = el
        el.classList.add('limit-line-general')
        if(binding.value) {
            el.style.setProperty('-webkit-line-clamp', binding.value);
        }
        if (!binding.modifiers.noTitle) {
            Vue.nextTick(() => {
                this.refresh()
            })
        }
        this.subs.push(
            getContext(ResizeContext).events.subscribe(ev => {
                this.refresh()
            })
        )
    }
    update(el, binding) {
        if (!binding.modifiers.noTitle) {
            // 部分场景下(例如拖拽vuedraggable)innerText的更新会滞后于update生命周期，需要矫正时序
            Vue.nextTick(() => {
                this.refresh()
            })
        }
    }
    unbind(el, binding, vnode, oldVnode) {
        if (this.subs) {
            this.subs.forEach(item => item.unsubscribe())
            this.subs = []
        }
    }

    refresh() {
        if(isEllipsis(this.el)) {
            this.el.title = this.el.innerText;
        } else {
            this.el.title = ''
        }
    }
}
export default function() {
    new Directive('limit-line').register(VLimitLineDirective)
}

function isEllipsis(el) {
    // console.log(el, el.scrollHeight, el.clientHeight, el.offsetHeight)
    return el.scrollHeight > el.clientHeight
}
