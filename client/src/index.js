import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import client from 'axios'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import reducer from './reducer/reducer'

// ブラウザ履歴保存用のストレージを作成
const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, applyMiddleware(routerMiddleware(history),thunkWithClient))

client.interceptors.request.use(req => {
  const token = null //store.getState().auth.user.token

  if (token) {
    // ieのリクエストキャッシュ対策
    document.execCommand && document.execCommand('ClearAuthenticationCache', 'false')
    req.url += (req.url.indexOf('?') == -1 ? '?' : '&') + '_=' + Date.now()
    // 認証トークン
    req.headers.Authorization = `Bearer ${token}`
  }
  if (req.url.indexOf('/') === 0) {
    req.url = process.env.API_ORIGIN + req.url
  }
  return req
}, err => Promise.reject(err))


const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => { render(App) })
}