import {Distinct} from "../base/utils";

export function CombineValidators(...args) {
    return args.reduce((res, item) => {
        let {validator, trigger} = item
        if (!validator) {
            console.error('invalid validator')
            throw new Error(item)
        }
        if (typeof trigger === 'string') {
            trigger = [trigger]
        }
        return {
            validator: (rule, value, callback) => {
                return res.validator(rule, value, err => {
                    if (err) {
                        return callback(err)
                    } else {
                        return validator(rule, value, callback)
                    }
                })
            },
            trigger: Distinct([...res.trigger, ...trigger], (a, b) => a === b)
        }
    }, {
        validator: (rule, value, callback) => callback(),
        trigger: []
    })
}

// export function TriggerValidator(form, rules) {
//     const pArr = Object.keys(rules).map(key => {
//         const rule = rules[key]
//         const value = form[key]
//         return Promise.all(
//             rule.map(item => {
//                 return new Promise((r, j) => {
//                     item.validator({
//                         field: key,
//                         fullField: key,
//                         type: typeof value,
//                         validator: rule.validator
//                     }, value, err => {
//                         if (err) {
//                             j(err)
//                         } else {
//                             r()
//                         }
//                     })
//                 })
//             })
//         )
//     })
//     return Promise.all(pArr)
// }
export function TriggerValidator(formRef, props) {
    if(typeof props === "string") {
        props = [props]
    }
    const pArr = props.map(prop => {
        return new Promise((r, j) => {
            formRef.validateField(prop, err => {
                if (err) {
                    j(err)
                } else {
                    r()
                }
            })
        })
    })
    return Promise.all(pArr)
}

/** 通用校验规则
 * trigger： blur - 输入框，change - 选择框
 */
export class ElFormValidators {
    static required(label) {
        return {
            validator: (rule, value, callback) => {
                if (!value && value !== 0) {
                    return callback(new Error(label + '不能为空'))
                }
                return callback()
            },
            trigger: 'blur'
        }
    }

    static number(label) {
        return {
            validator: (rule, value, callback) => {
                if (/[^0-9]/g.test(value)) {
                    return callback(new Error(label + '必须为数字'))
                }
                return callback()
            },
            trigger: 'blur'
        }
    }

    static max(label, max) {
        return {
            validator: (rule, value, callback) => {
                if (typeof value === 'number') {
                    if (value > max) {
                        return callback(new Error(label + '不能超过' + max))
                    }
                }
                if (typeof value === 'string') {
                    if (value.length > max) {
                        return callback(new Error(label + '长度不能超过' + max + '位'))
                    }
                }
                return callback()
            },
            trigger: 'blur'
        }
    }

    static min(label, min) {
        return {
            validator: (rule, value, callback) => {
                if (typeof value === 'number') {
                    if (value < min) {
                        return callback(new Error(label + '不能小于' + min))
                    }
                }
                if (typeof value === 'string') {
                    if (value.length < min) {
                        return callback(new Error(label + '长度不能少于' + min + '位'))
                    }
                }
                return callback()
            },
            trigger: 'blur'
        }
    }

    static phone(label) {
        return CombineValidators(
            ElFormValidators.required(label),
            ElFormValidators.number(label),
            ElFormValidators.min(label, 11),
            ElFormValidators.max(label, 11)
        )
    }

    static password(label) {
        return CombineValidators(
            ElFormValidators.required(label),
            ElFormValidators.min(label, 6),
            ElFormValidators.max(label, 20)
        )
    }

    static confirm_password(label, passwordGetter) {
        return CombineValidators(
            ElFormValidators.required(label),
            {
                validator: (rule, value, callback) => {
                    if (value !== passwordGetter()) {
                        return callback(new Error(label + '必须与密码相同'))
                    }
                    return callback()
                },
                trigger: 'blur'
            }
        )
    }

    static verify_code(label) {
        return CombineValidators(
            ElFormValidators.required(label),
            ElFormValidators.min(label, 4),
            ElFormValidators.max(label, 4)
        )
    }

    static sms_verify_code(label) {
        return CombineValidators(
            ElFormValidators.required(label),
            ElFormValidators.min(label, 6),
            ElFormValidators.max(label, 6)
        )
    }
}