import {Directive, DirectiveContext} from "../directive-base";
import {serialize} from "../../utils";
import {DRAG_ID} from './v-drag'
class VDragStartDirective extends DirectiveContext {
    constructor(directive) {
        super(directive);
        this.onDragStartRef = this.onDragStart.bind(this)
        this.onDragEndRef = this.onDragEnd.bind(this)
    }
    onDragStartRef
    onDragStart(ev) {
        ev.dataTransfer.effectAllowed = "copy";
        if(!ev.target.id) {
            ev.target.id = DRAG_ID
        }
        ev.dataTransfer.setData("text/plain", serialize({
            id: ev.target.id,
            data: this.value
        }));
        console.log('ondragstart', ev.target.id, ev, this.value)
    }
    onDragEndRef
    onDragEnd(ev) {
        if(ev.dataTransfer.dropEffect === 'copy') {
            console.log('ondragend', ev.target.id, ev, ev.dataTransfer.dropEffect)
        } else { // 'none'
            console.log('ondragend cancel', ev, ev.dataTransfer.dropEffect)
        }
        if(ev.target.id === DRAG_ID) {
            ev.target.removeAttribute('id')
        }
    }

    bind(el, binding, vNode) {
        super.bind(...arguments);
        el.addEventListener('dragstart', this.onDragStartRef, false)
        el.addEventListener('dragend', this.onDragEndRef, false)
        el.draggable = 'true'
    }
    unbind(el, binding, vnode) {
        super.unbind(...arguments);
        el.removeEventListener('dragstart', this.onDragStartRef, false)
        el.removeEventListener('dragend', this.onDragEndRef, false)
    }
}
export default function () {
    new Directive('drag-start').register(VDragStartDirective)
}
