import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Router, Route, browserHistory, IndexRoute} from 'react-router';
import SubmittedNests from './SubmittedNests';
import Nests from './Nests';
import MarkNest from './MarkNest';
import Users from './Users';
import Login from './Login';
import Home from './Home';
import EnsureLoggedInContainer from './EnsureLoggedInContainer';

function requireAdmin(nextState, replace) {
    if (!(sessionStorage.isAdmin === "true")) {
        replace({
            pathname: '/'
        })
    }
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/login" component={Login} />
            <Route component={EnsureLoggedInContainer} >
                <IndexRoute component={Home}/>
                <Route path="/mark" component={MarkNest} />
                <Route path="/my_nests" component={SubmittedNests} />
                <Route path="/nests" component={Nests} onEnter={requireAdmin}/>
                <Route path="/users" component={Users} onEnter={requireAdmin}/>
            </Route>
        </Route>
    </Router>,
  document.getElementById('root')
);
