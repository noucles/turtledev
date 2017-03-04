import React from 'react';
import {Col, Form, FormGroup, Button, Modal, FormControl, HelpBlock, ControlLabel} from 'react-bootstrap';
import { browserHistory } from 'react-router';
/* eslint-disable no-undef */
class MarkNest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false, location:null, imageFile: null};
    }

    closeModal(){
        this.setState({showModal:false});
    }

    confirmLocation() {
       this.closeModal();
    }

    cancelLocation() {
        this.closeModal();
        this.setState({lat:null, long: null});
    }

    openModal() {
        this.setState({showModal: true});
    }

    handleFile(file){
       this.setState({imageFile:file});
    }

    getUserLocations() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let location = {latitude:position.coords.latitude, longitude:position.coords.longitude};
                this.setState({location:location, showModal: true});
            });
        }
    }

    save() {
        let location = this.state.location;
        let picture = this.state.imageFile;
        let headers = new Headers();

        headers.append('apiKey', 'xwv6pr3iyc7mie16dou03zt7ww00820ei2p8ofzluh4r1ul6qff5jt08arftax60bsfl3xqt289');

        let config = {
            method:"POST",
            mode: "cors"
        };

        if(picture && location) {
            headers.append('Content-Type', 'application/octet-stream');
            config.body = picture;
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "photo",config).then((response) => {
                return response.json();
            }).then((data) =>{
                headers.append('Content-Type', 'application/json');
                config.body = JSON.stringify({location:location, photos:[data.photoId]});
                config.headers = headers;
                fetch(process.env.REACT_APP_API_URL + "nest",config).then(function(response){
                    return response.json();
                }).then(() =>{
                    browserHistory.push('/');
                });
            });
        } else if(location) {
            headers.append('Content-Type', 'application/json');
            config.body = JSON.stringify({location:location});
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "nest",config).then(function(response){
                return response.json();
            }).then(() => {
                browserHistory.push('/');
            });
        }
    }

    componentDidUpdate() {
        if(this.state.showModal) {
            let location = this.state.location;
            let latlon = new google.maps.LatLng(location.latitude, location.longitude);

            let myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            };

            let map = new google.maps.Map(document.getElementById("map"), myOptions);
            new google.maps.Marker({position:latlon,map:map,title:"Nest Location"});
        }
    }

    render() {
        return(
            <Form horizontal>
                <FormGroup>
                    <Col sm={6} smOffset={3}>
                        <Button onClick={() => this.getUserLocations()} bsStyle="primary" bsSize="large" block>Get Current Location</Button>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                        Picture
                    </Col>
                    <Col sm={6}>
                        <FormControl type="file" onChange={(e) => this.handleFile(e.target.files[0])} />
                        <HelpBlock>Upload track pattern picture</HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col sm={6} smOffset={3}>
                        <Button onClick={() => this.save()} bsStyle="primary" bsSize="large" block>Save</Button>
                    </Col>
                </FormGroup>
                <Modal show={this.state.showModal} onHide={() => this.closeModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="embed-responsive embed-responsive-16by9" >
                            <div id="map" className="embed-responsive-item"></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.confirmLocation()}>Confirm</Button>
                        <Button onClick={() => this.cancelLocation()}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        );
    }
}

export default MarkNest;