import {Directive, DirectiveContext} from "./directive-base";

class VLinkDirective extends DirectiveContext {
    vnode

    bind(el, binding, vnode) {
        super.bind(...arguments);
        this.vnode = vnode
        el.style.cursor = 'pointer'
    }

    onClick() {
        const router = this.vnode.context.$router
        router.push(this.value)
    }
}
export default function() {
    new Directive('link').register(VLinkDirective)
}
