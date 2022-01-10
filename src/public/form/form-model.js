import {SimpleClone, SimpleSubject} from "../base/utils";
import {Optional} from "../di.service";

export const FORM_MODEL = Symbol('form-model')
export const FormModel = {
    edit: 'edit',
    detail: 'detail',
    disabled: 'disabled'
}
export const FormModelEvent = {
    edit: 'edit',
    confirm: 'confirm',
    cancel: 'cancel'
}
export class FormModelService {
    formModel
    event = new SimpleSubject()
    constructor(injector, model = FormModel.detail) {
        this.formModel = model
    }
    edit() {
        this.formModel = FormModel.edit
        this.event.next(FormModelEvent.edit)
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
            this.storeValue()
            this.subs.push(
                this.fms.event.subscribe(ev => {
                    if(ev === FormModelEvent.cancel) {
                        this.vm.$emit('input', this.originalValue)
                    }
                    if(ev === FormModelEvent.confirm) {
                        this.storeValue()
                    }
                    if(ev === FormModelEvent.edit) {
                        this.storeValue()
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

    storeValue() {
        this.originalValue = SimpleClone(this.vm.value)
    }
}
