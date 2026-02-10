import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

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
    return <Route path={url} element={<Elem />} key={Elem.name} />;
}

function Website() {
    return (
        <HashRouter basename="/">
            <Routes>
                {Object.keys(run).map(k => {
                    if (k === 'names') return null;

                    const url = run.names[k]; // eslint-disable-line import/namespace
                    return getRoute(run[k], url); // eslint-disable-line import/namespace
                })}
                {Object.keys(page).map(k => {
                    if (k === 'Error' || k === 'pages') return null;

                    const url = page.pages[k] || '/'; // eslint-disable-line import/namespace
                    return getRoute(page[k], url); // eslint-disable-line import/namespace
                })}
                <Route path="*" element={<page.Error />} />
            </Routes>
        </HashRouter>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Website />
        </ThemeProvider>
    </React.StrictMode>
);
