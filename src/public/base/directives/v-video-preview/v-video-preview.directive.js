import {Directive, DirectiveContext} from "../directive-base";
import VideoPreview from './video-preview'
import {DialogService} from "../../../dialogs/dialog.service";
import {Model} from "../../../dialogs/dialog";
import './video-preview.less'

class VVideoPreviewDirective extends DirectiveContext {
    src
    ds

    bind(el, binding, vNode) {
        super.bind(...arguments);
        this.ds = vNode.context.$injector.get(DialogService)
        el.classList.add('video-preview')
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
        this.ds.open(VideoPreview, {
            src: this.src || '',
            model: Model.float,
            disableClose: false
        });
    }
}

export default function () {
    new Directive('video-preview').register(VVideoPreviewDirective)
}
