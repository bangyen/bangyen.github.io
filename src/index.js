import ReactDOM from 'react-dom';
import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import * as run from './Components/Interpreters';
import * as page from './Components';

import './index.css';
import './misc.css';
import './Grid.css';
import './Button.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Helvetica',
    },
});


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
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
