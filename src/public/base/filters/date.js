import {FormatDate} from '../utils'

export default function (Vue) {
    Vue.filter('date', function (value, format) {
        return FormatDate(value, format)
    })
}
