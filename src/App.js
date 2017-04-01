import React from 'react';
import './App.css';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {authenticated:false, params: null, locationName:null};
    }

    render() {
        return this.props.children;
    }
}

export default App;
