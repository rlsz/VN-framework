export * from './utils'
export * from './directives/directive-base'
export * from './services/local-storage.service'
export * from './services/session-storage.service'
export * from './services/persistence-base'
export * from './services/ajax.service'
export * from './services/loading.service'
export {default as ImgPreview} from './directives/v-img-preview/img-preview.vue'

import fileSelector from './components/app-file-selector.vue'
import emotion from './components/app-emotion.vue'
import scaleBar from './components/app-scale-bar.vue'
import stickyContainer from './components/app-sticky-container.vue'
import vCopy from './directives/v-copy.directive'
import vLimitLine from './directives/v-limit-line.directive'
import vLink from './directives/v-link.directive'
import date from './filters/date'
import number from './filters/number'
import percentage from './filters/percentage'
import fillNumber from './filters/fillNumber'
import highlight from './filters/highlight'
import vHtmlNew from './directives/v-html-new.directive'
import vImgPreview from './directives/v-img-preview/v-img-preview.directive'
import vLoadingTarget from './directives/v-loading-target.directive'

export default function (Vue) {
    Vue.component(fileSelector.name, fileSelector)
    Vue.component(scaleBar.name, scaleBar)
    Vue.component(emotion.name, emotion)
    Vue.component(stickyContainer.name, stickyContainer)
    Vue.use(vCopy)
    Vue.use(vLimitLine)
    Vue.use(vLink)
    Vue.use(date)
    Vue.use(number)
    Vue.use(percentage)
    Vue.use(highlight)
    Vue.use(vHtmlNew)
    Vue.use(fillNumber)
    Vue.use(vImgPreview)
    Vue.use(vLoadingTarget)
}
