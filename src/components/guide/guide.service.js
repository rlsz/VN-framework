import {DialogService, Position} from "@/public/dialogs";
import AppGuideDialog from './app-guide-dialog.vue'
export class GuideService {
    injector
    get ds() {
        return this.injector.get(DialogService)
    }

    current
    constructor(injector) {
        this.injector = injector
        console.log('GuideService init')
    }
    next(opts) {
        this.current = opts
        this.ds.open(AppGuideDialog, {
            anchor: opts.target,
            position: Position.right,
            disableClose: true,
            description: opts.description
        })
    }
}
