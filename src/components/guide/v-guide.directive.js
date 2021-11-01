import {Directive, DirectiveContext} from "@/public/base";
import {GuideService} from "./guide.service";

class VGuideDirective extends DirectiveContext {

    el
    guide
    subscription = null

    /**
     * @param binding.value: { step: string, next: string, description: string }
     */
    bind(el, binding, vnode) {
        super.bind(...arguments);
        el.classList.add('v-guide-general')
        this.el = el
    }

    inserted(el, binding, vnode) {
        super.inserted(...arguments);
        const componentInstance = vnode.componentInstance || vnode.context
        this.guide = componentInstance.$injector.get(GuideService)
        if(this.guide.step._value === this.value.step) {
            this.active()
        }
        this.subscription = this.guide.step.subscribe(id => {
            if(id === this.value.step) {
                this.active()
            }
        })
    }
    update(el, binding){
        super.update(...arguments);
    }
    unbind(el, binding, vnode, oldVnode) {
        super.unbind(...arguments);
        if(this.subscription) {
            this.subscription.unsubscribe()
            this.subscription = null
        }
    }

    active() {
        this.guide.active(this.el, this.value).then(res => {
            if(res) {
                this.guide.next(this.value.next)
            } else {
                this.guide.next()
            }
        })
    }

}

export default function(Vue) {
    new Directive('guide').register(VGuideDirective)
}
