class DependencyInjection {
    vm
    instanceMap = {}

    get config() {
        return this.vm.$options.di || {}
    }

    get mixinData() {
        const data = {}
        const {inject} = this.config
        if (inject) {
            for (let key in inject) {
                const token = inject[key]
                if (token) {
                    if(token[ContentChildFlag] || token[ContentChildrenFlag]) {
                        data[key] = undefined
                    } else {
                        data[key] = this.get(decorator(token, 'proxyBridge', this))
                    }
                } else {
                    console.error('token must be given for inject key "' + key + '"')
                    data[key] = undefined
                }
            }
        }
        return data
    }

    ownProviders = []
    // 使用instanceMap生成的ownProviders无法排除useValue/useFactory等方式添加的provide，所以改成使用new关键词生成的时候调用
    // get ownProviders() {
    //     return Object.getOwnPropertySymbols(this.instanceMap).map(c => this.instanceMap[c])
    // }

    revocableProxy = []

    constructor(vm) {
        this.vm = vm
        const {providers} = this.config
        providers && providers.forEach(item => this.set(item))
    }

    /** provider examples:
     *      Token
     *
     *      {
     *          provide: Token,
     *          useValue: instance
     *      }
     *
     *      {
     *          provide: Token,
     *          useClass: OtherToken
     *      }
     *
     *      {
     *          provide: Token,
     *          useExisting: OtherToken
     *      }
     *
     *      {
     *          provide: Token,
     *          useFactory: injector => instance,
     *          lifecycle?: Boolean
     *      }
     *
     * @param opts
     */
    set(provider) {
        if(!provider) {
            throw new Error(`provider reference error: ${provider}`)
        }
        let token, value
        if (typeof provider === 'function') {
            token = provider
            value = new token(this)
            this.ownProviders.push(value)
        } else {
            if (!provider.provide && provider.provider) {
                throw new Error(`configuration error: please use provide instead of provider`)
            }
            token = provider.provide
            if(!token) {
                throw new Error(`provide reference error: ${token}`)
            }
            if (provider.useValue) {
                value = provider.useValue
            } else if (provider.useClass) {
                value = new provider.useClass(this)
                this.ownProviders.push(value)
            } else if (provider.useExisting) {
                value = this.get(provider.useExisting)
            } else if (provider.useFactory) {
                value = provider.useFactory.call(this.vm, this)
                if(provider.lifecycle) {
                    this.ownProviders.push(value)
                }
            } else {
                throw new Error(`provider configuration error: ${provider}`)
            }
        }

        let symbol
        if(typeof token === 'symbol') {
            symbol = token
        } else {
            if (!token.InjectionSymbol || (token.name && token.InjectionSymbol.description !== token.name)) {
                token.InjectionSymbol = Symbol(token.name)
            }
            symbol = token.InjectionSymbol
        }
        this.instanceMap[symbol] = value
        return value
    }

    /**
     * @param opts token or
     *          {
     *              provide: token,
     *              proxyBridge?: DependencyInjection ,
     *              [MuteFlag]?: boolean,
     *              [OptionalFlag]?: boolean,
     *              [ContentChildFlag]?: boolean,
     *              [ContentChildrenFlag]?: boolean,
     *          }
     * @returns {*|undefined}
     */
    get(opts) {
        if(!opts) {
            throw new Error(`opts reference error: ${opts}`)
        }
        let token
        if (typeof opts === 'function' || typeof opts === 'symbol') {
            token = opts
            opts = {
                provide: token
            }
        } else {
            if (!opts.provide && opts.provider) {
                throw new Error(`configuration error: please use provide instead of provider`)
            }
            token = opts.provide
            if(!token) {
                throw new Error(`provide reference error: ${token}`)
            }
        }
        if(!opts.source) {
            opts.source = this
        }
        try {
            let symbol, desc
            if(typeof token === 'symbol') {
                symbol = token
                desc = token.toString()
            } else {
                symbol = token.InjectionSymbol
                desc = token.name
                if (!symbol || (desc && symbol.description !== desc)) {
                    if(opts[OptionalFlag]) {
                        return null
                    } else {
                        throw new Error(`target token is not generated for now: ${desc}, current component ${getComponentDesc(opts.source.vm)}`)
                    }
                }
            }
            const target = this.instanceMap[symbol]
            if (target !== undefined) {
                if(opts.proxyBridge && target && target[ServiceProxyHandlerProperty]) {
                    if(typeof target[ServiceProxyHandlerProperty] === "function") {
                        const handler = new target[ServiceProxyHandlerProperty](opts.proxyBridge)
                        const revocable = Proxy.revocable(target, handler)
                        opts.proxyBridge.revocableProxy.push(revocable)
                        return revocable.proxy
                    } else {
                        throw new Error('ServiceProxyHandlerProperty must be set with a class')
                    }
                }
                return target
            }
            if (opts[ContentChildFlag]) {
                for (let child of this.vm.$children) {
                    const inc = child.$injector.get(opts)
                    if(inc) {
                        return inc
                    }
                }
                return undefined
            } else if (opts[ContentChildrenFlag]) {
                let temp = []
                for (let child of this.vm.$children) {
                    const res = child.$injector.get(opts)
                    if(res) {
                        if(Array.isArray(res)) {
                            if(res.length) {
                                temp = temp.concat(res)
                            }
                        } else {
                            temp.push(res)
                        }
                    }
                }
                return temp
            } else {
                if (!this.vm.$parent) {
                    if(opts[OptionalFlag]) {
                        return null
                    } else {
                        throw new Error(`token instance can't be found: ${desc}, current component ${getComponentDesc(opts.source.vm)}`)
                    }
                }
                return this.vm.$parent.$injector.get(opts)
            }
        } catch (e) {
            if(!opts[MuteFlag]) {
                console.error(e)
            }
            return undefined
        }
    }

    detectContent() {
        const {inject} = this.config
        for (let key in inject) {
            const token = inject[key]
            if (token) {
                if(token[ContentChildFlag] || token[ContentChildrenFlag]) {
                    const inc = this.get(decorator(token, 'proxyBridge', this))
                    if(inc) {
                        this.vm.$set(this.vm, key, inc)
                    }
                }
            }
        }
    }
}

/** 在vue组件配置如下参数:
 * di: {
 *     providers: [
 *      Token,
 *      {
 *          provide: Token,
 *          useValue: instance // 使用某个具体的class实例或固定值
 *      },
 *      {
 *          provide: Token,
 *          useClass: OtherToken // 使用其他Token创建实例，常用于有继承关系的Token使用
 *      },
 *      {
 *          provide: Token,
 *          useExisting: OtherToken // 使用其他Token已有的实例，常用于interface的使用
 *      },
 *      {
 *          provide: Token,
 *          useFactory: injector => instance, // 使用自定义回调方法创建实例，需要注意的是返回undefined会导致实例查询报错(遍历搜索时将被跳过导致查询失败)，建议使用null表达空值
 *          lifecycle?: Boolean
 *      }
 *     ],
 *     inject: {
 *         key: Token
 *     }
 * }
 *
 * Terminology:
 * Token: Class, e.g. es6 Class reference or es5 Function constructor
 * provider: an object or class instance identified by Token
 * provide: configuration of provider, must be Token
 * factory: a callback function to generate a provider
 * instanceMap: key - Token symbol, value - provider
 * injector: a DependencyInjection instance bounded with vue component instance, one by one
 * providers: a provider config list used to generate instanceMap
 * inject: mixin all inject key-value to component's data, the value is found by hierarchical injector
 *
 * @param Vue
 * @returns {{}}
 */
export default function (Vue) {
    Vue.config.optionMergeStrategies.di = function (toVal, fromVal) {
        if (!toVal) return fromVal
        if (!fromVal) return toVal
        return {
            providers: [...toVal.providers||[], ...fromVal.providers||[]].distinct(),
            inject: {...toVal.inject||{}, ...fromVal.inject||{}}
        }
    }
    Vue.mixin({
        beforeCreate() {
            this.$injector = new DependencyInjection(this)
        },
        data() {
            return this.$injector.mixinData
        },
        created() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diCreated && providerInstance.diCreated(this)
            })
        },
        mounted() {
            this.$injector.detectContent()
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diMounted && providerInstance.diMounted(this)
            })
        },
        beforeUpdate() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diBeforeUpdate && providerInstance.diBeforeUpdate(this)
            })
        },
        updated() {
            this.$injector.detectContent()
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diUpdated && providerInstance.diUpdated(this)
            })
        },
        destroyed() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diDestroyed && providerInstance.diDestroyed(this)
            })
            // this.$injector.revocableProxy.forEach(revocable => {
            //     revocable.revoke();
            // })
        },
        activated() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diActivated && providerInstance.diActivated(this)
            })
        },
        deactivated() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diDeactivated && providerInstance.diDeactivated(this)
            })
        }
    })
}

export const ServiceProxyHandlerProperty = Symbol('ServiceProxyHandlerProperty')
export class SimpleServiceProxyHandler {
    injector
    constructor(injector) {
        this.injector = injector
    }
    get(target, prop, receiver) {
        return Reflect.get(...arguments);
    }
    set(target, property, value, receiver) {
        return Reflect.set(...arguments);
    }
}
export const MuteFlag = Symbol('MuteFlag')
export const OptionalFlag = Symbol('OptionalFlag')
export const ContentChildFlag = Symbol('ContentChildFlag')
export const ContentChildrenFlag = Symbol('ContentChildrenFlag')


function decorator(opts, key, value = true) {
    if(!opts) {
        throw new Error(`opts reference error: ${opts}`)
    }
    if (typeof opts === 'function' || typeof opts === 'symbol') {
        return {
            provide: opts,
            [key]: value
        }
    } else {
        return {
            ...opts,
            [key]: value
        }
    }
}
export function Mute(token) {
    return decorator(token, MuteFlag)
}
export function Optional(token) {
    return decorator(token, OptionalFlag)
}
export function ContentChild(token) {
    return decorator(token, ContentChildFlag)
}
export function ContentChildren(token) {
    return decorator(token, ContentChildrenFlag)
}

function getComponentDesc(vm, paths = []) {
    if(!vm || !vm.$vnode || !vm.$vnode.tag) {
        return paths.join(' > ')
    }
    const path = vm.$vnode.tag.replace(/vue-component-\d+-/, '')
    paths.unshift(path)
    return getComponentDesc(vm.$parent, paths)
}
