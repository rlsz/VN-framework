import {SimpleSubject} from "../base";
import {Dialog} from "./dialog";
import {confirm} from '../adapter'
import SuccessComponent from './dialog-success.vue'
import InfoComponent from './dialog-info.vue'

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

  dialog = new SimpleSubject();
  constructor() {
  }

  open(comp, config) {
    const instance = new Dialog(config);
    this.dialog.next({
      instance,
      vueComponent: comp
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
    return confirm(option)
  }
}
