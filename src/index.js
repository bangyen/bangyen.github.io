import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { COLORS, TYPOGRAPHY, ROUTES } from './config/constants';

import { Stun_Step, Suffolk, WII2D, Back } from './Interpreters';
import {
    Home,
    Error,
    Snake,
    Lights_Out,
    ZSharp,
    Oligopoly,
    Interpreters,
} from './Pages';

const darkTheme = createTheme({
    palette: {
        primary: {
            main: COLORS.primary.main,
            light: COLORS.primary.light,
            dark: COLORS.primary.dark,
        },
        secondary: {
            main: COLORS.secondary.main,
            light: COLORS.secondary.light,
            dark: COLORS.secondary.dark,
        },
        background: {
            default: COLORS.background.default,
            paper: COLORS.background.paper,
        },
        text: {
            primary: COLORS.text.primary,
            secondary: COLORS.text.secondary,
        },
        mode: 'dark',
    },
    typography: {
        fontFamily: TYPOGRAPHY.fontFamily,
        h1: {
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: TYPOGRAPHY.fontWeight.semiBold,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: TYPOGRAPHY.fontWeight.semiBold,
        },
        h4: {
            fontWeight: TYPOGRAPHY.fontWeight.semiBold,
        },
        h5: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
        h6: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
        body1: {
            lineHeight: 1.6,
        },
        body2: {
            lineHeight: 1.5,
        },
    },
});

function getRoute(Elem, url) {
    return <Route path={url} element={<Elem />} key={Elem.name} />;
}

function Website() {
    const interpreters = [
        { Component: Stun_Step, url: ROUTES.interpreters.Stun_Step },
        { Component: Suffolk, url: ROUTES.interpreters.Suffolk },
        { Component: WII2D, url: ROUTES.interpreters.WII2D },
        { Component: Back, url: ROUTES.interpreters.Back },
    ];

    const pages = [
        { Component: Home, url: '/' },
        { Component: Snake, url: ROUTES.pages.Snake },
        { Component: Lights_Out, url: ROUTES.pages.Lights_Out },
        { Component: ZSharp, url: ROUTES.pages.ZSharp },
        { Component: Oligopoly, url: ROUTES.pages.Oligopoly },
        { Component: Interpreters, url: ROUTES.pages.Interpreters },
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
