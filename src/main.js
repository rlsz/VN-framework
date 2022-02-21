import Vue from 'vue'
import {router, App} from './app'
import axios from 'axios'
axios.defaults.timeout = 20000

import "@/public/styles/global.less"
import publicModule, {RootProviders} from '@/public'
Vue.use(publicModule, router)

import comps from './modules'
import {GuideService} from "@/modules/guide";
Vue.use(comps)

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
    if(info !== "v-on handler (Promise/async)") {
        console.error(err)
    }
}

new Vue({
    di: {
        providers: [
            ...RootProviders,
            GuideService
        ]
    },
    router,
    render: h => h(App)
}).$mount('#app')

