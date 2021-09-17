import {Directive, DirectiveContext} from "../directive-base";
import FilePreview from './file-preview'
import {DialogService} from "../../../dialogs/dialog.service";
import {Model} from "../../../dialogs/dialog";
import './file-preview.less'
import {FileType} from "./FileType";

class VFilePreviewDirective extends DirectiveContext {
    src
    ds
    type

    bind(el, binding, vNode) {
        super.bind(...arguments);
        this.ds = vNode.context.$injector.get(DialogService)
        el.classList.add('file-preview')
        this.src = el.src || this.value
        if (!this.src) {
            el.classList.add('disabled')
        } else {
            el.classList.remove('disabled')
        }
        if (binding.modifiers.image) {
            this.type = FileType.image
        } else if (binding.modifiers.video) {
            this.type = FileType.video
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
        this.ds.open(FilePreview, {
            src: this.src || '',
            model: Model.float,
            disableClose: false,
            type: this.type
        });
    }
}

export default function () {
    new Directive('file-preview').register(VFilePreviewDirective)
}
