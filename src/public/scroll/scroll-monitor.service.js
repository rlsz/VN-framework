import {debounceTime, getScrollParent, isScrollContainer, SimpleSubject} from '../base/utils'

const listener_context = '__vue_scroll_listener_context'
export class ScrollParent {
    scrollDom
    events = new SimpleSubject()
    constructor(injector, dom) {
        this.scrollDom = dom
        this.onScrollRef = debounceTime((e) => {
            this.onScroll.call(this, e)
        }, 50)
        this.init()
    }
    onScrollRef
    onScroll(e) {
        // console.log('onScroll', e)
        const {offsetHeight, scrollHeight, scrollTop} = this.scrollDom
        if (offsetHeight !== scrollHeight) {
            this.events.next(e)
        }
    }

    init() {
        this.scrollDom.addEventListener('scroll', this.onScrollRef, false)
    }
    dispose() {
        this.scrollDom.removeEventListener('scroll', this.onScrollRef, false)
    }
}

export class ScrollMonitorService {
    visible = false

    context
    injector
    sub
    constructor(injector) {
        this.injector = injector
    }
    diMounted(vm) {
        if(!this.context) {
            const temp = isScrollContainer(vm.$el) ? vm.$el : getScrollParent(vm.$el)
            if(!temp) {
                throw new Error(`can't found scroll parent of ${vm.$el}`)
            }
            if(!temp[listener_context]) {
                temp[listener_context] = new ScrollParent(this.injector, temp)
            }
            // console.log('__vue_scroll_listener_context', temp[listener_context])
            this.context = temp[listener_context]
        }
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
        return bottomDistance < 0
    }
}
