import guideDirective from './v-guide.directive'
import {AppendComponentToRoot} from "@/public";
import AppGuideMask from './app-guide-mask.vue'
export * from './guide.service'

export default function (Vue) {
    Vue.use(guideDirective)
    AppendComponentToRoot(Vue, AppGuideMask).then(inc => {
        console.log('guide mask inserted', inc)
    })
}
