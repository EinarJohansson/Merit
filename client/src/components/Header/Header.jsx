import React, { Component } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'

export default class Header extends Component {
    render() {
        const { authenticated } = this.props
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Merit</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {authenticated ?
                    (
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href='/utbildningar'>Utbildningar</Nav.Link>
                                <Nav.Link href='http://localhost:3000/logout'>Logga ut</Nav.Link>
                            </Nav>
                            <Form inline>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            </Form>
                        </Navbar.Collapse> ) :
                    (
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="http://localhost:3000/auth">Logga in</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    )
                }

            </Navbar >
        )
    }
}