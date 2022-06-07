import {Distinct, GetFileExtension, GetJsType} from "../base/utils";
import {EXTENSION_MAP} from "../base/mime/mime-type";

export function CombineValidators(...args) {
    return args.reduce((res, item) => {
        let {required, validator, trigger} = item
        if (!validator) {
            console.error('invalid validator')
            throw new Error(item)
        }
        if (typeof trigger === 'string') {
            trigger = [trigger]
        }
        return {
            required: required === undefined ? res.required : required,
            validator: (rule, value, callback, source, options) => {
                return res.validator(rule, value, err => {
                    if (err) {
                        return callback(err)
                    } else {
                        return validator(rule, value, callback, source, options)
                    }
                }, source, options)
            },
            trigger: Distinct([...res.trigger, ...trigger], (a, b) => a === b)
        }
    }, {
        validator: (rule, value, callback, source, options) => callback(),
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

// export function TriggerValidator(formRef, props) {
//     if(typeof props === "string") {
//         props = [props]
//     }
//     const pArr = props.map(prop => {
//         return new Promise((r, j) => {
//             formRef.validateField(prop, err => {
//                 if (err) {
//                     j(err)
//                 } else {
//                     r()
//                 }
//             })
//         })
//     })
//     return Promise.all(pArr)
// }

/**
 * 解决问题点：分析源码可以看出，validateField方法如果prop找不到对应的el-form-item的话，callback将不会被调用，
 *           本次优化将这个feature调整为校验失败
 *           ps: 按照该方法的设计目的，这类问题通常只在开发阶段暴露出来，所以使用校验失败的方式处理
 * @param formRef
 * @param props
 * @returns {Promise<unknown[]>}
 * @constructor
 */
export function TriggerValidator(formRef, props) {
    if (typeof props === "string") {
        props = [props]
    }
    const pArr = props.map(prop => {
        return new Promise((r, j) => {
            const field = formRef.fields.find(field => prop === field.prop);
            if (field) {
                field.validate('', err => {
                    if (err) {
                        j(err)
                    } else {
                        r()
                    }
                });
            } else {
                j(`unknown prop ${prop}`)
            }
        })
    })
    return Promise.all(pArr)
}

export const NumberSymbol = Symbol('validator-number')

/** 通用校验规则
 * trigger： blur - 输入框，change - 选择框
 */
export class ElFormValidators {
    static required(label, trigger) {
        return {
            required: true,
            validator: (rule, value, callback) => {
                if (!value && value !== 0 && value !== false) {
                    return callback(new Error(label + '不能为空'))
                }
                if (typeof value === 'string' && /^\s*$/gi.test(value)) {
                    return callback(new Error(label + '不能为空'))
                }
                if (value instanceof Array && value.length === 0) {
                    return callback(new Error(label + '不能为空'))
                }
                return callback()
            },
            trigger: trigger || ['blur', 'change']
        }
    }

    static number(label) {
        return {
            validator: (rule, value, callback, source, options) => {
                options[NumberSymbol] = true
                if (!/^\s*-?\d*\.?\d*\s*$/.test(value)) {
                    return callback(new Error(label + '必须为数字'))
                }
                return callback()
            },
            trigger: ['blur', 'change']
        }
    }

    static max(label, max, includeEdge = true) {
        return {
            validator: (rule, value, callback, source, options) => {
                if (typeof value === 'number' || options[NumberSymbol]) {
                    if (includeEdge) {
                        if (value > max) {
                            return callback(new Error(label + '不能超过' + max))
                        }
                    } else {
                        if (value >= max) {
                            return callback(new Error(label + '必须小于' + max))
                        }
                    }
                }
                if (typeof value === 'string') {
                    if (includeEdge) {
                        if (value.length > max) {
                            return callback(new Error(label + '长度不能超过' + max + '位'))
                        }
                    } else {
                        if (value.length >= max) {
                            return callback(new Error(label + '长度必须小于' + max + '位'))
                        }
                    }
                }
                return callback()
            },
            trigger: ['blur', 'change']
        }
    }

    static min(label, min, includeEdge = true) {
        return {
            validator: (rule, value, callback, source, options) => {
                if (typeof value === 'number' || options[NumberSymbol]) {
                    if (includeEdge) {
                        if (value < min) {
                            return callback(new Error(label + '不能小于' + min))
                        }
                    } else {
                        if (value <= min) {
                            return callback(new Error(label + '必须大于' + min))
                        }
                    }
                }
                if (typeof value === 'string') {
                    if (includeEdge) {
                        if (value.length < min) {
                            return callback(new Error(label + '长度不能少于' + min + '位'))
                        }
                    } else {
                        if (value.length <= min) {
                            return callback(new Error(label + '长度必须大于' + min + '位'))
                        }
                    }
                }
                return callback()
            },
            trigger: ['blur', 'change']
        }
    }

    static regexp(msg, reg) {
        return {
            validator: (rule, value, callback) => {
                if (value && reg.test(value)) {
                    return callback(new Error(msg))
                }
                return callback()
            },
            trigger: ['blur', 'change']
        }
    }

    static regexp_not(msg, reg) {
        return {
            validator: (rule, value, callback) => {
                if (value && !reg.test(value)) {
                    return callback(new Error(msg))
                }
                return callback()
            },
            trigger: ['blur', 'change']
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
                trigger: ['blur', 'change']
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

    // isDuplicate: any => boolean
    static duplicate(label, isDuplicate) {
        return {
            validator: (rule, value, callback) => {
                if (isDuplicate(value)) {
                    return callback(new Error(label + '不能重复'))
                }
                return callback()
            },
            trigger: ['blur', 'change']
        }
    }

    // e.g. { size: '20M', extensions: ['docx','pdf'] }
    static file(label, {size, extensions}) {
        if (typeof extensions === 'string') {
            extensions = [extensions]
        }
        let maxSize = size && GetFileSize(size) || 0
        return {
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback()
                }
                const validSize = !maxSize || value.size <= maxSize
                let validType
                if (value.type) {
                    validType = [].concat(...extensions.map(c => EXTENSION_MAP['.'+c].mimes)).indexOf(value.type) >= 0
                } else {
                    validType = extensions.indexOf(GetFileExtension(value.name)) >= 0
                }
                if (!validSize || !validType) {
                    return callback(new Error(`${label}请上传${size?size+'以内的':''}${extensions.join('、')}文件`))
                }
                return callback()
            },
            trigger: 'change'
        }
    }
}

/**
 * W3C 标准中有如下规定：

 When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.

 即：当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 <el-form> 标签上添加 @submit.native.prevent。
 */

/** 获取字符串类型的文件大小，1 kb = 1024 b, 1 Mb = 1024 * 1024 b
 * 100, '100b', '10k', '20M', '20m'
 * @param size
 * @constructor
 */
function GetFileSize(size) {
    if (typeof size === 'string') {
        if(/^(\d+)b$/i.test(size)) {
            return Number(RegExp.$1)
        }
        if(/^(\d+)k$/i.test(size)) {
            return Number(RegExp.$1) * 1024
        }
        if(/^(\d+)m$/i.test(size)) {
            return Number(RegExp.$1) * 1024 * 1024
        }
        if(/^(\d+)g$/i.test(size)) {
            return Number(RegExp.$1) * 1024 * 1024 * 1024
        }
        if(/^(\d+)t$/i.test(size)) {
            return Number(RegExp.$1) * 1024 * 1024 * 1024 * 1024
        }
    }
    const fileSize = Number(size)
    return isNaN(fileSize) ? 0 : fileSize
}
