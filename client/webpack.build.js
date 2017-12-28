/* eslint-env node */
const config = require('config')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()

const apiOrigin = {
  production: config.get('API_SERVER'),
}[process.env.NODE_ENV]


const entries = [
  {path: 'src', out: ''},
]

const configs = entries.map(entry => {

  const config = Object.assign({}, webpackConfig)

  delete config.devtool
  config.entry = {
    'bundle': [
      'babel-polyfill',
      `${__dirname}/${entry.path}/index`,
    ]
  }
  config.output = {
    path: `${__dirname}/dist/${entry.out}`,
    filename: 'js-[hash:8]/[name].js',
    chunkFilename: 'js-[hash:8]/[name].js',
    publicPath: `/${entry.out}`,
  }

  config.plugins = [
    // Scope Hoisting
    // スコープの巻き上げによる呼び出し回数の削減と圧縮
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 共通モジュールをまとめる
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js-[hash:8]/vendor.js',
      minChunks: (module) => {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    // 環境変数をエクスポート
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'API_ORIGIN': JSON.stringify(apiOrigin),
        'GIT_REVISION': JSON.stringify(revision),
      },
    }),
    // JSミニファイ
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        drop_debugger: true,
        drop_console: true,
        warnings: false
      }
    }),
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      template: `src/static/${entry.out}index.html`,
      filename: 'index.html',
    }),
  ]

  return config
})

configs[0].devtool = 'source-map'
configs[0].plugins.push(
  new CopyWebpackPlugin([{ from: 'src/static', ignore: 'index.html' }]),
)

module.exports = configs
