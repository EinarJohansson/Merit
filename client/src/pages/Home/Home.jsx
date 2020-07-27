import React, { Component } from 'react'
import { Container, Card, CardDeck } from 'react-bootstrap'
import Header from '../../components/Header/Header'
// import Table from './components/Table/Table'

export default class Home extends Component {
  state = {
    user: {},
    error: null,
    authenticated: false
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
          authenticated: true,
          user: responseJson.user
        })
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: error
        })
      })
  }

  render() {
    const { authenticated } = this.state
    return (
      <div>
        <Header
          authenticated={authenticated}
        />
        <Container>
          <CardDeck>
            <Card>
              <Card.Img variant="top" src="https://cdns-images.dzcdn.net/images/cover/b4b270703fb4baacadbcfec9f4c0f332/264x264.jpg" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer.
              </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Img variant="top" src="https://www.sfbok.se/sites/default/files/styles/1000x/sfbok/sfbokbilder/123/123515.jpg?bust=1369989051&itok=aj8lcwq0" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This card has supporting text below as a natural lead-in to additional
        content.{' '}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Img variant="top" src="https://img.fruugo.com/product/8/28/14436288_max.jpg" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a wider card with supporting text below as a natural lead-in to
                  additional content. This card has even longer content than the first to
                  show that equal height action.
              </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
          </CardDeck>
        </Container>
      </div>
    )
  }
}