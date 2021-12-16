import './v-tooltip.less'
import {Directive, DirectiveContext} from "./directive-base";
import {getContext, MouseMoveContext} from "../event-context";
import {DialogService} from "../../dialogs/dialog.service";
import {Position} from "../../dialogs/dialog";

/**
 *  value: string | vueComponentOptions | (createElement, {componentInstance, directiveContext, optionsRef}) => vNode
 */
class VTooltipDirective extends DirectiveContext {
    el
    context
    unwatch = []
    subs = []
    componentInstance
    position

    hover
    dialog

    get ds() {
        return this.componentInstance.$injector.get(DialogService)
    }
    inserted(el, binding, vnode) {
        super.inserted(...arguments);
        this.el = el
        this.context = getContext(MouseMoveContext)
        this.componentInstance = vnode.componentInstance || vnode.context
        for(let key in Position) {
            if(binding.modifiers[key]) {
                this.position = Position[key]
                break
            }
        }
        this.unwatch.push(

        )
        this.subs.push(
            this.context.events.subscribe(ev => {
                const hover = this.isHover(ev.target)
                if(!this.hover && hover) {
                    this.onShow()
                }
                if(this.hover && !hover) {
                    this.onClose()
                }
                this.hover = hover
            })
        )
        if(binding.modifiers.debug) {
            this.onShow()
        }
    }

    unbind(el, binding, vnode) {
        super.unbind(...arguments);
        this.unwatch.forEach(c => c())
        this.unwatch = []
        this.subs.forEach(c => c.unsubscribe())
        this.subs = []
        this.onClose()
    }

    isHover(target) {
        if(this.el.contains(target)) {
            return true
        }
        if(this.dialog && this.dialog._vm.$el.contains(target)) {
            return true
        }
        return false
    }

    onShow() {
        if(!this.dialog) {
            const value = this.value
            if(!value) {
                return
            }
            let comp
            let options = {
                anchor: this.el,
                position: this.position || Position.bottom,
                offset: 4,
                theme: 'theme-dark'
            }
            if(typeof value === 'string') {
                comp = {
                    render(h) {
                        return (<div class="v-tooltip-default">{value}</div>)
                    }
                }
            } else if(typeof value === 'function') {
                const _this = this
                comp = {
                    render(h) {
                        return value(h, { componentInstance: this, directiveContext: _this, optionsRef: options })
                    }
                }
            } else {
                comp = value
            }
            this.dialog = this.ds.open(comp, options)
        }
    }
    onClose() {
        if(this.dialog) {
            this.dialog.close().finally(() => {
                this.dialog = null
            }).catch(err => {})
        }
    }
}

export default function () {
    new Directive('tooltip').register(VTooltipDirective)
}
