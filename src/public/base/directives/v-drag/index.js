import './v-drag.less'
import vDragStart from './v-drag-start.directive'
import vDragEnd from './v-drag-end.directive'

export default function (Vue) {
    Vue.use(vDragStart)
    Vue.use(vDragEnd)
}
