import {debounceTime, SimpleSubject} from "./utils";
import {getObjectId} from "./utils";

export function getContext(constructor, dom) {
    if (!dom) {
        dom = constructor.defaultDom
    }
    const listener_context = '__vue_app_context_' + btoa(getObjectId(constructor))
    if (!dom[listener_context]) {
        dom[listener_context] = new constructor(dom)
    }
    return dom[listener_context]
}

export class EventContextBase {
    static defaultDom = document.body
    delay = 50 // ms
    dom
    eventName
    events = new SimpleSubject()

    constructor(dom, eventName) {
        this.dom = dom
        this.eventName = eventName
    }

    listenerRef

    listener(e) {
        this.events.next(e)
    }

    init() {
        if (this.delay) {
            this.listenerRef = debounceTime((e) => {
                this.listener.call(this, e)
            }, this.delay)
        } else {
            this.listenerRef = this.listener.bind(this)
        }
        this.dom.addEventListener(this.eventName, this.listenerRef, false)
    }

    dispose() {
        this.dom.removeEventListener(this.eventName, this.listenerRef, false)
    }
}

export class ScrollContext extends EventContextBase {
    constructor(dom) {
        super(dom, 'scroll')
        this.init()
    }
}

export class RealTimeScrollContext extends EventContextBase {
    delay = 0

    constructor(dom) {
        super(dom, 'scroll')
        this.init()
    }
}

export class MouseMoveContext extends EventContextBase {
    target // reactive in di system, but not reactive in directive
    constructor(dom) {
        super(dom, 'mousemove')
        this.init()
    }

    listener(e) {
        this.events.next(e)
        this.target = e.target
    }
}

export class RealTimeMouseMoveContext extends EventContextBase {
    delay = 0
    target // reactive in di system, but not reactive in directive
    constructor(dom) {
        super(dom, 'mousemove')
        this.init()
    }

    listener(e) {
        this.events.next(e)
        this.target = e.target
    }
}

export class ResizeContext extends EventContextBase {
    static defaultDom = window

    constructor(dom) {
        super(dom, 'resize')
        this.init()
    }
}

export class MouseClickContext extends EventContextBase {
    constructor(dom) {
        super(dom, 'click')
        this.init()
    }
}
export class MouseDownContext extends EventContextBase {
    constructor(dom) {
        super(dom, 'mousedown')
        this.init()
    }
}
export class MouseUpContext extends EventContextBase {
    constructor(dom) {
        super(dom, 'mouseup')
        this.init()
    }
}

export class SelectionChangeContext extends EventContextBase {
    static defaultDom = document
    text

    constructor(dom) {
        super(dom, 'selectionchange')
        this.init()
    }

    listener(e) {
        const selection = document.getSelection()
        this.events.next({
            event: e,
            selection: selection
        })
        this.text = selection.toString()
    }

    getDirection() {
        const selection = this.events._value.selection
        const position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
        if (!position) { // same node
            if (selection.anchorOffset <= selection.focusOffset) {
                return SelectionDirection.forward
            } else {
                return SelectionDirection.backward
            }
        }
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            return SelectionDirection.forward
        } else {
            return SelectionDirection.backward
        }
    }
}

export const SelectionDirection = {
    forward: 'forward',
    backward: 'backward'
}

// todo: detect next mouse move event or mouse up event as selection end, then get that position as mouse end coordinate
export class SelectionEndContext extends SelectionChangeContext {
    delay = 500
}
