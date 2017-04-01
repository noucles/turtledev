import React from 'react';
import {ButtonToolbar, Button, Panel, Table} from 'react-bootstrap';
import User from './User';
/* eslint-disable no-undef */

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list:null, showModal:false, selectedUser:null, selectedUserIndex: null};
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        /*
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
        });*/

        let fakeUsers = [
            {userId:1, username:"dude", firstName:"Dude", lastName:"Maximus", role: 5},
            {userId:2, username:"dude2", firstName:"Dude2", lastName:"Maximus", role: 5},
            {userId:3, username:"dude3", firstName:"Dude3", lastName:"Maximus", role: 99}
        ];

        this.setState({list:fakeUsers});
    }

    showUser(user, index) {
        this.setState({showModal: true, selectedUser:user, selectedUserIndex: index});
    }

    closeUser() {
        this.setState({showModal: false});
    }

    saveUser(user) {
        let existingUser = this.state.selectedUser;

        let headers = new Headers();
        let config = {
            mode: "cors"
        };

        if(existingUser) {
            config.method = "PUT";
        } else {
            config.method = "POST";
        }

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        config.body = JSON.stringify(user);
        fetch(process.env.REACT_APP_API_URL + "User/" + (existingUser?existingUser.username:""),config).then((response) => {
            return response.json();
        }).then((data) =>{
         console.log(data);
        });
    }

    deleteUser(index) {
        let list = this.state.list;
        list.splice(index, 1);

        this.setState({list: list});

        /*
        let headers = new Headers();
        let config = {
            method:"DELETE",
            mode:"cors"
        };

        headers.append('Authorization', "Basic " + sessionStorage.authHash);
        config.headers = headers;
        fetch(process.env.REACT_APP_API_URL + "users/" + user.userId, config).then(() => {
            this.getUsers();
        });*/
    }

    render() {
        if(this.state.list) {
            const list = this.state.list.map((user, i) =>
                <tr key={user.userId} style={{cursor: "pointer"}}>
                    <td onClick={() => this.showUser(user, i)}>{user.firstName}</td>
                    <td onClick={() => this.showUser(user, i)}>{user.lastName}</td>
                    <td onClick={() => this.showUser(user, i)}>{user.username}</td>
                    <td onClick={() => this.showUser(user, i)}>{user.role===99?"admin":"staff"}</td>
                    <td><Button onClick={(e) => this.deleteUser(i)}>Delete</Button></td>
                </tr>
            );

            return(
                <Panel>
                    <ButtonToolbar>
                        <Button onClick={() => this.showUser()}>Add</Button>
                    </ButtonToolbar>
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
                            {list}
                        </tbody>
                    </Table>
                    {this.state.showModal &&
                    <User user={this.state.selectedUser} closeUser={() => this.closeUser()} handleSave={(user) => this.saveUser(user)}/>
                    }
                </Panel>
            );
        }
        else {
            return <div>Loading....</div>
        }
    }
}

export default Users;