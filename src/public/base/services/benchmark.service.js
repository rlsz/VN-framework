import {LoggerService} from "../../logger/logger.service";

export class BenchmarkService {
    initClock = null
    updateClock = null

    name = 'benchmark-service'
    ls
    constructor(injector) {
        this.ls = injector.get(LoggerService)
    }

    diCreated(vm) {
        this.name = vm.$vnode.componentOptions.tag
        this.initClock = this.ls.time()
    }
    diMounted() {
        this.initClock.end(this.name + ' init {t}')
    }

    diBeforeUpdate() {
        this.updateClock = this.ls.time()
    }
    diUpdated() {
        this.updateClock.end(this.name + ' update {t}')
    }
}
