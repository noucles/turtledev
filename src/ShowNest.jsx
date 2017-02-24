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
        }

        let map = new google.maps.Map(document.getElementById("map"), myOptions);
        new google.maps.Marker({position: latlon, map: map, title: "Nest Location"});

        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        }

        headers.append('apiKey', 'xwv6pr3iyc7mie16dou03zt7ww00820ei2p8ofzluh4r1ul6qff5jt08arftax60bsfl3xqt289');
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nest/" + this.props.nest.nestId, config).then((response) => {
            return response.json();
        }).then((data) =>{
            if(data.photos.length) {
                let imageUrl = process.env.REACT_APP_API_URL + "photo/" + data.photos[0];
                this.setState({imageUrl:imageUrl});
            }
        });
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
                    {this.state.imageUrl &&
                        <Image src={this.state.imageUrl} responsive/>
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