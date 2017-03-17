import React from 'react';
import {Grid, Row, Panel, Form, FormGroup, Col, Button, ControlLabel, FormControl} from 'react-bootstrap';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName:null, password:null};
    }

    authenticate() {
        let userName = this.state.userName;
        let password = this.state.password;
        let token = userName+":"+password;

        this.props.onAuthenticate({isAdmin:userName === "admin", userName:userName, authHash: btoa(token)});
    }

    handleUserNameChange(e) {
        let userName = e.target.value;

        this.setState({userName: userName});
    }


    handlePasswordChange(e) {
        let password = e.target.value;

        this.setState({password: password});
    }

    handleKeyPress (e) {
        if (e.key === 'Enter') {
            this.authenticate();
        }
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
                                        <FormControl type="text" placeholder="Email" onChange={(e)=> this.handleUserNameChange(e)}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} md={4}>
                                        Password
                                    </Col>
                                    <Col md={6}>
                                        <FormControl type="password" placeholder="Password" onChange={(e)=> this.handlePasswordChange(e)} onKeyPress={(e) => this.handleKeyPress(e)} />
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