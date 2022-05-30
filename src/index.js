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

function getRoute(Elem) {
    return <Route
        exact path={'/' + Elem.name}
        component={Elem}
        key={Elem.name} />;
}

function App() {
    return <Router basename='/'>
        <div>
            <Switch>
                {Object.keys(run).map(k => {
                    if (k === 'StunStep')
                        return <Route exact path='/stun_step'
                            component={run.StunStep}
                            key={k} />;
                    else if (k !== 'names')
                        return getRoute(run[k]);
                    return null;
                })}
                {Object.keys(page).map(k => {
                    if (k === 'Home')
                        return <Route exact path='/'
                            component={page.Home}
                            key={k} />;
                    else if (k !== 'Error'
                            && k !== 'pages')
                        return getRoute(page[k]);
                    return null;
                })}
                <Route component={page.Error} />
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
