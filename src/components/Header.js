import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
//UncontrolledDropdown, DropdownToggle, DropdownMenu

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.Navtoggle = this.Navtoggle.bind(this);
  }
  Navtoggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <header className="header">
          <Navbar expand="sm">
            <NavbarBrand href="/">Template Application</NavbarBrand>
            <NavbarToggler onClick={this.Navtoggle} />
            {/*
            {(localStorage.getItem('token') && localStorage.getItem('loggedIn') === "true" && !isTokenExpired()) && */}
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink href={"/"}>Templates</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={"/forms"}>Forms</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={"/submit-form"}>Submit Form</NavLink>
                  </NavItem>
                </Nav>
                
                <Nav className="ml-auto" navbar>
                  {/*<UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Admin
                      </DropdownToggle>
                    <DropdownMenu right>
                      <NavLink href="/logout">Logout</NavLink>
                    </DropdownMenu>
                  </UncontrolledDropdown>*/}
                </Nav>
              </Collapse>
          {/* } */}
          </Navbar>
      </header >
    );
  }
}
export default Header;
