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
    return <Route key={elem}
            exact path={'/' + elem.name}>
        {React.createElement(elem)}
    </Route>;
}

function App() {
    return <Router basename='/'>
        <div>
            <Switch>
                {Object.keys(run).map(k => {
                    if (k === 'StunStep')
                        return <Route exact path='/stun_step'
                                key={k}>
                            <run.StunStep />
                        </Route>;
                    else if (k !== 'names')
                        return getRoute(run[k]);
                    return null;
                })}
                {Object.keys(page).map(k => {
                    if (k === 'Home')
                        return <Route exact path='/'
                                key={k}>
                            <page.Home />
                        </Route>;
                    else if (k !== 'Error'
                            && k !== 'pages')
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
