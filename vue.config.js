const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  lintOnSave: false,
  configureWebpack: config => {
    let plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          output:{
            comments: false
          },
          compress: {
            // warnings: false,
            drop_debugger: true, // console
            drop_console: true,
            pure_funcs: ['console.log'] // 移除console
          }
          // compress: {
          //   warnings: false,
          //   drop_debugger: false,
          //   drop_console: true,
          // },
          // warnings: false
        },
        sourceMap: false,
        parallel: true,
      })
    ]
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
}