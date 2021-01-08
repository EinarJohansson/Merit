import React, {useState, useEffect} from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import './Header.css'
import {isMobile} from 'react-device-detect'
import {NavLink} from "react-router-dom"

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
}
  
function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
}
  
export default function Header(props) {
    const { height, width } = useWindowDimensions();
    const active = {
        "background-color": "#542d69",
        "color": "white"
    }
    return (
        <Navbar expand="lg">
            {width < 1000 || isMobile ? 
                (
                    <Navbar.Brand>Merit</Navbar.Brand>
                ) : 
                (
                    <Navbar.Brand style={{'position': 'absolute', 'left': '40px'}}>Merit</Navbar.Brand>
                )
            }
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            {props.authenticated ?
                (
                    <Navbar.Collapse id="responsive-navbar-nav" >
                        <Nav activeKey={props.location.pathname} style={{"justify-content": "unsafe center"}} className="container-fluid">
                            {/* <Nav.Link href='/'>Profil</Nav.Link> */}
                            <NavLink id="profil" exact to="/" activeStyle={active}>Profil</NavLink>                        
                            <NavLink id="utbildningar"strict to="/utbildningar" activeStyle={active}>Utbildningar</NavLink>
                            <NavLink id="statistik" exact to='/statistik' activeStyle={active}>Statistik</NavLink>
                            {width < 1000 ||  isMobile ? 
                                (
                                    <NavLink id="loggaut" to='http://localhost:3000/logout' >Logga ut <FontAwesomeIcon icon={faSignOutAlt}/></NavLink>
                                ) : 
                                (
                                    <NavLink id="loggaut" to='http://localhost:3000/logout' style={{'position': 'absolute', 'right': '0px'}}>Logga ut <FontAwesomeIcon icon={faSignOutAlt}/></NavLink>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>) :
                (
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto"> 
                            <Nav.Link active href="http://localhost:3000/auth">Logga in</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                )
            }
        </Navbar >
    )
}

