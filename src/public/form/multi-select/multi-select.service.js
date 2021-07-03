export class MultiSelectService {
    vm

    value
    options = null
    valueOptions
    allOptions
    loading = false
    dropdownOption = null

    get multiple() {
        if(this.vm.multiple === undefined) {
            return true
        }
        return this.vm.multiple
    }
    get valueKey() {
        return this.vm.valueKey
    }
    get remoteMethod() {
        return this.vm.remoteMethod
    }

    diCreated(vm) {
        this.vm = vm
        vm.$watch('value', val => {
            this.value = val
        }, {
            immediate: true
        })
        vm.$watch(() => {
            if (this.multiple === false) {
                return this.value ? [this.value] : []
            } else {
                return this.value || []
            }
        }, val => {
            this.valueOptions = val
        }, {
            immediate: true
        })
        vm.$watch(() => {
            const options = [].concat(this.options || [], this.valueOptions)
            if (this.valueKey) {
                return options.distinct((a, b) => a[this.valueKey] === b[this.valueKey])
            } else {
                return options
            }
        }, val => {
            this.allOptions = val
        }, {
            immediate: true
        })
    }

    onSelectOption(option) {
        let target
        if(this.valueKey) {
            target = this.valueOptions.find(item => item[this.valueKey] === option[this.valueKey])
        } else {
            target = this.valueOptions.find(item => item === option)
        }
        if(!target) {
            if(this.multiple) {
                this.value.push(option)
            } else {
                this.value = option
            }
        } else {
            if(this.multiple) {
                const index = this.value.indexOf(target)
                this.value.splice(index, 1)
            } else {
                this.value = null
            }
        }
        this.vm.$emit('input', this.value)
    }

    search(keyword) {
        this.loading = true
        Promise.resolve(this.remoteMethod(keyword)).finally(() => {
            this.loading = false
        }).then(data => {
            this.options = data
        })
    }

    isActive(option) {
        if(!this.valueOptions.length) {
            return false
        }
        if(this.valueKey) {
            return this.valueOptions.some(item => item[this.valueKey] === option[this.valueKey])
        }
        return this.valueOptions.indexOf(option) >= 0
    }
}
