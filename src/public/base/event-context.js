import {debounceTime, SimpleSubject} from "./utils";
import {getObjectId} from "./utils";

export function getContext(constructor, dom = document.body) {
    const listener_context = '__vue_app_context_' + btoa(getObjectId(constructor))
    if(!dom[listener_context]) {
        dom[listener_context] = new constructor(dom)
    }
    return dom[listener_context]
}

export class EventContextBase {
    dom
    eventName
    events = new SimpleSubject()
    constructor(dom, eventName) {
        this.dom = dom
        this.eventName = eventName
    }
    listenerRef
    listener(e) {
        console.error('not implement', e)
    }

    init() {
        this.listenerRef = debounceTime((e) => {
            this.listener.call(this, e)
        }, 50)
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
        const {offsetHeight, scrollHeight} = this.scrollDom
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
