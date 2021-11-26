import './v-drag.less'
import {Directive, DirectiveContext} from "../directive-base";
import {deserialize} from "../../utils";
import {DRAGOVER_CLASS} from "./v-drag";

class VDragStartDirective extends DirectiveContext {
    constructor(directive) {
        super(directive);
        this.onDragEnterRef = this.onDragEnter.bind(this)
        this.onDragLeaveRef = this.onDragLeave.bind(this)
        this.onDragOverRef = this.onDragOver.bind(this)
        this.onDropRef = this.onDrop.bind(this)
    }
    onDragEnterRef
    onDragEnter(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        console.log('ondragenter', ev.target.id, ev)
        ev.target.classList.add(DRAGOVER_CLASS)
    }
    onDragLeaveRef
    onDragLeave(ev) {
        console.log('ondragleave', ev.target.id, ev)
        ev.target.classList.remove(DRAGOVER_CLASS)
    }
    onDragOverRef
    onDragOver(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        // console.log('ondragover', ev.target.id, ev)
    }
    onDropRef
    onDrop(ev) {
        ev.preventDefault();
        const {id, data} = deserialize(ev.dataTransfer.getData("text/plain"))
        const sourceElement = document.getElementById(id)
        console.log('ondrop', ev.target.id, ev, data, this.value)
        this.value(data, sourceElement)
    }

    bind(el, binding, vNode) {
        super.bind(...arguments);
        el.addEventListener('dragenter', this.onDragEnterRef, false)
        el.addEventListener('dragleave', this.onDragLeaveRef, false)
        el.addEventListener('dragover', this.onDragOverRef, false)
        el.addEventListener('drop', this.onDropRef, false)
    }
    unbind(el, binding, vnode) {
        super.unbind(...arguments);
        el.removeEventListener('dragenter', this.onDragEnterRef, false)
        el.removeEventListener('dragleave', this.onDragLeaveRef, false)
        el.removeEventListener('dragover', this.onDragOverRef, false)
        el.removeEventListener('drop', this.onDropRef, false)
    }
}
export default function () {
    new Directive('drag-end').register(VDragStartDirective)
}
