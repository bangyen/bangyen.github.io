import ReactDOM from 'react-dom';
import React, { useMemo, useState } from 'react';

import {
    HashRouter,
    Switch,
    Route
} from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';
import { ColorModeContext } from './ThemeContext';

import * as run from './Interpreters';
import * as page from './Pages';

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


function App() {
    const [mode, setMode] = useState('dark');
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode(prev => prev === 'light' ? 'dark' : 'light');
        },
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            primary: blueGrey,
            secondary: grey,
            mode,
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
        },
    }), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Website />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
