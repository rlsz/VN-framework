import {Distinct, getScrollParent, PART_SELECTION, SimpleClone} from "../base/utils";
import {ConfigService} from "../config.service";
import {LoggerService} from "../logger/logger.service";

export class AppTableService {
    columnsConfig = [] // { renderHeader: (h, data) => html, renderCell: (h, data) => html }; data: { ...app-table-column-props }
    setColumn(opts) {
        const index = this.columnsConfig.findIndex(c => c.id === opts.id)
        if(index >= 0) {
            this.columnsConfig.splice(index, 1, opts)
        } else {
            this.columnsConfig.push(opts)
        }
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
    expendList = []
    get treeProps() {
        return this.vm.treeProps
    }

    injector
    vm
    unwatch = []

    get defaultConfig() {
        return this.injector.get(ConfigService)
    }
    get allSelected() {
        if(!this.checkedList.length) {
            return false
        }
        if(this.checkedList.length === this.list.length) {
            return true
        }
        if(this.checkedList.length < this.list.length) {
            return PART_SELECTION
        }
        return false
    }

    get ls() {
        return this.injector.get(LoggerService)
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
                if (this.vm.size === 0 || this.vm.size === '0') {
                    return false
                }
                if (this.defaultConfig.tableAlwaysShowPagination) {
                    return true
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
                this.handleSizeChange(val)
            }),
            this.vm.$watch(() => this.checkedList, val => {
                this.vm.$emit('selection-change', val)
            }),
            this.vm.$watch(() => this.list, val => {
                if(this.checkedList.length) {
                    this.checkedList = []
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
            p = Promise.resolve(this.vm.query(this.page, this.pageSize))
        } else if (this.vm.data) {
            p = Promise.resolve(this.vm.data).then(data => {
                data = data || []
                if (this.vm.size === 0 || this.vm.size === '0') {
                    return {
                        data: data,
                        total: data.length
                    }
                } else {
                    return {
                        data: data.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize),
                        total: data.length
                    }
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
            this.list = newData.data || [];
            this.total = newData.total;
        }).catch(err => {
            if (currentSeq !== this.sequence) {
                return
            }
        })
    }

    toggleSelectRow({row}, status) {
        if(status) {
            this.checkedList.push(row)
        } else {
            this.checkedList.splice(this.checkedList.indexOf(row), 1)
        }
    }
    toggleSelectAll(status) {
        if(status) {
            this.checkedList = this.list.map(c => c)
        } else {
            this.checkedList = []
        }
    }
    toggleExpend(row) {
        const index = this.expendList.indexOf(row);
        if(index >= 0) {
            this.expendList.splice(index, 1);
        } else {
            this.expendList.push(row)
        }
    }
    moveRow(fromIndexes, toIndexes) {
        // return
        // console.log('moveRow', fromIndexes.join('.'), '-->', toIndexes.join('.'))
        if(toIndexes.join('.').startsWith(fromIndexes.join('.'))) {
            return this.ls.warning('无法将父节点移动到自己的子节点')
        }
        // test1(this.list, this.treeProps.children)
        const scroll = getScrollParent(this.vm.$el)
        const scrollPosition = scroll.scrollTop
        // console.log('scroll', scroll, scroll.scrollTop)
        const fromIndex = fromIndexes.pop()
        const toIndex = toIndexes.pop()
        const fromParent = fromIndexes.reduce((target, index) => target[index][this.treeProps.children], this.list)
        const toParent = toIndexes.reduce((target, index) => target[index][this.treeProps.children], this.list)
        // console.log('from parent', fromParent.title || 'root')
        // console.log('to parent', toParent.title || 'root')
        const fromRow = fromParent.splice(fromIndex, 1)[0]
        // test1(this.list, this.treeProps.children)
        if(fromParent === toParent && fromIndex < toIndex) {
            toParent.splice(toIndex, 0, fromRow)
        } else {
            toParent.splice(toIndex + 1, 0, fromRow)
        }
        setTimeout(() => {
            // console.log('scroll', scroll, scroll.scrollTop, scrollPosition)
            scroll.scrollTop = scrollPosition
        }, 0)
        // test1(this.list, this.treeProps.children)
    }
}
// function adapterTree(list, childrenKey) {
//   return list.map(c => {
//     if(c[childrenKey] && c[childrenKey].length) {
//       return [c.title, adapterTree(c[childrenKey])]
//     } else {
//       return c.title
//     }
//   })
// }
// window.test1 = (list, childrenKey) => {
//   let data = SimpleClone(list)
//   const temp = adapterTree(data, childrenKey)
//   console.log(JSON.stringify(temp, null, '  '))
// }
