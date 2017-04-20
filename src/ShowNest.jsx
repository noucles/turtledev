import React from 'react';
import {Button, Modal, Form, FormGroup, Col, Thumbnail, ControlLabel, FormControl} from 'react-bootstrap';
/* eslint-disable no-undef */
class ShowNest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            family: this.props.nest.family,
            notes: this.props.nest.notes
        };
    }

    closeModal(){
        this.props.closeShowNest();
    }

    changeNotesHandler(e) {
        let notes = e.target.value;
        this.setState({notes: notes});
    }

    changeFamilyHandler(e) {
        let family = e.target.value;
        this.setState({family:family});
    }

    componentDidMount() {
        let latlon = new google.maps.LatLng(this.props.nest.location.latitude, this.props.nest.location.longitude);

        let myOptions = {
            center: latlon, zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
        };

        let map = new google.maps.Map(document.getElementById("map"), myOptions);
        new google.maps.Marker({position: latlon, map: map, title: "Nest Location"});
    }

    save() {
        let headers = new Headers();
        let notes = this.state.notes;
        let family = this.state.family;

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);

        let config = {
            method:"PUT",
            mode: "cors"
        };

        if(location) {
            headers.append('Content-Type', 'application/json');
            config.body = JSON.stringify({notes: notes, family: family});
            config.headers = headers;
            fetch(process.env.REACT_APP_API_URL + "nest/" + this.props.nest.nestId, config).then(function(response){
                return response.json();
            }).then(() => {
                this.closeModal();
            });
        }
    }

    render() {
        let family = this.state.family;
        let notes = this.state.notes;
        return(
            <Modal show={true} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Nest Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}  smOffset={1}>
                                Location
                            </Col>
                            <Col sm={8}>
                                <div className="embed-responsive embed-responsive-16by9" >
                                    <div id="map" className="embed-responsive-item"></div>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}  smOffset={1}>
                                Notes
                            </Col>
                            <Col sm={8}>
                                <FormControl componentClass="textarea" placeholder="Notes" value={notes} onChange={(e) => this.changeNotesHandler(e)} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2} smOffset={1}>
                                Family
                            </Col>
                            <Col sm={6}>
                                <FormControl componentClass="select" placeholder="Role" value={family} onChange={(e) => this.changeFamilyHandler(e)}>
                                    <option value="general">General</option>
                                    <option value="miami">Miami</option>
                                    <option value="ftlauderdale">Fort Lauderdale</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}  smOffset={1}>
                                Track Patterns
                            </Col>
                            <Col sm={8}>
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

export default ShowNest;