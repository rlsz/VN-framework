import {Distinct, SimpleClone} from "../base/utils";
import {ConfigService} from "../config.service";

export class AppTableService {
    columnsConfig = [] // { renderHeader: (h, data) => html, renderCell: (h, data) => html }; data: { ...app-table-column-props }
    addColumn(opts) {
        this.columnsConfig.push(opts)
    }

    list = []
    total = 0
    page = 0
    pageSize = null
    checkedList = []
    sequence = 0
    loading = false
    pageSizeList
    showPagination

    injector
    vm
    unwatch = []

    get defaultConfig() {
        return this.injector.get(ConfigService)
    }

    constructor(injector) {
        this.injector = injector
    }

    diCreated(vm) {
        this.vm = vm
        this.unwatch.push(
            this.vm.$watch(() => {
                if (this.total === undefined) {
                    return false
                }
                if (this.defaultConfig.tableAlwaysShowPagination) {
                    return true
                }
                if (this.vm.size === 0 || this.vm.size === '0') {
                    return false
                }
                if (this.pageSize < 0) {
                    return false
                }
                if (this.total <= this.pageSize) {
                    return false
                }
                return true
            }, val => {
                this.showPagination = val
            }, {
                immediate: true
            }),
            this.vm.$watch(() => {
                const size = this.pageSize
                const arr = Distinct([...this.defaultConfig.tablePageSizeList, size])
                arr.sort((a, b) => {
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0
                })
                return arr
            }, val => {
                this.pageSizeList = val
            }, {
                immediate: true
            }),
            this.vm.$watch(() => this.vm.size, val => {
                this.handleSizeChange()
            }, {
                immediate: true
            }),
            this.vm.$watch(() => this.vm.query || this.vm.data, () => {
                this.sequence++
                this.page = 0
                this.list = []
                this.getData()
            }),
            this.vm.$watch(() => this.pageSize, val => {
                if (val != this.vm.size) {
                    this.$emit('size', val + '')
                }
            })
        )
    }

    diDestroyed(vm) {
        this.unwatch.forEach(c => c())
        this.unwatch = []
    }

    handleSizeChange(val) {
        this.pageSize = val || Number(this.vm.size) || this.defaultConfig.tablePageSize || 20;
        this.page = 0;
        this.list = [];
        this.getData();
    }

    skip(index) {
        this.sequence++
        this.page = index - 1;
        this.list = []
        this.getData();
    }

    getData() {
        if (!this.vm.query && !this.vm.data) {
            return
        }
        const currentSeq = this.sequence
        this.loading = true
        let p
        if(this.vm.query) {
            p = this.vm.query(this.page, this.pageSize)
        } else if (this.vm.data) {
            p = Promise.resolve(this.vm.data).then(data => {
                return {
                    data: data.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize),
                    total: data.length
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
            this.list = newData.data;
            this.total = newData.total;
        }).catch(err => {
            if (currentSeq !== this.sequence) {
                return
            }
        })
    }
}
