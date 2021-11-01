import {Directive, DirectiveContext} from "@/public/base";
import {GuideService} from "./guide.service";

class VGuideDirective extends DirectiveContext {
    bind(el, binding, vnode) {
        super.bind(...arguments);


        el.classList.add('v-guide-general')

    }
    inserted(el, binding, vnode) {
        super.inserted(...arguments);

        const componentInstance = vnode.componentInstance || vnode.context
        const guide = componentInstance.$injector.get(GuideService)
        guide.next({
            target: el,
            description: 'test'
        })
        console.log('v-guide inserted', componentInstance, el, el.getBoundingClientRect())
    }
    update(el, binding){
        super.update(...arguments);
    }
}

export default function(Vue) {
    new Directive('guide').register(VGuideDirective)
}
