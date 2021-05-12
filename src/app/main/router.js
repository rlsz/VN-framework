import Home from './home.vue'
import container from './index.vue'

export default {
    path: '/main',
    component: container,
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
        }
    ]
}
