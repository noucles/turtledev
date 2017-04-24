import React from 'react';
import {Button, Modal, ControlLabel, FormControl, Form, FormGroup, Col, ProgressBar, HelpBlock} from 'react-bootstrap';
/* eslint-disable no-undef */
class User extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.user) {
            this.state = {
                firstName: this.props.user.firstName,
                lastName: this.props.user.lastName,
                username: this.props.user.username,
                password: "111111",
                role: this.props.user.role,
                passwordChanged: false,
                confirmPassword: "",
                saving: false,
                passwordMismatch:false,
            };
        } else {
            this.state = {
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                confirmPassword: "",
                role: 5,
                saving: false,
                passwordMismatch:false,
                passwordChanged: false,
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
        this.setState({saving: true});
        let user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            role: this.state.role
        };

        if(this.state.passwordChanged) {
            user.password = this.state.password;
        }

        let existingUser = this.props.user;

        let headers = new Headers();
        let config = {
            mode: "cors"
        };

        if(existingUser) {
            config.method = "PUT";
        } else {
            config.method = "POST";
        }

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        config.body = JSON.stringify(user);
        fetch(process.env.REACT_APP_API_URL + "user/" + (existingUser?existingUser.username:""),config).then((response) => {
            return response.json();
        }).then((data) =>{
            console.log(data);
            this.props.handleSave(user);
            this.closeModal();
        });
    }

    render() {
        const isNewUser = !this.props.user;
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const username = this.state.username;
        const password = this.state.password;
        const isAdmin = parseInt(sessionStorage.role, 10) === 99;
        const isSelf = !isNewUser && sessionStorage.username===username;
        const confirmPassword = this.state.confirmPassword;
        const passwordChanged = this.state.passwordChanged;
        const role = this.state.role;
        const passwordMismatch = !(password===confirmPassword);
        const invalidPasswordLength = password.length===0 || confirmPassword.length===0;
        const invalidPassword = (passwordChanged || isNewUser) && (passwordMismatch || invalidPasswordLength);
        const preventAdminEdit = role===99 && isAdmin && !isSelf;

        return(
            <div>
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
                                    <FormControl type="text" placeholder="First Name" value={firstName} onChange={(e) => this.handleUserInfoChange({'firstName': e.target.value})} disabled={preventAdminEdit} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Last Name
                                </Col>
                                <Col sm={6}>
                                    <FormControl type="text" placeholder="Last Name" value={lastName} onChange={(e) => this.handleUserInfoChange({'lastName': e.target.value})} disabled={preventAdminEdit} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Username
                                </Col>
                                <Col sm={6}>
                                    <FormControl type="text" placeholder="Username" value={username} onChange={(e) => this.handleUserInfoChange({'username':e.target.value})} disabled={!isNewUser}/>
                                </Col>
                            </FormGroup>
                            <FormGroup validationState={invalidPassword?"error":null}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Password
                                </Col>
                                <Col sm={6}>
                                    <FormControl type="password" placeholder="Password" value={password} onChange={(e) => this.handleUserInfoChange({'password':e.target.value.trim(), 'passwordChanged':true})} disabled={preventAdminEdit} />
                                </Col>
                            </FormGroup>
                            <FormGroup validationState={invalidPassword?"error":null}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Confirm Password
                                </Col>
                                <Col sm={6}>
                                    <FormControl type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => this.handleUserInfoChange({'confirmPassword':e.target.value.trim(), 'passwordChanged':true})} disabled={preventAdminEdit} />
                                    <FormControl.Feedback />
                                    {(passwordChanged || isNewUser) && passwordMismatch && <HelpBlock>Passwords do not match</HelpBlock>}
                                    {(passwordChanged || isNewUser) && invalidPasswordLength && <HelpBlock>Password cannot be blank</HelpBlock>}
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Role
                                </Col>
                                <Col sm={6}>
                                    <FormControl componentClass="select" placeholder="Role" value={role} onChange={(e) => this.handleUserInfoChange({'role':parseInt(e.target.value, 10)})} disabled={preventAdminEdit || isSelf}>
                                        <option value="5">Staff</option>
                                        <option value="99">Admin</option>
                                        {role === 100 && <option value="100">Root</option>}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={() => this.save()} disabled={invalidPassword}>
                            Save
                        </Button>
                        <Button onClick={() => this.closeModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.saving} onHide={() => this.closeModal()}>
                    <Modal.Header>
                        <Modal.Title>Saving User...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProgressBar active now={100} />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default User;