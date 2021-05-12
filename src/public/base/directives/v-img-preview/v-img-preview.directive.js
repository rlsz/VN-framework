import {Directive, DirectiveContext} from "../directive-base";
import ImgPreview from './img-preview'
import {DialogService} from "../../../dialogs/dialog.service";

const virtual_a = document.createElement('a')

class VImgPreviewDirective extends DirectiveContext {
    src
    ds

    bind(el, binding, vNode) {
        super.bind(...arguments);
        this.ds = vNode.context.$injector.get(DialogService)
        el.classList.add('img-preview')
        this.src = el.src || this.value
        if (!this.src) {
            el.classList.add('disabled')
        } else {
            el.classList.remove('disabled')
        }
    }

    update(el, binding) {
        super.update(...arguments)
        this.src = el.src || this.value
        if (!this.src) {
            el.classList.add('disabled')
        } else {
            el.classList.remove('disabled')
        }
    }

    onClick() {
        this.ds.open(ImgPreview, {
            src: this.src || ''
        });
    }
}

export default function () {
    new Directive('img-preview').register(VImgPreviewDirective)
}
