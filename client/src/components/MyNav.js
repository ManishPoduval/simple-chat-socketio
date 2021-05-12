import React from  'react'
import {Navbar, Nav} from  'react-bootstrap'
import {Link} from  'react-router-dom'

function MyNav(props) {
  const { user, onLogout } = props
  return (
    <Navbar  bg="light"  expand="lg">
      <Navbar.Toggle  aria-controls="basic-navbar-nav"  />
      <Navbar.Collapse  id="basic-navbar-nav">
        <Nav  className="mr-auto">
          <Link to="/">Users</Link>
          {
            user ? (
              <button onClick={onLogout} >Logout</button>
            ) : (
              <>
                <Link  style={{marginLeft: '10px'}}  to="/signin">SignIn</Link>
                <Link  style={{marginLeft: '10px'}}  to="/signup">SignUp</Link>
              </>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
}
export default MyNav