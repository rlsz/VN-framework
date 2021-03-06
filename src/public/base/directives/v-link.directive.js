import {Directive, DirectiveContext} from "./directive-base";
import path from "path";

const activeClass = 'v-link-active'

class VLinkDirective extends DirectiveContext {
    vnode
    isBlank = false
    componentInstance
    unwatch
    active = false

    bind(el, binding, vnode) {
        super.bind(...arguments);
        this.vnode = vnode
        el.style.cursor = 'pointer'
        this.isBlank = !!binding.modifiers.blank
        this.componentInstance = vnode.componentInstance || vnode.context
        this.unwatch = this.componentInstance.$watch('$route', val => {
            const {route} = this.componentInstance.$router.resolve(this.value)
            this.active = val.fullPath === route.fullPath
            if (this.active) {
                el.classList.add(activeClass)
            } else {
                el.classList.remove(activeClass)
            }
        }, {
            immediate: true
        })
    }

    unbind() {
        super.unbind(...arguments);
        if (this.unwatch) {
            this.unwatch()
            this.unwatch = null
        }
    }

    onClick() {
        if(this.active) {
            return
        }
        const router = this.componentInstance.$router
        if (this.isBlank) {
            if (this.value.startsWith('http://') || this.value.startsWith('https://')) {
                window.open(this.value, '_blank')
            } else {
                const {href} = router.resolve({
                    path: this.value,
                })
                window.open(href, '_blank')
            }
        } else {
            if (this.value.startsWith('http://') || this.value.startsWith('https://')) {
                location.href = this.value
            } else {
                router.push(this.value).catch(e => {})
            }
        }
    }
}

export default function () {
    new Directive('link').register(VLinkDirective)
}
