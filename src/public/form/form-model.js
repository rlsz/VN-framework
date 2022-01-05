import {SimpleClone, SimpleSubject} from "../base/utils";
import {Optional} from "../di.service";

export const FORM_MODEL = Symbol('form-model')
export const FormModel = {
    edit: 'edit',
    detail: 'detail',
    disabled: 'disabled'
}
export const FormModelEvent = {
    confirm: 'confirm',
    cancel: 'cancel'
}
export class FormModelService {
    formModel
    event = new SimpleSubject()
    constructor(injector, model = FormModel.detail) {
        this.formModel = model
    }
    confirm() {
        this.formModel = FormModel.detail
        this.event.next(FormModelEvent.confirm)
    }
    cancel() {
        this.formModel = FormModel.detail
        this.event.next(FormModelEvent.cancel)
    }
}
export class FormControlService {
    vm
    injector
    subs = []
    get fms() {
        return this.injector.get(Optional(FormModelService))
    }

    originalValue

    constructor(injector) {
        this.injector = injector
    }

    diCreated(vm) {
        this.vm = vm
        if(this.fms) {
            this.originalValue = SimpleClone(this.vm.value)
            this.subs.push(
                this.fms.event.subscribe(ev => {
                    if(ev === FormModelEvent.cancel) {
                        this.vm.$emit('input', this.originalValue)
                    }
                })
            )
        }
    }
    diDestroyed() {
        if (this.subs) {
            this.subs.forEach(item => item.unsubscribe())
            this.subs = []
        }
    }
}
