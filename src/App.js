import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import Header from './Header';
import {Grid, Row, Col} from 'react-bootstrap';

const locations = {
    "/": "Home",
    "/mark": "Mark Nest",
    "/my_nests":"My Nests",
    "/nests":"Nests",
    "/users":"Users"
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {authenticated:false, params: null, locationName:null};
    }
    onAuthenticate(params) {
        sessionStorage.authHash = params.authHash;
        this.setState({authenticated: true, params: params});
    }
    onLogOut() {
        sessionStorage.authHash = null;
        this.setState({authenticated: false});
    }
    render() {
        if(this.state.authenticated) {
            return (
                <div>
                    <Grid fluid>
                        <Header handleLogOut={() => this.onLogOut()} userName={this.state.params.userName} pageLocation={locations[this.props.location.pathname]}/>
                    </Grid>
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                {this.props.children || <Home params={this.state.params} />}
                            </Col>
                        </Row>
                    </Grid>;
                </div>
            )
        } else {
            return (
                <Login onAuthenticate={(params) => this.onAuthenticate(params)} />
            );
        }
    }
}

export default App;
