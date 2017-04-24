import React from 'react';
import {Col, Form, FormGroup, Button, Modal, FormControl, HelpBlock, ControlLabel, ProgressBar, Glyphicon} from 'react-bootstrap';
import { browserHistory } from 'react-router';
/* eslint-disable no-undef */
class MarkNest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false, nestLocation: null, currentLocation:null, imageFile: null, saving: false, notes: "", family: "general"};
    }

    closeModal(){
        this.setState({showModal:false});
    }

    confirmLocation() {
        let currentLocation = this.state.currentLocation;
        this.setState({nestLocation: currentLocation});
        this.closeModal();

    }

    cancelLocation() {
        this.closeModal();
        this.setState({lat:null, long: null});
    }

    openModal() {
        this.setState({showModal: true});
    }

    handleNote(value) {
        this.setState({notes:value});
    }

    handleFile(file){
       this.setState({imageFile:file});
    }

    handleFamilyChange(family) {
        this.setState({family: family});
    }

    getUserLocations() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let location = {latitude:position.coords.latitude, longitude:position.coords.longitude};
                this.setState({currentLocation:location, showModal: true});
            });
        }
    }

    save() {
        this.setState({saving:true});
        let location = this.state.nestLocation;
        let picture = this.state.imageFile;
        let notes = this.state.notes;
        let family = this.state.family;
        let headers = new Headers();

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);

        let config = {
            method:"POST",
            mode: "cors"
        };

        if(picture) {
            headers.append('Content-Type', 'application/octet-stream');
            config.body = picture;
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "photo",config).then((response) => {
                return response.json();
            }).then((data) =>{
                headers.append('Content-Type', 'application/json');
                config.body = JSON.stringify({location:location, photos:[data.photoId], family:family, notes: notes});
                config.headers = headers;
                fetch(process.env.REACT_APP_API_URL + "nest",config).then(function(response){
                    return response.json();
                }).then(() =>{
                    this.setState({saving:false});
                    browserHistory.push('/');
                });
            });
        } else {
            headers.append('Content-Type', 'application/json');
            config.body = JSON.stringify({location:location, family:family, notes: notes});
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "nest",config).then(function(response){
                return response.json();
            }).then(() => {
                this.setState({saving:false});
                browserHistory.push('/');
            });
        }
    }

    componentDidUpdate() {
        if(this.state.showModal) {
            let location = this.state.currentLocation;
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
        let notes = this.state.notes;
        let family = this.state.family;
        let valid = this.state.imageFile || this.state.nestLocation;

        return(
            <Form horizontal>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                        Get Location
                    </Col>
                    <Col sm={6}>
                        <Button onClick={() => this.getUserLocations()} bsStyle="primary"><Glyphicon glyph="map-marker" /></Button>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                        Picture
                    </Col>
                    <Col sm={6}>
                        <FormControl type="file" onChange={(e) => this.handleFile(e.target.files[0])} accept="image/*"/>
                        <HelpBlock>Upload track pattern picture</HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                        Notes
                    </Col>
                    <Col sm={6}>
                        <FormControl componentClass="textarea" value={notes} onChange={(e) => this.handleNote(e.target.value)} />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>
                        Family
                    </Col>
                    <Col sm={6}>
                        <FormControl componentClass="select" placeholder="Role" value={family} onChange={(e) => this.handleFamilyChange(e.target.value)}>
                            <option value="general">General</option>
                            <option value="miami">Miami</option>
                            <option value="ftlauderdale">Fort Lauderdale</option>
                        </FormControl>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col sm={6} smOffset={4}>
                        <Button onClick={() => this.save()} bsStyle="primary" bsSize="large" block disabled={!valid}>Save</Button>
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
                <Modal show={this.state.saving} onHide={() => this.closeModal()}>
                    <Modal.Header>
                        <Modal.Title>Saving Nest...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProgressBar active now={100} />
                    </Modal.Body>
                </Modal>
            </Form>
        );
    }
}

export default MarkNest;