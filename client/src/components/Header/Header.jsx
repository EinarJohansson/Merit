import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'

export default function Header(props) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Merit</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {props.authenticated ?
                (
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href='/utbildningar'>Utbildningar</Nav.Link>
                            <Nav.Link href='/statistik'>Statistik</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link href='http://localhost:3000/logout'><FontAwesomeIcon icon={faDoorOpen} className="text-danger"/></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>) :
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
