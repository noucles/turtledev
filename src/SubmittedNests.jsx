import React from 'react';
import ShowNest from './ShowNest';
import {Button, ListGroup, ListGroupItem, ProgressBar} from 'react-bootstrap';
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
            method:"POST",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        config.body = JSON.stringify({username:sessionStorage.username});
        fetch(process.env.REACT_APP_API_URL + "Nests/",config).then((response) => {
            return response.json();
        }).then((data) =>{
            this.setState({list:data.nests});
        });
    }

    showNest(event, nest) {
        if(event.target.tagName !== "BUTTON"){
            this.setState({showModal:true,selectedNest:nest});
        }
    }

    closeShowNest() {
        this.setState({showModal: false});
        this.getNests();
    }

    deleteNest(nest) {
        this.setState({list: null});
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
        let content = null;
        if(this.state.list) {
            content = this.state.list.map((nest) =>
                <ListGroupItem href="#" onClick={(event) => this.showNest(event, nest)} key={nest.nestId}>
                    {nest.nestId}
                    <Button bsSize="xsmall" bsStyle="danger" className={"pull-right"} onClick={()=> this.deleteNest(nest)}>Delete</Button>
                </ListGroupItem>
            );
        }
        else {
            content =  <ProgressBar active now={100} />;
        }

        return(
            <div>
                <ListGroup>
                    {content}
                </ListGroup>
                {this.state.showModal &&
                <ShowNest nest={this.state.selectedNest} closeShowNest={() => this.closeShowNest()}/>
                }
            </div>
        );
    }
}

export default SubmittedNests;