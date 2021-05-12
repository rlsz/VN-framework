import {Directive, DirectiveContext} from "../../base/directives/directive-base";

function stopEnterReplacer() {
    if (!this.visible) {
        this.toggleMenu();
    } else {
        if (this.options[this.hoverIndex]) {
            // this.handleOptionSelect(this.options[this.hoverIndex]);
        }
    }
}

function handleMenuEnter(event) {
    // this.$nextTick(() => this.scrollToOption(this.selected));
}

class VElSelectModifyDirective extends DirectiveContext {
    bind(el, binding, vnode) {
        super.bind(...arguments);
        let config = this.value || 'noEnter,noScrollToSelected'
        config = config.split(',').map(c => c.trim())
        if (config.indexOf('noEnter') >= 0) {
            vnode.componentInstance.selectOption = stopEnterReplacer.bind(vnode.componentInstance)
        }
        if (config.indexOf('noScrollToSelected') >= 0) {
            vnode.componentInstance.handleMenuEnter = handleMenuEnter.bind(vnode.componentInstance)
        }
    }
}

export default function () {
    new Directive('el-select-modify').register(VElSelectModifyDirective)
}
