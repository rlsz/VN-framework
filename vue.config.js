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
    },
    chainWebpack(config) {
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule
            .use('babel-loader')
            .loader('babel-loader')
            .end()
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({
                svgo: false
            });
    }
}
