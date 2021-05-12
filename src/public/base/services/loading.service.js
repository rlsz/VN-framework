import {DialogService} from "./../../dialogs/dialog.service";

let singleton = null
const loadingClass = 'v-loading-frame'
const loadingOvertClass = 'v-loading-frame-overt'
export class LoadingService {
    static get instance() {
        if (!singleton) {
            singleton = new LoadingService()
        }
        return singleton
    }

    delay = 200
    count = 0
    openTimer = null
    loadingInstance = null
    ds

    // get show() {
    //     return document.body.classList.contains('v-loading-frame')
    // }

    constructor() {
        this.ds = DialogService.instance
    }

    open() {
        document.body.classList.add(loadingOvertClass)
        if (document.body.querySelectorAll('.v-loading-target').length) {
            return
        }
        if (!this.loadingInstance) {
            this.loadingInstance = this.ds.open({
                render(h) {
                    // return h('i', { class: 'loading', style: 'background-color: rgba(0,0,0,.7);color: white;'})
                    return h('i', {class: 'loading-general'})
                }
            }, {
                transparent: true
            })

            this.loadingInstance.afterClosed().then(() => {
                this.loadingInstance = null
            })
        }
    }

    close() {
        document.body.classList.remove(loadingOvertClass)
        if (this.loadingInstance) {
            this.loadingInstance.close()
        }
    }

    increase() {
        this.count++
        this.refresh()
    }

    decrease() {
        this.count = Math.max(this.count - 1, 0)
        this.refresh()
    }

    refresh() {
        if (this.count > 0) {
            document.body.classList.add(loadingClass)
            if (!this.openTimer) {
                this.openTimer = setTimeout(() => {
                    this.openTimer = null
                    this.open()
                }, this.delay)
            }
        } else {
            document.body.classList.remove(loadingClass)
            if (this.openTimer) {
                clearTimeout(this.openTimer)
                this.openTimer = null
            }
            this.close()
        }
    }
}
