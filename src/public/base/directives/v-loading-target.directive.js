import {Directive, DirectiveContext} from "./directive-base";

const targetClass = 'v-loading-target'
const independenceClass = 'v-loading-independence'

class VLoadingTargetDirective extends DirectiveContext {
    el

    bind(el, binding, vnode) {
        this.el = el
        super.bind(...arguments);
    }

    inserted(el) {
        super.inserted(...arguments);
        const position = window.getComputedStyle(el, null)['position']
        if (position === 'static') {
            el.style.position = 'relative'
        }
        this.refresh(true)
    }

    update(el, binding, vnode, oldVnode) {
        super.update(...arguments);
        this.refresh()
    }

    unbind(el, binding, vnode) {
        super.unbind(...arguments);
        this.refresh(false)
    }

    refresh(value) {
        if (this.value === undefined) {
            if (value === true) {
                this.el.classList.add(targetClass)
            }
            if (value === false) {
                this.el.classList.remove(targetClass)
            }
        } else {
            this.el.classList.remove(targetClass)
            if (this.value) {
                this.el.classList.add(independenceClass)
            }
            if (!this.value) {
                this.el.classList.remove(independenceClass)
            }
        }
    }
}

export default function () {
    new Directive('loading-target').register(VLoadingTargetDirective)
}
