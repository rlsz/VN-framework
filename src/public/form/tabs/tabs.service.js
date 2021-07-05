export class TabsService {
    vm
    get options() {
        return this.vm.options
    }
    get value() {
        return this.vm.value
    }

    diCreated(vm) {
        this.vm = vm
        // vm.$watch('options', val => {
        //     if(val && val.length) {
        //         this.onSelectTab(val[0])
        //     }
        // }, {
        //     immediate: true
        // })
    }

    onSelectTab(option) {
        if(this.value === option) {
            this.vm.$emit('input', null)
        } else {
            this.vm.$emit('input', option)
        }
    }
}
