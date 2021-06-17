import {Directive, DirectiveContext} from "./directive-base";

class VLinkDirective extends DirectiveContext {
    vnode
    isBlank = false

    bind(el, binding, vnode) {
        super.bind(...arguments);
        this.vnode = vnode
        el.style.cursor = 'pointer'
        this.isBlank = !!binding.modifiers.blank
    }

    onClick() {
        const router = this.vnode.context.$router
        if (this.isBlank) {
            const { href } = router.resolve({
                path: this.value,
            })
            window.open(href, '_blank')
        } else {
            router.push(this.value)
        }
    }
}

export default function () {
    new Directive('link').register(VLinkDirective)
}
