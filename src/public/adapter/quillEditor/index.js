import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
import QuilEditorBridge from "./quill-editor-bridge.vue"; // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

export default function (Vue) {
    Vue.component(QuilEditorBridge.name, QuilEditorBridge)
}
