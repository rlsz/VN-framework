import Vue from 'vue'

export class Directive {
    key

    get context() {
        return '__v_' + this.key + '__'
    }

    constructor(key) {
        this.key = key
    }

    register(contextConstructor) {
        const _this = this
        Vue.directive(_this.key, {
            bind(el) {
                const context = new contextConstructor(_this)
                el[_this.context] = context
                context.bind(...arguments)
            },
            inserted(el) {
                el[_this.context].inserted(...arguments)
            },
            update(el) {
                el[_this.context].update(...arguments)
            },
            unbind(el) {
                el[_this.context].unbind(...arguments)
            }
        })
    }
}

export class DirectiveContext {
    value
    onClickReference

    // eslint-disable-next-line no-unused-vars
    constructor(directive) {
        this.onClickReference = this.onClick.bind(this)
    }

    // eslint-disable-next-line no-unused-vars
    bind(el, binding, vnode, oldVnode) {
        this.value = binding.value
        el.addEventListener('click', this.onClickReference)
    }

    inserted(el, binding, vnode, oldVnode) {
    }

    // eslint-disable-next-line no-unused-vars
    update(el, binding, vnode, oldVnode) {
        this.value = binding.value
    }

    // eslint-disable-next-line no-unused-vars
    unbind(el, binding, vnode, oldVnode) {
        el.removeEventListener('click', this.onClickReference)
    }

    // eslint-disable-next-line no-unused-vars
    onClick(e) {
    }
}
