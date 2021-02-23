import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import Start from '../../components/Start/Start'
import Profil from '../Profil/Profil'
import Utbildningar from '../Utbildningar/Utbildningar'
import Statistik from '../Statistik/Statistik'
import Program from '../../components/Program/Program'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom"

export default class Home extends Component {
  state = {
    user: {},
    error: null,
    authenticated: false,
    authenticating: true
  }

  componentDidMount() {
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

    const AktivHeader = withRouter(Header);
    return (
      <Router>
        <AktivHeader
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
            {!authenticated &&
              <Redirect to="/" />
            }
            {authenticated &&
              <Statistik />
            }
          </Route>

          <Route exact path="/utbildningar">
            {!authenticated &&
              <Redirect to="/" />
            }
            {authenticated &&
              <Utbildningar
                meritvärde={user.meritvärde || 0}
              />
            }
          </Route>

          <Route path="/utbildningar/:kod" component={(props) => (
            <>
              {authenticated ?
                <Program {...props} user={user}/>
              : 
                <Redirect to="/" />
              }

            </>
          )}/>


          <Route path="*">
            <h1>Du har nog kommit lite fel <span role="img" aria-label="404">👁👄👁</span></h1>
          </Route>
          
        </Switch>
      </Router>
    )
  }
}