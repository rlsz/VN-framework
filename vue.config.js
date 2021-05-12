module.exports = {
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        }
    },
    lintOnSave: false,
    productionSourceMap: process.env.VUE_APP_DEBUG === 'true',
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'vue项目模版'
        }
    }
}
