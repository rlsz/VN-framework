import {SimpleSubject} from "../base";

export const ScrollType = {
    pull_top: 'pull_top',
    pull_bottom: 'pull_bottom'
}

export class ScrollService {

    vm

    scrollEvents = new SimpleSubject()

    constructor() {

    }

    push(e) {
        this.scrollEvents.next(e)
    }

    // deprecated, 全局搜索target对应的父元素app-scroll，引入di机制后不再需要这种方式
    sub(target) {
        const _this = this
        return {
            subscribe(fn, errFn, completeFn) {
                const filterFn = e => {
                    if (e.source.contains(target)) {
                        fn(e)
                    }
                }
                return _this.scrollEvents.subscribe.apply(_this.scrollEvents, [filterFn, errFn, completeFn])
            }
        }
    }

    diCreated(vm) {
        this.vm = vm
    }

    get bottom() {
        if (!this.vm.scrollDom) {
            return 0
        }
        const {scrollHeight, offsetHeight, scrollTop} = this.vm.scrollDom
        return scrollHeight - (offsetHeight + scrollTop)
    }

    get isBottomArea() {
        return this.bottom <= this.vm.boundary.bottom
    }
}
