import "./styles"
import table from "./table"
import tree from "./tree"
import adapter from './adapter'

import {
    AjaxService,
    default as base,
    LocalStorageService,
    LoadingService,
    SessionStorageService,
    CookieStorageService,
    FullscreenService
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
    ConfigService,
    FullscreenService
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

import {dialogParent} from './dialogs/dialog-root'
export * from './dialogs/dialog-root'

let dialogRoot
export function AppendComponentToRoot(Vue, comp) {
    return new Promise(r => {
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
            r(instance)
        })
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
    Vue.use(table)
    Vue.use(tree)
    AppendComponentToRoot(Vue, DialogsContainer).then(inc => {
        dialogRoot = inc
    })
}
