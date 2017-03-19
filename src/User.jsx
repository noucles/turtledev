import React from 'react';
import {Button, Modal, ControlLabel, FormControl, Form, FormGroup, Col} from 'react-bootstrap';
/* eslint-disable no-undef */
class User extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.user) {
            this.state = {
                firstName: this.props.user.firstName,
                lastName: this.props.user.lastName,
                username: this.props.user.username,
                password: ""
            };
        } else {
            this.state = {
                firstName: "",
                lastName: "",
                username: "",
                password: ""
            };
        }
    }

    closeModal(){
        this.props.closeUser();
    }

    handleUserInfoChange(userInfo) {
        this.setState(userInfo);
    }

    save() {
        let user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            password: this.state.password
        };

        this.props.handleSave(user);
        this.closeModal();
/*
        let location = {latitude:this.state.latitude, longitude: this.state.longitude};
        let headers = new Headers();

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);

        let config = {
            method:"PUT",
            mode: "cors"
        };

        if(location) {
            headers.append('Content-Type', 'application/json');
            config.body = JSON.stringify({location:location});
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "nest/" + this.props.nest.nestId, config).then(function(response){
                return response.json();
            }).then(() => {
                this.props.closeUser();
            });
        }*/
    }

    render() {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const username = this.state.username;
        const password = this.state.password;

        return(
            <Modal show={true} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Nest Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                First Name
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="First Name" value={firstName} onChange={(e) => this.handleUserInfoChange({'firstName': e.target.value})} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Last Name
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="Last Name" value={lastName} onChange={(e) => this.handleUserInfoChange({'lastName': e.target.value})} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Username
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="Username" value={username} onChange={(e) => this.handleUserInfoChange({'username':e.target.value})} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Password
                            </Col>
                            <Col sm={6}>
                                <FormControl type="password" placeholder="Password" value={password} onChange={(e) => this.handleUserInfoChange({'password':e.target.value})} />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.save()} >
                        Save
                    </Button>
                    <Button onClick={() => this.closeModal()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default User;