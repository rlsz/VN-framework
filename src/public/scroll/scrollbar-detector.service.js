import {getContext, ResizeContext} from "../base/event-context";

export class ScrollbarDetectorService {
    targetGetter
    visible = false

    context
    sub
    diMounted(vm) {
        this.detect()
    }
    diUpdated(vm) {
        this.detect()
    }
    diDestroyed() {
        if(this.sub) {
            this.sub.unsubscribe()
            this.sub = null
        }
    }
    detect() {
        if(this.targetGetter) {
            const target = this.targetGetter()
            if(target) {
                if(!this.context) {
                    this.context = getContext(ResizeContext)
                    this.sub = this.context.events.subscribe(ev => {
                        this.detect()
                    })
                }
                const {scrollHeight, clientHeight} = target
                const visible = scrollHeight > clientHeight
                if(this.visible !== visible) {
                    this.visible = visible
                }
            }
        }
    }
}
