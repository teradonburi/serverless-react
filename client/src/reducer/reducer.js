import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import todo from 'reducer/todo'

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  todo
})