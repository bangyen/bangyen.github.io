import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';

import {
    Stun_Step,
    Suffolk,
    WII2D,
    Back,
    names as runNames,
} from './Interpreters';
import {
    Home,
    Error,
    Snake,
    Lights_Out,
    ZSharp,
    Oligopoly,
    Interpreters,
    pages as pageRoutes,
} from './Pages';

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
    const interpreters = [
        { Component: Stun_Step, url: runNames.Stun_Step },
        { Component: Suffolk, url: runNames.Suffolk },
        { Component: WII2D, url: runNames.WII2D },
        { Component: Back, url: runNames.Back },
    ];

    const pages = [
        { Component: Home, url: '/' },
        { Component: Snake, url: pageRoutes.Snake },
        { Component: Lights_Out, url: pageRoutes.Lights_Out },
        { Component: ZSharp, url: pageRoutes.ZSharp },
        { Component: Oligopoly, url: pageRoutes.Oligopoly },
        { Component: Interpreters, url: pageRoutes.Interpreters },
    ];

    return (
        <HashRouter
            basename="/"
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                {interpreters.map(({ Component, url }) =>
                    getRoute(Component, url)
                )}
                {pages.map(({ Component, url }) => getRoute(Component, url))}
                <Route path="*" element={<Error />} />
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
