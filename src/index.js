import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import { COLORS, TYPOGRAPHY, SPACING, ANIMATIONS } from './config/theme';
import { COMPONENTS } from './config/components';

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
            main: COLORS.neutral[600],
            light: COLORS.neutral[400],
            dark: COLORS.neutral[800],
        },
        background: {
            default: COLORS.surface.background,
            paper: COLORS.surface.elevated,
        },
        text: {
            primary: COLORS.text.primary,
            secondary: COLORS.text.secondary,
        },
        mode: 'dark',
    },
    typography: {
        fontFamily: TYPOGRAPHY.fontFamily.primary,
        h1: {
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontSize: TYPOGRAPHY.fontSize.lg.display,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
        },
        h2: {
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.lg.h1,
            letterSpacing: TYPOGRAPHY.letterSpacing.tight,
            lineHeight: TYPOGRAPHY.lineHeight.snug,
        },
        h3: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.lg.h2,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h4: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.lg.h3,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h5: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.lg.h4,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h6: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.lg.h5,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        body1: {
            fontSize: TYPOGRAPHY.fontSize.md.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.relaxed,
        },
        body2: {
            fontSize: TYPOGRAPHY.fontSize.md.caption,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: TYPOGRAPHY.letterSpacing.wide,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
    },
    components: {
        // Globally enhance Material-UI components with our design system
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: COLORS.surface.background,
                    color: COLORS.text.primary,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.md,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'none',
                    transition: ANIMATIONS.transitions.normal,
                },
                contained: {
                    boxShadow: COLORS.shadows.xs,
                    '&:hover': {
                        boxShadow: COLORS.shadows.sm,
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface.elevated,
                    border: COMPONENTS.borders.subtle,
                    borderRadius: SPACING.borderRadius.lg,
                    boxShadow: COLORS.shadows.sm,
                    transition: ANIMATIONS.transitions.gentle,
                    '&:hover': {
                        boxShadow: COLORS.shadows.md,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.full,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    transition: ANIMATIONS.transitions.fast,
                },
                outlined: {
                    borderColor: COLORS.border.subtle,
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                    },
                },
            },
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
