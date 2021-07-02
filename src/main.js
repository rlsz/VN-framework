import Vue from 'vue'
import {router, App} from './app'
import axios from 'axios'
axios.defaults.timeout = 20000

import "@/public/styles/global.less"
import publicModule, {RootProviders} from '@/public'
Vue.use(publicModule, router)

Vue.config.productionTip = false

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

new Vue({
    di: {
        providers: [
            ...RootProviders
        ]
    },
    router,
    render: h => h(App)
}).$mount('#app')

