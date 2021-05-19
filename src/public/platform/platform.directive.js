import {Directive, DirectiveContext} from "../base/directives/directive-base";
import {PlatformService} from "./platform.service";
import {Platform} from "./platform";

class VPlatformDirective extends DirectiveContext {
    bind() {
        super.bind(...arguments)
        this.refresh(...arguments)
    }
    update() {
        super.update(...arguments);
        this.refresh(...arguments)
    }

    refresh(el, binding, vnode) {
        const componentInstance = vnode.componentInstance || vnode.context
        const ps = componentInstance.$injector.get(PlatformService)
        el.classList.remove(Platform.pc)
        el.classList.remove(Platform.mobile)
        el.classList.add(ps.platform)
    }
}


export default function () {
    new Directive('platform').register(VPlatformDirective)
}
