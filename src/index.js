import ReactDOM from 'react-dom';
import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Back from './Components/Interpreters/Back';
import Suffolk from './Components/Interpreters/Suffolk';
import Snake from './Components/Snake';
import Home from './Components/Home';
import Error from './Components/Error';

import './index.css';
import './Grid.css';

function App() {
    return (
        <Router basename='/'>
            <div>
                <Switch>
                    <Route exact path="/back">
                        <Back />
                    </Route>
                    <Route exact path="/suffolk">
                        <Suffolk />
                    </Route>
                    <Route exact path="/snake">
                        <Snake />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route >
                        <Error />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
