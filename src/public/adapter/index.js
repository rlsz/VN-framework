// export * from './default'
// import temp from './default'
export * from './element'
import temp from './element'
// export * from './vant'
// import temp from './vant'

import quillEditor from './quillEditor'

export default function (Vue) {
    Vue.use(temp)
    Vue.use(quillEditor)
}
