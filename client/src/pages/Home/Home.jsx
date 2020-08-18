import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import Start from '../../components/Start/Start'
import Profil from '../Profil/Profil'
import Utbildningar from '../Utbildningar/Utbildningar'
import Statistik from '../Statistik/Statistik'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

export default class Home extends Component {
  state = {
    user: {},
    error: null,
    authenticated: false,
    authenticating: true
  }

  componentDidMount() {
    // https://stackoverflow.com/questions/19043511/passport-js-fails-to-maintain-session-in-cross-domain
    fetch("/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json()
        throw new Error("failed to authenticate user")
      })
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          authenticating: false,
          authenticated: true,
          user: responseJson.user
        })
      })
      .catch(error => {
        this.setState({
          authenticating: false,
          authenticated: false,
          error: error
        })
      })
  }

  render() {
    const { authenticated, authenticating, user } = this.state
    if (authenticating) return null
    return (
      <Router>
        <Header
          authenticated={authenticated}
        />

        <Switch>
          <Route exact path="/">
            {!authenticated &&
              <Start />
            }
            {authenticated &&
              <Profil
                kurser={user.kurser}
                program={user.program}
                inriktning={user.inriktning}
                bild={user.picture}
                namn={user.name}
              />
            }
          </Route>
          
          <Route path="/statistik">
            <Statistik />
          </Route>

          <Route path="/utbildningar">
            <Utbildningar />
          </Route>
          <Route path="*">
            <h1>Du har nog kommit lite fel <span role="img" aria-label="404">👁👄👁</span></h1>
          </Route>
        </Switch>
      </Router>
    )
  }
}