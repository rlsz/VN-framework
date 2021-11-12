import {InjectAdapter, throttle} from '../../base/utils'

export class FormInputAdapter {
    vm
    elFormItem
    diCreated(vm) {
        this.vm = vm
        this.elFormItem = InjectAdapter('elFormItem', this.vm)
    }

    validate(event) {
        this.elFormItem.validate(event)
    }
}
