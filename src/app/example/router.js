import Home from './Home.vue'
import container from './index.vue'

export default {
    path: '/example',
    component: container,
    meta: {
        title: '示例模块'
    },
    children: [
        {
            path: '',
            redirect: 'home'
        },
        {
            path: 'home',
            component: Home,
            meta: {
                title: '首页'
            }
        },
        {
            path: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "main" */ './About.vue'),
            meta: {
                title: '关于'
            }
        },
        {
            path: 'daily',
            component: () => import(/* webpackChunkName: "main" */ './daily.vue'),
            meta: {
                title: '每日资讯'
            }
        }
    ]
}
