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

function getRoute(Elem, url) {
    return <Route
        exact path={url}
        component={Elem}
        key={Elem.name} />;
}

function App() {
    return <Router basename='/'>
        <div>
            <Switch>
                {Object.keys(run).map(k => {
                    if (k === 'names')
                        return null;

                    const url = run.names[k];
                    return getRoute(run[k], url);
                })}
                {Object.keys(page).map(k => {
                    if (k === 'Error'
                            || k === 'pages')
                        return null;

                    const url = page.pages[k] || '/';
                    return getRoute(page[k], url);
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