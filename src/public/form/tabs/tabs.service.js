export class TabsService {
    vm
    get options() {
        return this.vm.options
    }
    get value() {
        return this.vm.value
    }
    get multiple() {
        if(this.vm.multiple === '') {
            return true
        } else {
            return !!this.vm.multiple
        }
    }
    get valueKey() {
        return this.vm.valueKey
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
        if(option === null) {
            this.vm.$emit('input', null)
            return
        }
        if(this.multiple) {
            if(!this.value) {
                this.vm.$emit('input', [option])
            } else {
                let target = this.value.find(c => {
                    if(this.valueKey) {
                        return c[this.valueKey] === option[this.valueKey]
                    } else {
                        return c === option
                    }
                })
                if(target) {
                    this.value.splice(this.value.indexOf(target), 1)
                } else {
                    this.value.push(option)
                }
                this.vm.$emit('input', this.value)
            }
        } else {
            if(this.value === option) {
                this.vm.$emit('input', null)
            } else {
                this.vm.$emit('input', option)
            }
        }
    }
    isActive(option) {
        if(option === null) {
            if(this.multiple) {
                return !this.value || !this.value.length
            } else {
                return !this.value
            }
        }
        if(!this.value) {
            return false
        }
        if(this.multiple) {
            let target = this.value.find(c => {
                if(this.valueKey) {
                    return c[this.valueKey] === option[this.valueKey]
                } else {
                    return c === option
                }
            })
            return !!target
        } else {
            return this.value === option
        }
    }
}
