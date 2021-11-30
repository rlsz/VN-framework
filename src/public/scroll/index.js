import scroll from './app-scroll.vue'
import listScrollable from './app-list-scrollable.vue'
export * from './scroll-monitor.service'

/**
 *
 * @param Vue
 * @param opts {hold:router}
 */
export default function (Vue, opts = {}) {
    Vue.component(scroll.name, scroll)
    Vue.component(listScrollable.name, listScrollable)
    if (opts.hold) {
        initHoldPosition(opts.hold)
    }
}

// https://github.com/vuejs/vue-router/issues/1187
export function initHoldPosition(router) {
    const scrollableElementClass = 'app-scroll-holder' // You should change this
    const scrollPositions = Object.create(null)
    let popstateDetected = false

    router.beforeEach((to, from, next) => {
        if (popstateDetected) {
            popstateDetected = false
            setTimeout(() => {
                let currentRouteName = router.history.current.path
                let elements = Array.from(document.querySelectorAll('.' + scrollableElementClass))
                if (elements.length && currentRouteName in scrollPositions) {
                    elements.forEach(element => {
                        element.scrollTop = scrollPositions[currentRouteName][element.id]
                    })
                }
            }, 0)
        } else {
            let elements = Array.from(document.querySelectorAll('.' + scrollableElementClass))
            if (elements.length) {
                scrollPositions[from.path] = elements.reduce((map, element) => {
                    if (element.id) {
                        map[element.id] = element.scrollTop
                    }
                    return map
                }, {})
            }
        }
        next()
    })
    window.addEventListener('popstate', () => {
        popstateDetected = true
    })
}
