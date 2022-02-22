export class KeepAliveHelper {
    pathMap
    keepAliveInstanceList = []
    unwatch = []
    vm

    get cacheMap() {
        const m = {}
        for (let instance of this.keepAliveInstanceList) {
            for (let key of instance.keys) {
                const componentInstance = instance.cache[key].componentInstance
                m[componentInstance._uid] = key
            }
        }
        return m
    }

    diCreated(vm) {
        this.vm = vm
        this.pathMap = {}
        this.unwatch.push(
            this.vm.$watch(() => this.vm.$route, route => {
                this.vm.$nextTick(() => {
                    this.refreshMap()
                })
            }, {
                immediate: true
            })
        )
        // window.test = this.test.bind(this)
    }

    diDestroyed() {
        this.unwatch.forEach(c => c())
        this.unwatch = []
        this.pathMap = null
        this.keepAliveInstanceList = null
    }

    refreshMap() {
        const route = this.vm.$route
        const keys = route.matched.map(c => {
            return this.cacheMap[c.instances.default._uid]
        }).filter(c => c !== undefined).distinct()
        if (keys.length) {
            this.pathMap[route.path] = keys
        }
        // console.log('refreshMap', route, keys, this.pathMap, this.cacheMap)
    }

    register(vm) {
        const keepAliveInstance = this.findVNode(vm._vnode)
        if(keepAliveInstance) {
            if (this.keepAliveInstanceList.indexOf(keepAliveInstance.componentInstance) < 0) {
                this.keepAliveInstanceList.push(keepAliveInstance.componentInstance)
                this.refreshMap()
            }
        }
    }

    unregister(vm) {
        if(!this.keepAliveInstanceList) {
            return
        }
        const keepAliveInstance = this.findVNode(vm._vnode)
        if(keepAliveInstance) {
            const index = this.keepAliveInstanceList.indexOf(keepAliveInstance.componentInstance)
            if (index >= 0) {
                this.keepAliveInstanceList.splice(index, 1)
            }
        }
    }

    clear(path) {
        this.vm.$nextTick(() => {
            if (path) {
                // console.log('clear 1', path, this.keepAliveInstanceList)
                let keys = this.pathMap[path]
                for(let key of keys) {
                    for (let instance of this.keepAliveInstanceList) {
                        const index = instance.keys.indexOf(key)
                        if(index >= 0) {
                            // console.log('clear 2', path, key, instance)
                            delete instance.cache[key]
                            instance.keys.splice(index, 1)
                        }
                    }
                }
                delete this.pathMap[path]
                // console.log('clear 3', this.pathMap, this.cacheMap)
            } else {
                for (let instance of this.keepAliveInstanceList) {
                    instance.keys.forEach(key => {
                        delete instance.cache[key]
                    })
                    instance.keys = []
                }
            }
        })
    }

    findVNode(_vnode) {
        if (/keep-alive$/.test(_vnode.tag)) {
            return _vnode
        }
        if (_vnode.children) {
            for (let child of _vnode.children) {
                // console.log('travel children', child, child.elm)
                const target = this.findVNode(child)
                if (target) {
                    return target
                }
            }
        }
        if (_vnode.componentInstance?.$slots) {
            for (let slot in _vnode.componentInstance.$slots) {
                for (let child of _vnode.componentInstance.$slots[slot]) {
                    // console.log('travel slots', slot, child, child.elm)
                    const target = this.findVNode(child)
                    if (target) {
                        return target
                    }
                }
            }
        }
        return null
    }
    // test() {
    //     for (let instance of this.keepAliveInstanceList) {
    //         for (let key of instance.keys) {
    //             if(instance.cache[key].elm.id === "algo-tag-tagcate-index") {
    //                 console.log('error', this.keepAliveInstanceList, instance, key)
    //             }
    //         }
    //     }
    // }
}

