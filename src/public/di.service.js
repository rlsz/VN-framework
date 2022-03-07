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
                    data[key] = this.get(token, {
                        checkProxy: true,
                        proxyBridge: this
                    })
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
     *          useFactory: injector => instance
     *      }
     *
     * @param opts
     */
    set(provider) {
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
    }

    /**
     *
     * @param token
     * @param opts { mute?: boolean, checkProxy?: boolean, proxyBridge: DependencyInjection }
     * @returns {*|undefined}
     */
    get(token, opts = {}) {
        if(typeof opts === 'boolean') {
            opts = {
                mute: opts
            }
        }
        if(token && token[OptionalFlag]) {
            opts.optional = true
            token = token.provide
        }
        try {
            if(!token) {
                throw new Error(`invalid token ${token}`)
            }
            let symbol
            if(typeof token === 'symbol') {
                symbol = token
            } else {
                symbol = token.InjectionSymbol
                if (!symbol || (token.name && symbol.description !== token.name)) {
                    if(opts.optional) {
                        return null
                    } else {
                        throw new Error(`target token is not generated for now: ${token && token.toString()}`)
                    }
                }
            }
            const target = this.instanceMap[symbol]
            if (target !== undefined) {
                if(opts.checkProxy && target && target[ServiceProxyHandlerProperty]) {
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
            if (!this.vm.$parent) {
                if(opts.optional) {
                    return null
                } else {
                    throw new Error(`token instance can't be found: ${token && token.toString()}`)
                }
            }
            return this.vm.$parent.$injector.get(token, opts)
        } catch (e) {
            if(!opts.mute) {
                console.error(e)
            }
            return undefined
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
 *          lifecycle: Boolean
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
export const OptionalFlag = Symbol('OptionalFlag')
export function Optional(token) {
    return {
        provide: token,
        [OptionalFlag]: true
    }
}
