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
                    data[key] = this.get(token)
                } else {
                    console.error('token must be given for inject key "' + key + '"')
                    data[key] = undefined
                }
            }
        }
        return data
    }

    get ownProviders() {
        return Object.getOwnPropertySymbols(this.instanceMap).map(c => this.instanceMap[c])
    }

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
        } else {
            if (!provider.provide && provider.provider) {
                throw new Error(`configuration error: please use provide instead of provider`)
            }
            token = provider.provide
            if (provider.useValue) {
                value = provider.useValue
            } else if (provider.useClass) {
                value = new provider.useClass(this)
            } else if (provider.useExisting) {
                value = this.get(provider.useExisting)
            } else if (provider.useFactory) {
                value = provider.useFactory.call(this.vm, this)
            } else {
                throw new Error(`provider configuration error: ${provider}`)
            }
        }
        if (!token.InjectionSymbol || (token.name && token.InjectionSymbol.description !== token.name)) {
            token.InjectionSymbol = Symbol(token.name)
        }
        this.instanceMap[token.InjectionSymbol] = value
    }

    get(token) {
        try {
            if (!token.InjectionSymbol || (token.name && token.InjectionSymbol.description !== token.name)) {
                throw new Error(`target token is not generated for now: ${token}`)
            }
            const target = this.instanceMap[token.InjectionSymbol]
            if (target !== undefined) {
                return target
            }
            if (!this.vm.$parent) {
                throw new Error(`token instance can't be found: ${token}`)
            }
            return this.vm.$parent.$injector.get(token)
        } catch (e) {
            console.error(e)
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
 *          useFactory: injector => instance // 使用自定义回调方法创建实例，需要注意的是返回undefined会导致实例查询报错(遍历搜索时将被跳过导致查询失败)，建议使用null表达空值
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
        destroyed() {
            this.$injector.ownProviders.forEach(providerInstance => {
                providerInstance?.diDestroyed && providerInstance.diDestroyed(this)
            })
        }
    })
}
