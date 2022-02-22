export class KeepAliveHelper {
    pathMap
    keepAliveInstance
    unwatch = []
    
    diCreated(vm) {
        
    }
    diMounted(vm) {
        const target = this.findVNode(vm._vnode)
        // console.log('result', vm, target)
        if(target) {
            this.keepAliveInstance = target.componentInstance
            this.pathMap = {}
            this.unwatch.push(
                vm.$watch(() => vm.$route, route => {
                    // console.log(route)
                    const currentVNode = route.matched[route.matched.length - 1].instances.default
                    const currentKey = this.keepAliveInstance.keys.find(key => {
                        return this.keepAliveInstance.cache[key].componentInstance === currentVNode
                    })
                    if(currentKey) {
                        this.pathMap[route.path] = currentKey
                    }
                    // console.log('route change', this.pathMap, this.keepAliveInstance.cache)
                }, {
                    immediate: true
                })
            )
            // window.test = () => {
            //     console.log(target, this.pathMap, this.keepAliveInstance.cache, this.keepAliveInstance.keys)
            // }
        }
    }
    diDestroyed() {
        this.unwatch.forEach(c => c())
        this.unwatch = []
        this.pathMap = null
        this.keepAliveInstance = null
    }

    clear(path) {
        if(path) {
            const key = this.pathMap[path]
            delete this.pathMap[path]
            delete this.keepAliveInstance.cache[key]
            this.keepAliveInstance.keys = this.keepAliveInstance.keys.filter(c => c !== key)
        } else {
            this.keepAliveInstance.keys.forEach(key => {
                delete this.keepAliveInstance.cache[key]
            })
            this.keepAliveInstance.keys = []
        }
    }

    findVNode(_vnode) {
        if(/keep-alive$/.test(_vnode.tag)) {
            return _vnode
        }
        if(!_vnode.children) {
            return null
        }
        for(let child of _vnode.children) {
            // console.log('travel', child, child.elm)
            const target = this.findVNode(child)
            if(target) {
                return target
            }
        }
        return null
    }
}
