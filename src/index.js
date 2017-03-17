import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Router, Route, browserHistory} from 'react-router';
import SubmittedNests from './SubmittedNests';
import Nests from './Nests';
import MarkNest from './MarkNest';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/mark" component={MarkNest}>
            </Route>
            <Route path="/my_nests" component={SubmittedNests}>
            </Route>
            <Route path="/nests" component={Nests}>
            </Route>
            <Route path="/users" component={SubmittedNests}>
            </Route>
        </Route>
    </Router>,
  document.getElementById('root')
);
