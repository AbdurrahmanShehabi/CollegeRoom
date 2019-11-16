import React, { Component } from 'react'
import {Navbar} from 'react-bootstrap'
import {Nav,Button} from 'react-bootstrap'

class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="container">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">College Room</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                              <Nav.Link href="login">Login</Nav.Link>
                        </Nav>
                    <Button href="newpost" variant="info">New Post</Button>

                    </Navbar.Collapse>
                    </Navbar>
            </div>
         );
    }
}
 
export default NavBar;