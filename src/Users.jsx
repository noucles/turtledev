import React from 'react';
import {ButtonToolbar, Button, Panel, Table, ProgressBar} from 'react-bootstrap';
import User from './User';
/* eslint-disable no-undef */

const roles = {
    "5": "Staff",
    "99": "Admin",
    "100":"Root"
};

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list:null, showModal:false, selectedUser:null, selectedUserIndex: null};
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        this.setState({list: null});
        let headers = new Headers();
        let config = {
            method:"GET",
            mode: "cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "user",config).then((response) => {
            return response.json();
        }).then((data) =>{
            this.setState({list:data});
        });
    }

    showUser(user, index) {
        this.setState({showModal: true, selectedUser:user, selectedUserIndex: index});
    }

    closeUser() {
        this.setState({showModal: false});
    }

    deleteUser(user) {
        this.setState({list: null});
        let headers = new Headers();
        let config = {
            method:"PUT",
            mode:"cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        config.body = JSON.stringify({role: 0});
        fetch(process.env.REACT_APP_API_URL + "user/" + user.username, config).then(() => {
            this.getUsers();
        });
    }

    render() {
        let loggedInUserRole = parseInt(sessionStorage.role, 10);
        let content = null;
        if(this.state.list) {
            content =(
                <Table responsive striped hover>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.list.map((user, i) => {
                            let row = null;
                            if (user.role !== 100 || loggedInUserRole === 100) {
                                row = (<tr key={user.userId} style={{cursor: "pointer"}}>
                                    <td onClick={() => this.showUser(user, i)}>{user.firstName}</td>
                                    <td onClick={() => this.showUser(user, i)}>{user.lastName}</td>
                                    <td onClick={() => this.showUser(user, i)}>{user.username}</td>
                                    <td onClick={() => this.showUser(user, i)}>{roles[user.role]}</td>
                                    <td><Button onClick={(e) => this.deleteUser(user)}
                                                disabled={sessionStorage.username === user.username || loggedInUserRole <= user.role}>Delete</Button>
                                    </td>
                                </tr>);
                            }

                            return row;
                        })
                    }
                    </tbody>
                </Table>
            );
        }
        else {
            content =  <ProgressBar active now={100} />;
        }

        return(
            <Panel>
                <ButtonToolbar>
                    <Button onClick={() => this.showUser()}>Add</Button>
                </ButtonToolbar>
                {content}
                {this.state.showModal &&
                <User user={this.state.selectedUser} closeUser={() => this.closeUser()} handleSave={() => this.getUsers()}/>
                }
            </Panel>
        );
    }
}

export default Users;