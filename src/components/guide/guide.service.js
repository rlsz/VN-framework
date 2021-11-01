import {DialogService, Position} from "@/public/dialogs";
import AppGuideDialog from './app-guide-dialog.vue'
import {SimpleSubject} from "@/public/base";
export class GuideService {
    injector
    vm
    get ds() {
        return this.injector.get(DialogService)
    }

    step = new SimpleSubject()
    target = null

    constructor(injector) {
        this.injector = injector
    }

    diCreated(vm) {
        this.vm = vm
    }

    /**
     *
     * @param id: step-id, page:step-id
     */
    next(id) {
        this.target = null
        if(id) {
            if(/^(.+):(.+)$/.test(id)) {
                this.step.next(RegExp.$2)
                this.vm.$router.push(RegExp.$1)
            } else {
                this.step.next(id)
            }
        } else {
            this.step.next(null)
        }
    }

    active(target, options) {
        this.target = target
        return this.ds.open(AppGuideDialog, {
            anchor: target,
            position: Position.right,
            disableClose: true,
            options
        }).afterClosed()
    }
}
