import './v-drag.less'
import {Directive, DirectiveContext} from "../directive-base";
import {DRAG_CONTEXT, DRAGOVER_CLASS, DROP_AREA_CLASS} from "./v-drag";

class VDragStartDirective extends DirectiveContext {
    el
    constructor(directive) {
        super(directive);
        this.onDragEnterRef = this.onDragEnter.bind(this)
        this.onDragLeaveRef = this.onDragLeave.bind(this)
        this.onDragOverRef = this.onDragOver.bind(this)
        this.onDropRef = this.onDrop.bind(this)
    }
    onDragEnterRef
    onDragEnter(ev) {
        if(this.el.contains( window[DRAG_CONTEXT].source)) {
            return
        }
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        // console.log('ondragenter', ev.target.id, ev.target, ev)
        this.el.classList.add(DRAGOVER_CLASS)
    }
    onDragLeaveRef
    onDragLeave(ev) {
        if(this.el.contains( window[DRAG_CONTEXT].source)) {
            return
        }
        if(ev.target === this.el) {
            // console.log('ondragleave', ev.target.id, ev.target, ev)
            this.el.classList.remove(DRAGOVER_CLASS)
        }
    }
    onDragOverRef
    onDragOver(ev) {
        if(this.el.contains( window[DRAG_CONTEXT].source)) {
            return
        }
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        // console.log('ondragover', ev.target.id, ev)
    }
    onDropRef
    onDrop(ev) {
        if(this.el.contains( window[DRAG_CONTEXT].source)) {
            return
        }
        ev.preventDefault();
        const {source, data} = window[DRAG_CONTEXT]
        // console.log('ondrop', ev.target.id, ev, data, this.value)
        this.value(data, source)
    }

    bind(el, binding, vNode) {
        super.bind(...arguments);
        this.el = el
        // console.log('drop bind', el)
        el.classList.add(DROP_AREA_CLASS)
        el.addEventListener('dragenter', this.onDragEnterRef, false)
        el.addEventListener('dragleave', this.onDragLeaveRef, false)
        el.addEventListener('dragover', this.onDragOverRef, false)
        el.addEventListener('drop', this.onDropRef, false)
    }
    unbind(el, binding, vnode) {
        super.unbind(...arguments);
        // console.log('drop unbind', el)
        el.classList.remove(DROP_AREA_CLASS)
        el.removeEventListener('dragenter', this.onDragEnterRef, false)
        el.removeEventListener('dragleave', this.onDragLeaveRef, false)
        el.removeEventListener('dragover', this.onDragOverRef, false)
        el.removeEventListener('drop', this.onDropRef, false)
    }
    update(el, binding, vnode) {
        super.update(...arguments);
        // console.log('drop update', el)
        el.classList.add(DROP_AREA_CLASS)
    }
}
export default function () {
    new Directive('drag-end').register(VDragStartDirective)
}
