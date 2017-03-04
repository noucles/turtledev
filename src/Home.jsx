import React from 'react';
import {Grid, Row, Col, Panel, Form, FormGroup, Button} from 'react-bootstrap';
import MarkNest from './MarkNest';
import SubmittedNests from './SubmittedNests';
import { browserHistory } from 'react-router';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {location:"Home"};
    }
    navigate(location) {
        this.setState({location: location});
    }
    render() {
        let locationComponent;


        if(this.state.location === 'MarkNest'){
            locationComponent = <MarkNest navigateHome={() => this.navigate("Home")}/>;
        } else if(this.state.location === 'SubmittedNests') {
            locationComponent =  <SubmittedNests navigateHome={() => this.navigate("Home")} />;
        } else {
            locationComponent = (
                <Form horizontal>
                    <FormGroup>
                        <Col sm={6} smOffset={3}>
                            <Button onClick={() => browserHistory.push('/mark')} bsStyle="primary" bsSize="large" block >Mark a Nest</Button>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={6} smOffset={3}>
                            <Button onClick={() => browserHistory.push('/submitted')} bsStyle="primary" bsSize="large" block>Submitted Nests</Button>
                        </Col>
                    </FormGroup>
                </Form>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col sm={8} smOffset={2}>
                        <Panel header={this.state.location} bsStyle="primary">
                            {locationComponent}
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Home;