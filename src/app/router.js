import Vue from 'vue'
import VueRouter from 'vue-router'
import example from './example/router'
import main from './main/router'
import test from './test/router'
import {menuAdapter} from './menuAdapter'

Vue.use(VueRouter)

const routes = [
    main,
    example
]

if (process.env.VUE_APP_DEBUG === 'true') {
    routes.push(test)
}

export const menus = menuAdapter(routes)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
const originalTitle = document.title
router.afterEach(to => {
    document.title = to.meta && to.meta.title || originalTitle
})

export default router
