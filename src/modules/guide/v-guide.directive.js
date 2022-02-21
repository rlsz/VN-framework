import {Directive, DirectiveContext} from "@/public/base";
import {GuideService} from "./guide.service";
import Vue from 'vue'

class VGuideDirective extends DirectiveContext {

    el
    guide
    subscription = null
    path

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
        this.path = componentInstance.$route.path
        this.check(this.guide.step._value)

        this.subscription = this.guide.step.subscribe(step => {
            this.check(step)
        })
    }
    update(el, binding){
        super.update(...arguments);
        if(this.guide.target === el) {
            Vue.nextTick(() => {
                this.guide.locationChange()
            })
        }
    }
    unbind(el, binding, vnode, oldVnode) {
        super.unbind(...arguments);
        if(this.subscription) {
            this.subscription.unsubscribe()
            this.subscription = null
        }
    }

    check(step) {
        if(step) {
            if(step.path === this.path && step.step === this.value.step) {
                this.active()
            }
        }
    }

    active() {
        this.guide.active(this.el, this.value).afterClosed().then(res => {
            if(res) {
                this.guide.next(this.value.next)
            } else {
                this.guide.next(null)
            }
        }).catch(err => {})
    }
}

export default function(Vue) {
    new Directive('guide').register(VGuideDirective)
}
