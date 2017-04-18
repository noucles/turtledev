import React from 'react';
import {ListGroup, ListGroupItem, Button, Panel, ProgressBar, FormGroup, FormControl, Form, Col, ControlLabel} from 'react-bootstrap';
import Nest from './Nest';
/* eslint-disable no-undef */

class SubmittedNests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list:null,
            showModal:false,
            selectedNest:null,
            family: "general",
            exporting: false
        };
    }

    componentDidMount() {
        this.getNests();
    }

    getNests() {
        let family = this.state.family;
        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nests/" + family,config).then((response) => {
            return response.json();
        }).then((data) =>{
            this.setState({list:data.nests});
        });
    }

    changeFamilyHandler(e) {
        let family = e.target.value;
        this.setState({family: family});
    }

    showNest(nest) {
        this.setState({showModal: true, selectedNest:nest});
    }

    closeNest() {
        this.setState({showModal: false});
        this.getNests();
    }

    exportNests() {
        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "csv",config).then((response) => {
            return response.blob();
        }).then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = "export.csv";
            a.click();
        });
    }

    deleteNest(nest) {
        let headers = new Headers();
        let config = {
            method:"DELETE",
            mode:"cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nest/" + nest.nestId, config).then(() => {
            this.getNests();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.family !== prevState.family) {
            this.getNests();
        }
    }

    render() {
        let content;
        let family = this.state.family;
        if(this.state.list) {
            const list = this.state.list.map((nest) =>
                <ListGroupItem onClick={() => this.showNest(nest)} key={nest.nestId}>
                    {nest.nestId}
                </ListGroupItem>
            );

            content = (
                <div>
                    <Form inline>
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
                        {' '}
                        <Button onClick={() => this.exportNests()}>Export</Button>
                    </Form>
                    <ListGroup>
                        {list}
                    </ListGroup>
                    {this.state.showModal &&
                    <Nest nest={this.state.selectedNest} closeNest={() => this.closeNest()}/>
                    }
                </div>
            );
        }
        else {
            content = <ProgressBar active now={100} />;
        }

        return (
            <Panel>
                {content}
            </Panel>
        );
    }
}

export default SubmittedNests;