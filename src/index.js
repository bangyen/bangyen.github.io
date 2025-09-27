import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
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
        primary: {
            main: '#3B82F6', // Blue for main actions and personality
            light: '#60A5FA',
            dark: '#1D4ED8',
        },
        secondary: {
            main: '#6B7280', // Neutral gray for secondary elements
            light: '#9CA3AF',
            dark: '#374151',
        },
        background: {
            default: 'hsl(0, 0%, 0%)', // Base color (0% lightness)
            paper: 'hsl(0, 0%, 5%)', // Cards and surfaces (5% lightness)
        },
        text: {
            primary: 'hsl(0, 0%, 90%)', // High contrast for headings
            secondary: 'hsl(0, 0%, 70%)', // Muted for body text
        },
        mode: 'dark',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
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
