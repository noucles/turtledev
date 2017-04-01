import React from 'react';
import {Grid, Row, Panel, Form, FormGroup, Col, Button, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {browserHistory} from 'react-router'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName:null, password:null, authFailed: false};
    }

    componentDidMount() {
        if (sessionStorage.authHash) {
            browserHistory.replace("/");
        }
    }

    authenticate() {
        let userName = this.state.userName;
        let password = this.state.password;
        let token = userName+":"+password;
        let authHash = btoa(token);

        let headers = new Headers();
        let config = {
            method:"GET",
            mode:"cors"
        };

        headers.append('Authorization', "Basic " + authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nests/authenticate",config).then((response) => {
            return response.json();
        }).then((data) =>{
            if(data.nests) {
                sessionStorage.authHash = authHash;
                sessionStorage.username = userName;
                sessionStorage.isAdmin = userName ==="admin";
                browserHistory.replace("/");
            } else {
                this.setState({authFailed:true});
            }
        });
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
                                <FormGroup validationState={this.state.authFailed?"error":null}>
                                    <Col componentClass={ControlLabel} md={4}>
                                        Email
                                    </Col>
                                    <Col md={6}>
                                        <FormControl type="text" placeholder="Username" onChange={(e)=> this.handleUserNameChange(e)}/>
                                        <FormControl.Feedback />
                                    </Col>
                                </FormGroup>
                                <FormGroup validationState={this.state.authFailed?"error":null}>
                                    <Col componentClass={ControlLabel} md={4}>
                                        Password
                                    </Col>
                                    <Col md={6}>
                                        <FormControl type="password" placeholder="Password" onChange={(e)=> this.handlePasswordChange(e)} onKeyPress={(e) => this.handleKeyPress(e)} />
                                        <FormControl.Feedback />
                                        {this.state.authFailed && <HelpBlock>Username or Password is incorrect</HelpBlock>}
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