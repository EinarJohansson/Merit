import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import Start from '../../components/Start/Start'
import Profil from '../../components/Profil/Profil'

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
      <div>
        <Header
          authenticated={authenticated}
        /> 
        {!authenticated && 
          <Start/>
        }
        {authenticated && 
          <Profil 
            kurser={user.kurser}
            program={user.program || 'Inget program'}
            inriktning={user.inriktning || 'Ingen inriktning'}
            bild={user.picture}
            namn={user.name}
          />
        }
      </div>
    )
  }
}