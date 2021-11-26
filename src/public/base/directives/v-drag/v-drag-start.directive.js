import {Directive, DirectiveContext} from "../directive-base";
import {
    DRAGOVER_CLASS,
    DRAG_CONTEXT,
    DRAG_FRAMEWORK_CLASS,
    DRAG_START_CLASS,
    DROP_AREA_CLASS,
    DROP_AREA_DISABLED_CLASS
} from './v-drag'

function findParent(el, className) {
    if(!el || !el.parentNode) {
        return null
    }
    if(el.parentNode === document.documentElement) {
        return null
    }
    if(el.parentNode.classList.contains(className)) {
        return el.parentNode
    } else {
        return findParent(el.parentNode, className)
    }
}

class VDragStartDirective extends DirectiveContext {
    constructor(directive) {
        super(directive);
        this.onDragStartRef = this.onDragStart.bind(this)
        this.onDragEndRef = this.onDragEnd.bind(this)
    }
    onDragStartRef
    onDragStart(ev) {
        ev.dataTransfer.effectAllowed = "copy";
        // console.log('ondragstart', ev.target.id, ev.target, ev, this.value)
        window[DRAG_CONTEXT] = {
            source: ev.target,
            data: this.value
        }
        const dropArea = findParent(ev.target, DROP_AREA_CLASS)
        dropArea.classList.add(DROP_AREA_DISABLED_CLASS)
        ev.target.classList.add(DRAG_START_CLASS)
        document.body.classList.add(DRAG_FRAMEWORK_CLASS)
    }
    onDragEndRef
    onDragEnd(ev) {
        if(ev.dataTransfer.dropEffect === 'copy') {
            // console.log('ondragend', ev.target.id, ev, ev.dataTransfer.dropEffect)
        } else { // 'none'
            // console.log('ondragend cancel', ev, ev.dataTransfer.dropEffect)
        }
        delete window[DRAG_CONTEXT]
        document.querySelectorAll('.' + DRAGOVER_CLASS).forEach(element => {
            element.classList.remove(DRAGOVER_CLASS)
        })
        document.querySelectorAll('.' + DROP_AREA_DISABLED_CLASS).forEach(element => {
            element.classList.remove(DROP_AREA_DISABLED_CLASS)
        })
        document.body.classList.remove(DRAG_FRAMEWORK_CLASS)
        ev.target.classList.remove(DRAG_START_CLASS)
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
