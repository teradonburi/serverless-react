import React from 'react'
import { Link } from 'react-router-dom'

import { AppBar, Toolbar, Card, CardContent } from 'material-ui'


export default class TopPage extends React.Component {

  render () {
    
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            TOPページ
          </Toolbar>
        </AppBar>
        <Card style={{padding: 10}}>
          <CardContent>
            <Link to='/todo'>TODOページへ</Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}