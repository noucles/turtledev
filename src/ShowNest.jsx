import React from 'react';
import {Button, Modal, Image} from 'react-bootstrap';
/* eslint-disable no-undef */
class ShowNest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    closeModal(){
        this.props.closeShowNest();
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

    render() {
        return(
            <Modal show={true} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Nest Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="embed-responsive embed-responsive-16by9" >
                        <div id="map" className="embed-responsive-item"></div>
                    </div>
                    {this.props.nest.photos[0] &&
                        <Image src={process.env.REACT_APP_API_URL + "photo/" + this.props.nest.photos[0]} responsive/>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.closeModal()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ShowNest;