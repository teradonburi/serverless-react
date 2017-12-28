// reducerで受け取るaction名を定義
const CREATE = 'todo/CREATE'
const LOAD = 'todo/LOAD'
const UPDATE = 'todo/UPDATE'
const DELETE = 'todo/DELETE'

// 初期化オブジェクト
const initialState = {
  todos: [],
}

// reducerの定義（dispatch時にコールバックされる）
export default function reducer(state = initialState, action = {}){
  // actionの種別に応じてstateを更新する
  switch (action.type) {
    case CREATE:
      return {
        todos: [...state.todos, action.results]
      }
    case LOAD:
      return {
        todos: action.results,
      }
    case UPDATE:

      if (action.results) {
        state.todos = state.todos.map(t => {
          if (t.id === action.results.id) {
            return t = action.results
          }
          return t
        })
      }

      return {
        todos: [...state.todos]
      }
    case DELETE:
      if (action.results) {
        state.todos = state.todos.filter(t => t.id !== action.results)
      }

      return {
        todos: state.todos
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function create(data) {
  return (dispatch, getState, client) => {
    return client
      .post('/api/todos', data)
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: CREATE, results })
      })
  }
}

export function load() {
  return (dispatch, getState, client) => {
    return client
      .get('/api/todos')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}

export function update(id, data) {
  return (dispatch, getState, client) => {
    return client
      .put(`/api/todos/${id}`, data)
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: UPDATE, results })
      })
  }
}

export function del(id) {
  return (dispatch, getState, client) => {
    return client
      .delete(`/api/todos/${id}`)
      .then(res => {
        const results = id
        // dispatchしてreducer呼び出し
        dispatch({ type: DELETE, results })
      })
  }
}
