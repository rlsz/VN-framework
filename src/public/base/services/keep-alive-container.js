import {KeepAliveHelper} from "./keep-alive-helper";

export class KeepAliveContainer {
    injector
    get helper() {
        return this.injector.get(KeepAliveHelper)
    }
    constructor(injector) {
        this.injector = injector
    }
    
    diCreated(vm) {
        
    }
    diMounted(vm) {
        this.helper.register(vm)
    }
    diDestroyed(vm) {
        this.helper.unregister(vm)
    }
}
