import {debounceTime} from "../utils";

export class MouseMoveService {
    target = null
    constructor() {
        this.onMouseMoveRef = debounceTime((e) => {
            this.onMouseMove.call(this, e)
        }, 50)
    }
    diCreated(vm) {
        document.body.addEventListener('mousemove', this.onMouseMoveRef, false)
    }
    diDestroyed(vm) {
        document.body.removeEventListener('mousemove', this.onMouseMoveRef, false)
    }

    onMouseMoveRef
    onMouseMove(e) {
        this.target = e.target
    }
}
