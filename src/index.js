import ReactDOM from 'react-dom';
import React from 'react';

import {
    HashRouter,
    Switch,
    Route
} from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';

import * as run from './Interpreters';
import * as page from './Pages';

const darkTheme = createTheme({
    palette: {
        primary: blueGrey,
        secondary: grey,
        mode: 'dark',
    },
    typography: {
        fontFamily: 'monospace',
    },
});


function getRoute(Elem, url) {
    return <Route
        exact path={url}
        component={Elem}
        key={Elem.name} />;
}


function Website() {
    return (
        <HashRouter basename='/'>
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
        </HashRouter>
    );
}


ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Website />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
