import ReactDOM from 'react-dom';
import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import * as run from './Components/Interpreters';
import * as page from './Components';

import './index.css';
import './Grid.css';
import './Button.css';

function getRoute(elem) {
    return <Route exact
            path={'/' + elem.name}>
        {React.createElement(elem)}
    </Route>;
}

function App() {
    return <Router basename='/'>
        <div>
            <Switch>
                {Object.keys(run).map(k => {
                    if (k === 'StunStep')
                        return <Route exact path="/stun_step">
                            <run.StunStep />
                        </Route>;
                    return getRoute(run[k]);
                })}
                {Object.keys(page).map(k => {
                    if (k === 'Home')
                        return <Route exact path="/">
                            <page.Home />
                        </Route>;
                    else if (k !== 'Error')
                        return getRoute(page[k]);
                    return null;
                })}
                <Route>
                    <page.Error />
                </Route>
            </Switch>
        </div>
    </Router>;
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
