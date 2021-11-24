import {SessionStorageService} from "./session-storage.service";

export function getObjectId(obj, paths = []) {
    const protoName = obj.__proto__.constructor.name
    paths.push(protoName)
    if (protoName === 'Object') {
        return paths.join('.')
    }
    return getObjectId(obj.__proto__, paths)
}

/** 持久化存储基类，使用类名作为持久化唯一ID，如果同一个类包含多个实例的话将会造成冲突，建议在更上层使用一个唯一实例的类作为容器实现持久化
 *
 */
export class PersistenceBase {
    _init = false
    injector
    vm

    constructor(injector) { // called in beforeCreated lifecycle
        this.injector = injector
        this.toJSON = () => {
            return Object.keys(this)
                .filter(key => {
                    if(this.persistenceEscapeWhiteList && this.persistenceEscapeWhiteList.length) {
                        return this.persistenceEscapeWhiteList.indexOf(key) >= 0
                    } else {
                        return this.persistenceEscape.indexOf(key) < 0 && typeof key === 'string'
                    }
                }).reduce((value, key) => {
                    // @ts-ignore
                    value[key] = this[key]
                    return value
                }, {})
        }
        return new Proxy(this, {
            set: function (target, property, value, receiver) {
                const temp = Reflect.set(...arguments);
                if(temp) {
                    if(target.persistenceEscapeWhiteList && target.persistenceEscapeWhiteList.length) {
                        if(target.persistenceEscapeWhiteList.indexOf(property) >= 0) {
                            target.store()
                        }
                    } else {
                        if(target.persistenceEscape.indexOf(property) < 0) {
                            target.store()
                        }
                    }
                }
                return temp
            }
        });
    }

    diCreated(vm) {
        this.vm = vm
        this.restore()
    }

    diMounted() {

    }

    diDestroyed() {

    }

    get persistenceKey() {
        return btoa(getObjectId(this))
    }
    get session() {
        return this.injector.get(SessionStorageService)
    }

    persistenceEscape = ['injector', 'vm', 'persistenceKey', 'persistenceEscape', '_init', 'session']
    persistenceEscapeWhiteList = null

    store() {
        if (!this._init) {
            return
        }
        this.session.set(this.persistenceKey, this)
    }

    restore() {
        const session = this.injector.get(SessionStorageService)
        const value = session.get(this.persistenceKey)
        value && Object.keys(value).forEach(key => {
            this[key] = value[key]
        })
        this._init = true
    }

    clear() {
        this.session.remove(this.persistenceKey)
    }
}

