import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import {Grid, Row, Col} from 'react-bootstrap';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {authenticated:false};
    }
    onAuthenticate() {
        this.setState({authenticated: true});
    }
    render() {
        if(this.state.authenticated) {
            return (<Grid fluid>
                <Row>
                    <Col md={12}>
                        <Home />
                    </Col>
                </Row>
            </Grid>);
        } else {
            return (
                <Login onAuthenticate={() => this.onAuthenticate()} />
            );
        }
    }
}

export default App;
