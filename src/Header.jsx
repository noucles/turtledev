import React from 'react';
import './App.css';
import {Navbar, NavItem, Nav} from 'react-bootstrap';

class Header extends React.Component {

    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">TurtleDev</a>
                    </Navbar.Brand>
                    <Navbar.Text>
                        Hello, {this.props.userName}
                    </Navbar.Text >
                    <Navbar.Text>
                        {this.props.pageLocation}
                    </Navbar.Text >
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem href="#" onClick={this.props.handleLogOut}>
                            Log Out
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;
