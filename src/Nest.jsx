import React from 'react';
import {Button, Modal, Thumbnail, ControlLabel, FormControl, Form, FormGroup, Col} from 'react-bootstrap';
/* eslint-disable no-undef */
class Nest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {longitude: this.props.nest.location.longitude, latitude: this.props.nest.location.latitude};
    }

    closeModal(){
        this.props.closeNest();
    }

    changeLatitudeHandler(e) {
        let latitude = e.target.value;

        this.setState({latitude: latitude});
    }

    changeLongitudeHandler(e) {
        let longitude = e.target.value;

        this.setState({longitude: longitude});
    }

    save() {

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
                this.props.closeNest();
            });
        }
    }

    render() {
        let nestId = this.props.nest.nestId;

        return(
            <Modal show={true} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Nest Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                NestID
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="NestID" value={nestId} disabled/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}  smOffset={4}>
                                GPS Coordinates
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Latitude
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="Latitude" value={this.state.latitude} onChange={(e) => this.changeLatitudeHandler(e)} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Longitude
                            </Col>
                            <Col sm={6}>
                                <FormControl type="text" placeholder="Longitude" value={this.state.longitude} onChange={(e) => this.changeLongitudeHandler(e)} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Track Patterns
                            </Col>
                            <Col sm={6}>
                                {this.props.nest.photos.length &&
                                <Thumbnail src={process.env.REACT_APP_API_URL + "photo/" + this.props.nest.photos[0]} />
                                }
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

export default Nest;