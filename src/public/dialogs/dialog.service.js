import {SimpleSubject} from "../base/utils";
import {Dialog} from "./dialog";
import SuccessComponent from './dialog-success.vue'
import InfoComponent from './dialog-info.vue'
import {ServiceProxyHandlerProperty, SimpleServiceProxyHandler} from "../di.service";

let singleton = null
/**
 export interface OptionsBase {
    message: string;
    title?: string;
    subTitle?: string;
  }
 export interface SuccessOption extends OptionsBase {
    subMessage?: string;
    button?: string;
  }
 export interface InfoOption extends OptionsBase {
    button?: string;
  }
 */
export class DialogService {
  static get instance() {
    if (!singleton) {
      singleton = new DialogService()
    }
    return singleton
  }
  static set instance(inc) {
    singleton = inc
  }

  [ServiceProxyHandlerProperty] = DialogServiceProxyHandler

  dialog = new SimpleSubject();
  constructor() {
  }

  open(comp, config, parent) {
    const instance = new Dialog(config);
    this.dialog.next({
      instance,
      vueComponent: comp,
      parent
    })

    return instance
  }

  // option - OptionsBase
  general(option, component) {
    let opt;
    if (typeof option === 'string') {
      opt = {
        message: option
      };
    } else {
      opt = option;
    }
    return this.open(component, {
      data: opt
    });
  }
  // option - SuccessOption
  success(option) {
    return this.general(option, SuccessComponent);
  }
  // option - InfoOption
  info(option) {
    return this.general(option, InfoComponent);
  }

  confirm(option) {
    return require('../adapter').confirm(option)
  }
}

class DialogServiceProxyHandler extends SimpleServiceProxyHandler {
  get(target, prop, receiver) {
    if(prop === 'open') {
      let originalOpen = Reflect.get(...arguments);
      return (comp, config, parent) => {
        return originalOpen.call(target, comp, config, parent || this.injector.vm)
      }
    }
    return super.get(...arguments)
  }
}
