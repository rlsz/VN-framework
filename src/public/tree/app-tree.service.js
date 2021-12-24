export class AppTreeService {
    injector
    vm
    unwatch = []
    treeProps
    checkedList = []
    expendList = []
    list = []
    // todo
    get editable() {
        return false
        // return !!this.vm.$listeners.input
    }
    get lazy() {
        return !!this.vm.query
    }
    constructor(injector) {
        this.injector = injector
    }
    diCreated(vm) {
        this.vm = vm
        this.treeProps = {
            key: 'id',
            label: 'label',
            children: 'children',
            hasChildren: 'hasChildren',
            indent: 16,
            ...this.vm.treeProps
        }
        this.unwatch.push(
            this.vm.$watch(() => this.vm.value, val => {
                // this.checkedList = this.vm.value || []
            }, {
                immediate: true
            }),
            // this.vm.$watch(() => this.vm.data, val => {
            //     this.list = val || []
            // }, {
            //     immediate: true
            // })
        )
    }
    diDestroyed(vm) {
        this.unwatch.forEach(c => c())
        this.unwatch = []
    }

    toggleExpend(node) {
        const index = this.expendList.indexOf(node);
        if(index >= 0) {
            this.expendList.splice(index, 1);
        } else {
            this.expendList.push(node)
        }
    }

    getPaths(indexes) {
        const {children} = this.treeProps
        let list = this.list
        const parents = []
        indexes.forEach(index => {
            const item = list && list[index]
            if(item) {
                parents.push(item)
                list = item[children]
            } else {
                console.error('can\'t found parents', this.list, indexes)
            }
        })
        return parents
    }

    hasChildren(vm) {
        if(this.lazy || this.vm.treeProps?.hasChildren) {
            const {hasChildren} = this.treeProps
            if(typeof hasChildren === 'function') {
                return hasChildren(vm)
            } else {
                return vm.value[hasChildren]
            }
        } else {
            const {children} = this.treeProps
            return vm.value[children] && vm.value[children].length
        }
    }
}
