import {Directive, DirectiveContext} from "./directive-base";
class VLimitLineDirective extends DirectiveContext {
    bind(el, binding) {
        el.classList.add('limit-line-general')
        if(binding.value) {
            el.style.setProperty('-webkit-line-clamp', binding.value);
        }
        if (!binding.modifiers.noTitle) {
            el.title = el.innerText;
        }
    }
    update(el, binding){
        if (!binding.modifiers.noTitle) {
          el.title = el.innerText;
        }
    }
}
export default function() {
    new Directive('limit-line').register(VLimitLineDirective)
}
