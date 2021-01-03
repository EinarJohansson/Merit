import React from 'react'
import ReactDOM from 'react-dom'
// CSS
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// Components
import Home from './pages/Home/Home'
// Övrigt
import * as serviceWorker from './config/serviceWorker'

ReactDOM.render(
  <Home />
  ,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
