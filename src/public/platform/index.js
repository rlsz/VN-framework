import platformDirective from "./platform.directive";
import {PlatformService} from "./platform.service";
export * from './platform'
export * from './platform.service'

export default function(Vue) {
    Vue.directive('platform', platformDirective(PlatformService.instance.platform))
}
