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
    dialog = null
    start = false

    constructor(injector) {
        this.injector = injector
    }

    diCreated(vm) {
        this.vm = vm
    }

    /**
     * next()
     * next(null)
     * next('step-id')
     * next({path:route, step:step-id})
     * next({path:route, step:step-id, autoJump:true})
     *
     * @param step: {path:route, step:step-id, autoJump: boolean}
     */
    next(step) {
        if(!this.start) {
            return
        }
        if(step) {
            if(this.dialog) {
                this.dialog.error('cancel')
            }
            if(typeof step === 'string') {
                step = {
                    step: step,
                    path: this.vm.$router.currentRoute.path
                }
            }
            this.step.next(step)
            if(step.autoJump && step.path !== this.vm.$router.currentRoute.path) {
                this.vm.$router.push(step.path)
            }
        } else if (step === null) {
            if(this.dialog) {
                this.dialog.error('cancel')
            }
            this.start = false
            this.step.next(null)
        } else if (step === undefined) {
            if(this.dialog) {
                return this.dialog.close(true)
            }
        } else {
            throw 'unknown step'
        }
    }

    active(target, options) {
        if(options.start) {
            this.start = true
        }
        if(!this.start) {
            return
        }
        this.target = target
        this.dialog = this.ds.open(AppGuideDialog, {
            anchor: target,
            position: Position.right,
            disableClose: true,
            ...options,
            offset: 20
        })
        this.dialog.afterClosed().finally(() => {
            this.target = null
            this.dialog = null
        }).catch(err => {})
        return this.dialog
    }

    locationChange() {
        if(this.target) {
            document.body.querySelector('.app-guide-mask-root').__vue__.refresh()
        }
        if(this.dialog && this.dialog._vm) {
            this.dialog._vm.fixPositionByAnchor()
        }
    }
}
