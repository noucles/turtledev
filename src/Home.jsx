import React from 'react';
import {Grid, Row, Col, Panel, Form, FormGroup, Button} from 'react-bootstrap';
import { browserHistory } from 'react-router';

class Home extends React.Component {

    render() {
        let locationComponent;
        let isAdmin = this.props.params.isAdmin;
        if (isAdmin){
            locationComponent = (
                <Form horizontal>
                    <Col sm={6}>
                        <FormGroup>
                            <Col sm={12}>
                                <Button onClick={() => browserHistory.push('/mark')} bsStyle="primary" bsSize="large" block >Mark Nest</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={12}>
                                <Button onClick={() => browserHistory.push('/my_nests')} bsStyle="primary" bsSize="large" block>My Nests</Button>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Col sm={12}>
                                <Button onClick={() => browserHistory.push('/nests')} bsStyle="primary" bsSize="large" block >Nests</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={12}>
                                <Button onClick={() => browserHistory.push('/users')} bsStyle="primary" bsSize="large" block>Users</Button>
                            </Col>
                        </FormGroup>
                    </Col>
                </Form>
            );
        } else {
            locationComponent = (
                <Form horizontal>
                    <FormGroup>
                        <Col sm={6} smOffset={3}>
                            <Button onClick={() => browserHistory.push('/mark')} bsStyle="primary" bsSize="large" block >Mark Nest</Button>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={6} smOffset={3}>
                            <Button onClick={() => browserHistory.push('/my_nests')} bsStyle="primary" bsSize="large" block>My Nests</Button>
                        </Col>
                    </FormGroup>
                </Form>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col sm={8} smOffset={2}>
                        <Panel header="Home" bsStyle="primary">
                            {locationComponent}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Home;