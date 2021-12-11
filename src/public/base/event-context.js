import {debounceTime, SimpleSubject} from "./utils";
import {getObjectId} from "./utils";

export function getContext(constructor, dom) {
    if(!dom) {
        dom = constructor.defaultDom
    }
    const listener_context = '__vue_app_context_' + btoa(getObjectId(constructor))
    if(!dom[listener_context]) {
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
        if(this.delay) {
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
    listener(e) {
        const {offsetHeight, scrollHeight} = e.target
        if (offsetHeight !== scrollHeight) {
            this.events.next(e)
        }
    }
}

export class RealTimeScrollContext extends EventContextBase {
    delay = 0
    constructor(dom) {
        super(dom, 'scroll')
        this.init()
    }
    listener(e) {
        const {offsetHeight, scrollHeight} = e.target
        if (offsetHeight !== scrollHeight) {
            this.events.next(e)
        }
    }
}

export class MouseMoveContext extends EventContextBase {
    target // reactive in di system, but not reactive in directive
    constructor(dom) {
        super(dom, 'mousemove')
        this.init()
    }
    listener(e) {
        this.events.next(e.target)
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
