import {getContext, MouseMoveContext} from "@/public/base/event-context";

export class MouseMoveService {
    context
    target = null
    vm
    unwatch = []
    injector
    constructor(injector) {
        this.injector = injector
        this.context = getContext(MouseMoveContext)
    }
    diCreated(vm) {
        this.vm = vm
        this.unwatch.push(
            this.vm.$watch(() => this.context.target, val => {
                this.target = val
            })
        )
    }
    diDestroyed() {
        this.unwatch.forEach(c => c())
        this.unwatch = []
    }
}
