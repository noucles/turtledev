import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Nest from './Nest';
/* eslint-disable no-undef */

class SubmittedNests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list:null, showModal:false, selectedNest:null};
    }

    componentDidMount() {
        this.getNests();
    }

    getNests() {
        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nests/default",config).then((response) => {
            return response.json();
        }).then((data) =>{
            this.setState({list:data.nests});
        });
    }

    showNest(nest) {
        this.setState({showModal: true, selectedNest:nest});
    }

    closeNest() {
        this.setState({showModal: false});
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

    render() {
        if(this.state.list) {
            const list = this.state.list.map((nest) =>
                <ListGroupItem onClick={() => this.showNest(nest)} key={nest.nestId}>
                    {nest.nestId}
                </ListGroupItem>
            );

            return(
                <div>
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
            return <div>Loading....</div>
        }
    }
}

export default SubmittedNests;