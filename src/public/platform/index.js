import platformDirective from "./platform.directive";
export * from './platform'
export * from './platform.service'

export default function(Vue) {
    Vue.use(platformDirective)
}
