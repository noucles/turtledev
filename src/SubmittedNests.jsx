import React from 'react';
import ShowNest from './ShowNest';
import {FormGroup, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
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
        }

        headers.append('apiKey', 'xwv6pr3iyc7mie16dou03zt7ww00820ei2p8ofzluh4r1ul6qff5jt08arftax60bsfl3xqt289');
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nests/0",config).then((response) => {
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
    }

    deleteNest(nest) {
        let headers = new Headers();
        let config = {
            method:"DELETE",
            mode:"cors"
        }

        headers.append('apiKey', 'xwv6pr3iyc7mie16dou03zt7ww00820ei2p8ofzluh4r1ul6qff5jt08arftax60bsfl3xqt289');
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Nest/" + nest.nestId, config).then((response) => {
           this.getNests();
        });
    }

    render() {
        if(this.state.list) {
            const list = this.state.list.map((nest) =>
                <ListGroupItem href="#" onClick={(event) => this.showNest(event, nest)} key={nest.nestId}>
                    {nest.nestId}
                    <Button bsSize="xsmall" bsStyle="danger" className={"pull-right"} onClick={()=> this.deleteNest(nest)}>Delete</Button>
                </ListGroupItem>
            );

            return(
                <div>
                    <ListGroup>
                        {list}
                    </ListGroup>
                    <FormGroup>
                        <Button onClick={() => this.props.navigateHome()}>Back</Button>
                    </FormGroup>
                    {this.state.showModal &&
                        <ShowNest nest={this.state.selectedNest} closeShowNest={() => this.closeShowNest()}/>
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