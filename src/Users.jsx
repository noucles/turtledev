import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import User from './User';
/* eslint-disable no-undef */

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list:null, showModal:false, selectedUser:null};
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "Users/0",config).then((response) => {
            return response.json();
        }).then((data) =>{
            this.setState({list:data.nests});
        });
    }

    showUser(nest) {
        this.setState({showModal: true, selectedUser:nest});
    }

    closeUser() {
        this.setState({showModal: false});
    }

    deleteUser(user) {
        let headers = new Headers();
        let config = {
            method:"DELETE",
            mode:"cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "users/" + user.userId, config).then(() => {
            this.getUsers();
        });
    }

    render() {
        if(this.state.list) {
            const list = this.state.list.map((user) =>
                <ListGroupItem onClick={() => this.showUser(user)} key={user.userId}>
                    {user.username}
                </ListGroupItem>
            );

            return(
                <div>
                    <ListGroup>
                        {list}
                    </ListGroup>
                    {this.state.showModal &&
                    <User user={this.state.selectedUser} closeUser={() => this.closeUser()}/>
                    }
                </div>
            );
        }
        else {
            return <div>Loading....</div>
        }
    }
}

export default Users;