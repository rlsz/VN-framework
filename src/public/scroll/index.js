import scroll from './app-scroll.vue'
import listScrollable from './app-list-scrollable.vue'

/**
 *
 * @param Vue
 * @param opts {hold:router}
 */
export default function(Vue, opts = {}) {
    Vue.component(scroll.name, scroll)
    Vue.component(listScrollable.name, listScrollable)
    if(opts.hold){
        initHoldPosition(opts.hold)
    }
}

// https://github.com/vuejs/vue-router/issues/1187
export function initHoldPosition(router) {
    const scrollableElementId = 'position-holder' // You should change this
    const scrollPositions = Object.create(null)

    router.beforeEach((to, from, next) => {
        let element = document.getElementById(scrollableElementId)
        if (element !== null) {
            const top = element.scrollTop
            scrollPositions[from.path] = top
        }
        next()
    })

    window.addEventListener('popstate', () => {
        setTimeout(()=>{
            let currentRouteName = router.history.current.path
            let element = document.getElementById(scrollableElementId)
            if (element !== null && currentRouteName in scrollPositions) {
                element.scrollTop = scrollPositions[currentRouteName]
            }
        }, 0)
    })
}
