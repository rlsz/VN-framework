import {IsInFullScreen, SimpleSubject, ToggleFullScreen} from "../utils";

export class FullscreenService {
    state = new SimpleSubject()
    originalHandlerRef

    constructor(injector) {
        this.update()
        this.originalHandlerRef = this.originalHandler.bind(this)
    }

    diCreated(vm) {
        // https://stackoverflow.com/questions/10706070/how-to-detect-when-a-page-exits-fullscreen
        if (document.addEventListener) {
            document.addEventListener('fullscreenchange', this.originalHandlerRef, false);
            document.addEventListener('mozfullscreenchange', this.originalHandlerRef, false);
            document.addEventListener('MSFullscreenChange', this.originalHandlerRef, false);
            document.addEventListener('webkitfullscreenchange', this.originalHandlerRef, false);
        }
    }

    diDestroyed(vm) {
        if (document.addEventListener) {
            document.removeEventListener('fullscreenchange', this.originalHandlerRef);
            document.removeEventListener('mozfullscreenchange', this.originalHandlerRef);
            document.removeEventListener('MSFullscreenChange', this.originalHandlerRef);
            document.removeEventListener('webkitfullscreenchange', this.originalHandlerRef);
        }
    }

    update() {
        this.state.next(IsInFullScreen())
    }

    toggle(el, status) {
        Promise.resolve(ToggleFullScreen(el, status)).then(() => {
            this.update()
        })
    }

    originalHandler() {
        this.update()
    }
}
