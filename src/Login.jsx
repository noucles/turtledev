import React from 'react';
import {Grid, Row, Panel, Form, FormGroup, Col, Button, ControlLabel, FormControl} from 'react-bootstrap';

class Login extends React.Component {

    authenticate() {
        this.props.onAuthenticate();
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col md={8} mdOffset={2}>
                        <Panel header="Login" bsStyle="primary">
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} md={4}>
                                        Email
                                    </Col>
                                    <Col md={6}>
                                        <FormControl type="email" placeholder="Email"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} md={4}>
                                        Password
                                    </Col>
                                    <Col md={6}>
                                        <FormControl type="password" placeholder="Password"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col mdOffset={4} md={6}>
                                        <Button bsStyle="primary" onClick={() => this.authenticate()} >
                                            Sign in
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Login;