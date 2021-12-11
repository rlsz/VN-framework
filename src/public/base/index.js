export * from './utils'
export * from './event-context'
export * from './directives/directive-base'
export * from './services/local-storage.service'
export * from './services/session-storage.service'
export * from './services/persistence-base'
export * from './services/ajax.service'
export * from './services/loading.service'
export * from './services/cookie-storage.service'
export * from './services/fullscreen.service'
export * from './services/mouse-move.service'
export {default as ImgPreview} from './directives/v-img-preview/img-preview.vue'
export {default as VideoPreview} from './directives/v-video-preview/video-preview.vue'
export {default as FilePreview} from './directives/v-file-preview/file-preview.vue'
export {default as ImgUploader} from './components/img-uploader.vue'
export {default as ActionsDialog} from './components/actions-dialog.vue'
export {default as ProgressBarDialog} from './components/progress-bar-dialog.vue'

import fileSelector from './components/app-file-selector.vue'
import emotion from './components/app-emotion.vue'
import scaleBar from './components/app-scale-bar.vue'
import stickyContainer from './components/app-sticky-container.vue'
import sendSmsCode from './components/app-send-sms-code.vue'
import textarea from './components/app-textarea.vue'
import checkbox from './components/app-checkbox.vue'
import appSwitch from './components/app-switch.vue'
import appDragIcon from './components/app-drag-icon.vue'
import vCopy from './directives/v-copy.directive'
import vLimitLine from './directives/v-limit-line/v-limit-line.directive'
import vLink from './directives/v-link.directive'
import date from './filters/date'
import number from './filters/number'
import percentage from './filters/percentage'
import fillNumber from './filters/fillNumber'
import highlight from './filters/highlight'
import vHtmlNew from './directives/v-html-new/v-html-new.directive'
import vImgPreview from './directives/v-img-preview/v-img-preview.directive'
import vVideoPreview from './directives/v-video-preview/v-video-preview.directive'
import vFilePreview from './directives/v-file-preview/v-file-preview.directive'
import vLoadingTarget from './directives/v-loading-target.directive'
import vTooltip from './directives/v-tooltip.directive'
import vDrag from './directives/v-drag'

export default function (Vue) {
    Vue.component(fileSelector.name, fileSelector)
    Vue.component(scaleBar.name, scaleBar)
    Vue.component(emotion.name, emotion)
    Vue.component(stickyContainer.name, stickyContainer)
    Vue.component(sendSmsCode.name, sendSmsCode)
    Vue.component(textarea.name, textarea)
    Vue.component(checkbox.name, checkbox)
    Vue.component(appSwitch.name, appSwitch)
    Vue.component(appDragIcon.name, appDragIcon)
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
    Vue.use(vVideoPreview)
    Vue.use(vFilePreview)
    Vue.use(vLoadingTarget)
    Vue.use(vTooltip)
    Vue.use(vDrag) // v-drag-start="data"; v-drag-end="onDragEnd", onDragEnd: (data, sourceElement) => void
}
