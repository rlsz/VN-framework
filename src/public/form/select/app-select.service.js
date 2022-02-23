import {LoggerService} from "../../logger/logger.service";

export class AppSelectService {
    vm
    injector
    unwatch = []

    value
    options = []
    valueOptions
    allOptions
    loading = false
    dropdownOption = null

    constructor(injector) {
        this.injector = injector
    }

    get ls() {
        return this.injector.get(LoggerService)
    }

    get multiple() {
        if (this.vm.multiple === undefined) {
            return false
        }
        if (this.vm.multiple === '') {
            return true
        }
        return this.vm.multiple
    }

    get labelKey() {
        return this.vm.labelKey
    }

    get valueKey() {
        return this.vm.valueKey
    }

    get idKey() {
        return this.vm.idKey
    }

    get multipleLimit() {
        if (this.vm.multipleLimit) {
            const num = Number(this.vm.multipleLimit)
            if (isNaN(num)) {
                return 0
            } else {
                return num
            }
        } else {
            return 0
        }
    }

    diCreated(vm) {
        this.vm = vm
        this.unwatch.push(
            vm.$watch('value', val => {
                this.value = val
            }, {
                immediate: true
            }),
            vm.$watch(() => {
                let arr
                if (this.multiple) {
                    arr = this.value || []
                } else {
                    arr = this.isEmpty() ? [] : [this.value]
                }
                if(this.valueKey) {
                    const optionsMap = this.options.reduce((obj, item) => {
                        obj[this.getValue(item)] = item
                        return obj
                    }, {})
                    arr = arr.map(c => {
                        if(optionsMap[c]) {
                            return optionsMap[c]
                        }
                        const obj = { [this.valueKey]: c }
                        if(this.labelKey) {
                            obj[this.labelKey] = c
                        }
                        return obj
                    })
                }
                return arr
            }, val => {
                this.valueOptions = val
            }, {
                immediate: true
            }),
            vm.$watch(() => {
                const options = [].concat(this.options || [], this.valueOptions)
                return options.distinct((a, b) => this.getId(a) === this.getId(b))
            }, val => {
                this.allOptions = val
            }, {
                immediate: true
            })
        )
        this.getData()
    }

    diDestroyed(vm) {
        this.unwatch.forEach(c => c())
        this.unwatch = []
    }

    getValue(option) {
        if (this.valueKey) {
            return option[this.valueKey]
        } else {
            return option
        }
    }

    getLabel(option) {
        if (this.labelKey) {
            return option[this.labelKey]
        } else if (this.valueKey) {
            return option[this.valueKey]
        } else {
            return option
        }
    }

    getId(option) {
        if (this.idKey) {
            return option[this.idKey]
        } else if (this.valueKey) {
            return option[this.valueKey]
        } else {
            return option
        }
    }

    onSelectOption(option) {
        let target = this.valueOptions.find(item => this.getId(item) === this.getId(option))
        if (!target) {
            const value = this.getValue(option)
            if (this.multiple) {
                if (this.multipleLimit > 0) {
                    if (this.value.length < this.multipleLimit) {
                        this.value.push(value)
                    } else {
                        this.ls.error(`最多只能选择${this.multipleLimit}个`)
                    }
                } else {
                    this.value.push(value)
                }
            } else {
                this.value = value
            }
        } else {
            if (this.multiple) {
                this.value.splice(this.value.indexOf(target), 1)
            } else {
                this.value = null
            }
        }
        this.vm.$emit('input', this.value)
    }

    getData(keyword) {
        this.loading = true
        let $data
        if (this.vm.options) {
            $data = Promise.resolve(this.vm.options)
        } else if (this.vm.remoteMethod) {
            $data = Promise.resolve(this.vm.remoteMethod(keyword))
        } else {
            $data = Promise.resolve([])
        }
        return $data.finally(() => {
            this.loading = false
        }).then(data => {
            return this.options = data || []
        })
    }

    isActive(option) {
        console.log(JSON.stringify(option), JSON.stringify(this.valueOptions), this.getId(option))
        if (!this.valueOptions.length) {
            return false
        }
        return this.valueOptions.some(item => this.getId(item) === this.getId(option))
    }

    isEmpty() {
        if (this.multiple) {
            return !this.value || !this.value.length
        } else {
            return this.value === undefined || this.value === null || this.value === ''
        }
    }
}
