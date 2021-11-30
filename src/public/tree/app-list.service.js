import {ScrollMonitorService} from "../scroll/scroll-monitor.service";

export class AppListService {
    list = []
    page = 0
    pageSize = 20
    sequence = 0
    loading = false

    injector
    vm
    unwatch = []

    get shs() {
        return this.injector.get(ScrollMonitorService)
    }
    constructor(injector) {
        this.injector = injector
        this.injector.set(ScrollMonitorService)
    }
    diCreated(vm) {
        this.vm = vm
        this.unwatch.push(
            this.vm.$watch(() => this.vm.query || this.vm.data, () => {
                this.reset()
            }, {
                immediate: true
            }),
            this.vm.$watch(() => this.shs.visible, val => {
                // console.log('dom visible', val, this.vm.$el)
                if(val) {
                    this.next()
                }
            }, {
                immediate: false
            })
        )
    }
    diUpdated(vm) {
        const lastChild = this.vm.$el.children[this.vm.$el.children.length - 1]
        // console.log('diUpdated', this.vm.$el, lastChild)
        if(lastChild) {
            this.shs.watch(lastChild, () => {
                console.log('on child show', lastChild)
            })
        }
    }
    diDestroyed(vm) {
        this.unwatch.forEach(c => c())
        this.unwatch = []
    }

    reset() {
        this.sequence++
        this.page = 0
        this.data = []
        this.finished = false
        this.getData()
    }
    next() {
        if (!this.loading) {
            this.page++
            this.getData()
        }
    }

    getData() {
        if ((!this.vm.query && !this.vm.data) || this.finished) {
            return
        }
        const currentSeq = this.sequence
        this.loading = true
        let p
        if(this.vm.query) {
            p = Promise.resolve(this.vm.query(this.page, this.pageSize)).then(newData => {
                if (!newData || !newData.length || (this.pageSize && newData.length < this.pageSize)) {
                    this.finished = true
                } else {
                    this.finished = false
                }
                return newData
            })
        } else if (this.vm.data) {
            p = Promise.resolve(this.vm.data).then(data => {
                data = data || []
                if (this.vm.size === 0 || this.vm.size === '0') {
                    this.finished = true
                    return data
                } else {
                    const start = this.page * this.pageSize
                    const end = (this.page + 1) * this.pageSize
                    this.finished = end >= data.length
                    return data.slice(start, end)
                }
            })
        }
        p.finally(() => {
            if (currentSeq !== this.sequence) {
                return
            }
            this.loading = false
        }).then(newData => {
            if (currentSeq !== this.sequence) {
                return
            }
            if (newData && newData.length) {
                this.list = this.list.concat(newData)
            }
        }).catch(err => {
            if (currentSeq !== this.sequence) {
                return
            }
            this.page = Math.max(this.page - 1, 0);
        })
    }
}
