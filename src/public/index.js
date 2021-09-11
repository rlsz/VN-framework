import "./styles/frame.less"
import "./styles/icon.less"
import "./styles/scroll.less"
import "./styles/loadding.less"
import "./form/form.less"
import "./table/table.less"
import "./base/directives/v-limit-line.less"
import "./base/directives/v-html-new.less"
import "./base/directives/v-img-preview/img-preview.less"

import adapter from './adapter'

import {
    AjaxService,
    default as base,
    LocalStorageService,
    LoadingService,
    SessionStorageService,
    CookieStorageService
} from './base'
import logger from './logger'
import dialogs from './dialogs'
import scroll from './scroll'
import form, {TabsService} from './form'
import platform, {PlatformService} from './platform'
import DependencyInjection from './di.service';
import {LoggerService} from "./logger";
import {DialogService, DialogsContainer} from "./dialogs";
import {ConfigService} from "./config.service";
export * from './config.service'

export const RootProviders = [
    {provide: PlatformService, useValue: PlatformService.instance},
    {provide: LoggerService, useValue: LoggerService.instance},
    {provide: DialogService, useValue: DialogService.instance},
    {provide: LoadingService, useValue: LoadingService.instance},
    LocalStorageService,
    SessionStorageService,
    CookieStorageService,
    AjaxService,
    ConfigService
]

export function FindVueRoot() {
    const defautRoot = document.getElementById('app')
    return defautRoot && defautRoot.__vue__
    // console.log(1,defautRoot)
    // if(defautRoot) {
    //     console.dir(defautRoot)
    //     console.log(defautRoot.__vue__)
    //     setTimeout(()=>{
    //         console.log('333',defautRoot.__vue__)
    //     }, 1000)
    //     window.defautRoot = defautRoot
    // }
    // Array.from(document.body.children).find(c => c.__vue__)
}

let dialogRoot
/**
 * vue时序问题：
 * 假设四个组件：View1、View1Child、View2、View2Child
 * 从View1跳转到View2，测试得到的生命周期顺序如下：
 * View1-beforeCreate、View1-created、View1-beforeMount
 * View1Child-beforeCreate、View1Child-created、View1Child-beforeMount、View1Child-Mounted
 * View1-Mounted、View1-nextTick
 * View1Child-nextTick
 *
 * View2-beforeCreate、View2-created、View2-beforeMount
 * View2Child-beforeCreate、View2Child-created、View2Child-beforeMount
 * View1-beforeDestroy
 * View1Child-beforeDestroy、View1Child-destroyed
 * View1-destroyed
 * View2Child-Mounted
 * View2-Mounted、View2-nextTick
 * View2Child-nextTick
 *
 * 使用 (created-nextTick) + (destroyed) 可以得到正常时序：
 * View1-nextTick
 * View1Child-nextTick
 * View1Child-destroyed
 * View1-destroyed
 * View2-nextTick
 * View2Child-nextTick
 *
 * 但是这种控制时序的方法有点trick，暂时使用另外一种时序控制方法：
 * created -- push(vm)
 * destroyed -- pop(vm)
 * 虽然时序不对，但是通过传入vm可以在一定程度上正常使用stack，后期如果发现有问题再调整时序吧
 *
 * @type {{pop(*=): *, stack: *[], readonly current: *, push(*=): void}}
 */
export let dialogParent = {
    stack: [],
    push(vm) {
        this.stack.push(vm)
    },
    pop(vm) {
        return this.stack.splice(this.stack.indexOf(vm), 1)
        // return this.stack.pop() // due to vue lifecycle problem, can't pop in destroyed
    },
    get current() {
        return this.stack[this.stack.length - 1]
    }
}
function AppendComponentToRoot(Vue, comp) {
    Vue.nextTick(() => {
        if(!dialogParent.current) {
            const $root = FindVueRoot()
            dialogParent.push($root)
        }
        const Component = Vue.extend({
            render: h => h(comp)
        });
        const instance = new Component();
        Object.defineProperty(instance, '$parent', {
            get() {
                return dialogParent.current;
            },
            enumerable: true,
            configurable: true
        });
        instance._routerRoot = (instance.$parent && instance.$parent._routerRoot) || instance;
        instance.$mount()
        document.body.appendChild(instance.$el)
        dialogRoot = instance
    })
}
export function ClearAllDialogs() {
    if(dialogRoot && dialogRoot.$children[0]) {
        dialogRoot.$children[0].dialogs.map(c => c).forEach(c => {
            c.instance.error('clear')
        })
    }
}

export default function (Vue, router) {
    Vue.use(platform)
    Vue.use(adapter)
    Vue.use(DependencyInjection)
    Vue.use(base)
    Vue.use(logger)
    Vue.use(dialogs)
    Vue.use(scroll, {hold: router})
    Vue.use(form)
    AppendComponentToRoot(Vue, DialogsContainer)
    Vue.prototype.$ls = LoggerService.instance
}
