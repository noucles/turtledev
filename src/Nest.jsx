import React from 'react';
import {Button, Modal, Thumbnail, ControlLabel, FormControl, Form, FormGroup, Col, ProgressBar} from 'react-bootstrap';
/* eslint-disable no-undef */
class Nest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            longitude: this.props.nest.location.longitude,
            latitude: this.props.nest.location.latitude,
            notes: this.props.nest.notes,
            family: this.props.nest.family,
            deletedImages: [],
            addedImages: [],
            photos: this.props.nest.photos,
            newIdCounter: 1,
            saving: false
        };
    }

    handleFile(file) {
        let addedImages = this.state.addedImages;
        let photos = this.state.photos;
        let newIdCounter = this.state.newIdCounter;

        let reader = new FileReader();

        reader.onload = (e) => {
            photos.push({tempId: "new" + newIdCounter, raw:e.target.result});
            addedImages.push(file);
            newIdCounter++;
            this.setState({addedImages: addedImages, photos: photos, newIdCounter: newIdCounter});
        };
        reader.readAsDataURL(file);

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

    changeNotesHandler(e) {
        let notes = e.target.value;
        this.setState({notes: notes});
    }

    changeFamilyHandler(e) {
        let family = e.target.value;
        this.setState({family:family});
    }

    deleteImage(photo) {
        let deletedImages = this.state.deletedImages;
        let photos = this.state.photos;
        photos = photos.filter(function(photoItem){
            return photoItem !== photo;
        });
        deletedImages.push(photo);


        this.setState({deletedImages: deletedImages, photos: photos});
    }

    deleteImages() {
        let photos = this.state.deletedImages;
        let headers = new Headers();
        let config = {
            method:"DELETE",
            mode: "cors"
        };

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);
        config.headers = headers;

        if(photos.length) {
            return Promise.all(photos.map(function (photo) {
                return fetch(process.env.REACT_APP_API_URL + "photo/" + photo, config).then(function(response){
                    return response.json();
                });
            }));
        } else {
            return Promise.resolve();
        }
    }

    saveImages() {
        let photos = this.state.addedImages;
        let headers = new Headers();
        let config = {
            method: "POST",
            mode: "cors"
        };

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);
        headers.append('Content-Type', 'application/octet-stream');
        config.headers = headers;

        if (photos.length) {

            return Promise.all(photos.map(function(photo){
                config.body = photo;
                return fetch(process.env.REACT_APP_API_URL + "photo",config).then((response) => {
                    return response.json();
                });
            }));
        } else {
            return Promise.resolve([]);
        }
    }

    modifyImages() {
        return Promise.resolve(this.deleteImages().then((response) => this.saveImages()));
    }

    save() {

        let location = {latitude:this.state.latitude, longitude: this.state.longitude};
        let headers = new Headers();
        let notes = this.state.notes;
        let family = this.state.family;

        headers.append('Authorization', 'Basic ' + sessionStorage.authHash);

        let config = {
            method:"PUT",
            mode: "cors"
        };

        this.setState({saving:true});
        this.modifyImages().then((photos) => {

            photos = photos.map((photo) => photo.photoId);

            if(location) {
                headers.append('Content-Type', 'application/json');
                config.body = JSON.stringify({location:location, notes: notes, family: family, photos: photos});
                config.headers = headers;
                fetch(process.env.REACT_APP_API_URL + "nest/" + this.props.nest.nestId, config).then(function(response){
                    return response.json();
                }).then(() => {
                    this.props.closeNest();
                    this.setState({saving:false});
                });
            }
        });
    }

    render() {
        let nestId = this.props.nest.nestId;
        let notes = this.state.notes;
        let family = this.state.family;
        const photoList = this.state.photos.map((photo) => {
            let id;
            let url;
            let newPhoto = false;
            if(photo.tempId) {
                id = photo.tempId?photo.tempId:photo;
                url = photo.raw;
                newPhoto = true;
            } else {
                id = photo;
                url = process.env.REACT_APP_API_URL + "photo/" + id;
            }
           return(
                <Col xs={6} md={3} key={id}>
                    <Thumbnail src={url}>
                        {(newPhoto && <span>New Photo</span>) || <Button bsStyle="danger" onClick={(e) => this.deleteImage(id)}>Delete</Button>}
                    </Thumbnail>
                </Col>
           )
            }
        );

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
                            <Col componentClass={ControlLabel} sm={4}>
                                Notes
                            </Col>
                            <Col sm={6}>
                                <FormControl componentClass="textarea" placeholder="Notes" value={notes} onChange={(e) => this.changeNotesHandler(e)} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
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
                                Picture
                            </Col>
                            <Col sm={6}>
                                <FormControl type="file" onChange={(e) => this.handleFile(e.target.files[0])} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}  smOffset={4}>
                                Track Patterns
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {photoList}
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.save()} >
                        Save
                    </Button>
                    <Button onClick={() => this.closeModal()}>Close</Button>
                </Modal.Footer>
                <Modal show={this.state.saving}>
                    <Modal.Header>
                        <Modal.Title>Saving Nest...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProgressBar active now={100} />
                    </Modal.Body>
                </Modal>
            </Modal>
        );
    }
}

export default Nest;