import {getScrollParent, isScrollContainer} from '../base/utils'
import {getContext, ScrollContext} from "../base/event-context";

export class ScrollMonitorService {
    visible = false

    context
    injector
    sub
    constructor(injector) {
        this.injector = injector
    }
    diMounted(vm) {
        const temp = isScrollContainer(vm.$el) ? vm.$el : getScrollParent(vm.$el)
        if(!temp) {
            throw new Error(`can't found scroll parent of ${vm.$el}`)
        }
        this.context = getContext(ScrollContext, temp)
    }
    diDestroyed() {
        if(this.sub) {
            this.sub.unsubscribe()
            this.sub = null
        }
    }

    watch(dom) {
        if(this.sub) {
            this.sub.unsubscribe()
        }
        if(this.context?.scrollDom) {
            this.visible = this.isVisible(dom, this.context.scrollDom)
        }
        this.sub = this.context.events.subscribe(ev => {
            this.visible = this.isVisible(dom, ev.target)
        })
    }

    isVisible(dom, scrollParent) {
        const {height, top} = dom.getBoundingClientRect()
        if(height <= 0) {
            return false
        }
        const {height: viewHeight, top: viewTop} = scrollParent.getBoundingClientRect()
        const distance = top - viewTop - (viewHeight - height) / 2 // distance of dom middle to scroll target middle
        const bottomDistance = distance - viewHeight / 2 // distance of dom middle to scroll target bottom
        const topDistance = distance + viewHeight / 2 // distance of dom middle to scroll target top
        return bottomDistance < 0 && topDistance > 0
    }
}
