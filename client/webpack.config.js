const config = require('config')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?/',
    'react-hot-loader/patch',
    path.join(__dirname,'/src/index'), // エントリポイントのjsxファイル
  ],
  // importの相対パスを絶対パスで読み込みできるようにする
  resolve: {
    modules: ['src', 'node_modules'], // 対象のフォルダ
    extensions: ['.js', '.json'] // 対象のファイル
  },
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: path.join(__dirname, '/src/static'), // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す場合にindex.htmlに飛ばす
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: config.get('PORT') + 1, // 起動ポート,
    host: '0.0.0.0',
  },
  output: {
    publicPath: '/', // デフォルトルートにしないとHMRは有効にならない
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_ORIGIN: `'${config.get('API_SERVER')}'`,
      },
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
    // autoprefixerプラグイン利用、cssのベンダープレフィックスを自動的につける 
    new webpack.LoaderOptionsPlugin({options: {
      postcss: [precss, autoprefixer({browsers: ['last 2 versions']})]
    }})
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      include: [path.join(__dirname , '/src')],// src配下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          // babel build presets
          presets: [
            [
              'env', {
                targets: {
                  browsers: ['last 2 versions', '> 1%']
                },
                modules: false,
                useBuiltIns: true
              }
            ],
            'stage-0',
            'react'
          ],
          // babel トランスパイルプラグイン
          plugins: [
            "babel-plugin-transform-decorators-legacy", // decorator用
            "react-hot-loader/babel" // react-hot-loader用
          ] 
        }
      }
    }]
  }
}

