import {getContext, ResizeContext} from "../base/event-context";
import {debounceTime} from "../base/utils";

export class ScrollbarDetectorService {
    targetGetter
    visible = false

    context
    sub
    detectRef
    diMounted(vm) {
        this.detectRef = debounceTime(this.detect.bind(this), 150)
        this.detectRef()
    }
    diUpdated(vm) {
        this.detectRef()
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
                        this.detectRef()
                    })
                }
                const {scrollHeight, clientHeight} = target
                const visible = scrollHeight > clientHeight
                if(this.visible !== visible) {
                    this.visible = visible
                }
                // console.log(JSON.stringify({scrollHeight, clientHeight, visible}))
            }
        }
    }
}
