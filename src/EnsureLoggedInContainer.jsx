import React from 'react';
import { browserHistory } from 'react-router';
import {Grid, Row, Col} from 'react-bootstrap';
import Header from './Header';

const locations = {
    "/": "Home",
    "/mark": "Mark Nest",
    "/my_nests":"My Nests",
    "/nests":"Nests",
    "/users":"Users"
};

class EnsureLoggedInContainer extends React.Component {
    componentDidMount() {
        if (!sessionStorage.authHash) {
            browserHistory.replace("/login");
        }
    }

    onLogOut() {
        sessionStorage.removeItem('authHash');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('isAdmin');
        browserHistory.replace("/login");
    }

    render() {
        if (sessionStorage.authHash) {
            return (
                <div>
                    <Grid fluid>
                        <Header handleLogOut={() => this.onLogOut()} userName={sessionStorage.username} pageLocation={locations[this.props.location.pathname]}/>
                    </Grid>
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                {this.props.children}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        } else {
            return null
        }
    }
}

export default EnsureLoggedInContainer;