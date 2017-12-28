import React from 'react'
import { connect } from 'react-redux'
import { create, load, update, del } from 'reducer/todo'

import { withStyles } from 'material-ui/styles'
import { AppBar, Toolbar, Card, CardContent, Button, TextField, List, ListItem } from 'material-ui'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'


const renderField = ({
  id,
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => {
  const isError = !!(touched && error)
  return (
    <div>
      <div>
        <TextField id={id} style={{marginTop: 5, marginBottom: 5}} error={isError} label={label} helperText={isError ? error : ''} {...input} type={type} />
      </div>
    </div>
  )
}

@connect(
  state => ({
    todos : state.todo.todos
  }),
  { create, load, update, del }
)
@reduxForm({
  form: 'syncValidation',
  validate: values => {
    
    const errors = {}
    if (!values.text) {
      errors.text = '必須項目です'
    }

    return errors
  }
})
export default class TodoPage extends React.Component {

  constructor (props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    this.props.load()
  }

  submit(values) {
    this.props.create({text: values.text})
  }

  checked(todo) {
    todo.checked = !todo.checked 
    this.props.update(todo.id, todo)
  }

  remove(id) {
    this.props.del(id)
  }

  render () {
    const { handleSubmit, submitting, todos } = this.props

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            TODOページ
          </Toolbar>
          <Link to='/' style={{position: 'absolute', right: 30, top: 30}}>TOPページへ</Link>
        </AppBar>
        <Card style={{padding: 10}}>
          <CardContent>
            <form onSubmit={handleSubmit(this.submit)}>
              <Field name="text" type="text" component={renderField} label="TODO" />
              <Button style={{marginTop: 10}} raised type="submit" disabled={submitting}>追加</Button>
            </form>
          </CardContent>
          <List>
            {
              todos.length > 0 &&
              todos.map(t => 
                <ListItem key={t.id} style={{borderTop: '1px solid'}}><span style={{textDecoration: t.checked ? 'line-through' : 'none', marginRight: 30}}>{t.text}</span><span style={{position: 'absolute', top: 10, right: 100}}><input type='checkbox' checked={t.checked} onChange={() => this.checked(t)} />完了</span><Button raised onClick={() => this.remove(t.id)} style={{position: 'absolute', top: 5, right: 0}} >削除</Button></ListItem> 
              )
            }
          </List>
        </Card>
      </div>
    )
  }
}