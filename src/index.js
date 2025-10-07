import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import { COLORS, TYPOGRAPHY, SPACING, ANIMATIONS } from './config/theme';

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
            main: COLORS.text.muted,
            light: COLORS.text.secondary,
            dark: COLORS.border.subtle,
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
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.display,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h2: {
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.h1,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h3: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h4: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h5: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        h6: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.body,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
        },
        body1: {
            fontSize: TYPOGRAPHY.fontSize.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            lineHeight: 1.5,
        },
        body2: {
            fontSize: TYPOGRAPHY.fontSize.caption,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: '0.025em',
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
            variants: [
                {
                    props: { variant: 'primary' },
                    style: {
                        backgroundColor: COLORS.primary.main,
                        color: COLORS.text.primary,
                        border: 'none',
                        borderRadius: SPACING.borderRadius.md,
                        padding: '12px 24px',
                        minHeight: '44px',
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        transition: ANIMATIONS.transition,
                        boxShadow: COLORS.shadows.xs,
                        '&:hover': {
                            backgroundColor: COLORS.primary.dark,
                            boxShadow: COLORS.shadows.sm,
                            transform: 'translateY(-1px)',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
                        },
                    },
                },
                {
                    props: { variant: 'secondary' },
                    style: {
                        backgroundColor: 'transparent',
                        color: COLORS.text.secondary,
                        border: `1px solid ${COLORS.border.primary}`,
                        borderRadius: SPACING.borderRadius.md,
                        padding: '12px 24px',
                        minHeight: '44px',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        transition: ANIMATIONS.transition,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.hover,
                            borderColor: COLORS.primary.main,
                            transform: 'translateY(-1px)',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
                        },
                    },
                },
                {
                    props: { variant: 'ghost' },
                    style: {
                        backgroundColor: 'transparent',
                        color: COLORS.text.secondary,
                        border: 'none',
                        borderRadius: SPACING.borderRadius.md,
                        padding: '12px 24px',
                        minHeight: '44px',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        transition: ANIMATIONS.fast,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.hover,
                            color: COLORS.text.primary,
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            variants: [
                {
                    props: { variant: 'elevated' },
                    style: {
                        backgroundColor: COLORS.surface.elevated,
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: SPACING.borderRadius.lg,
                        padding: '24px',
                        transition: ANIMATIONS.transition,
                        boxShadow: COLORS.shadows.sm,
                    },
                },
                {
                    props: { variant: 'glassmorphism' },
                    style: {
                        backgroundColor: COLORS.surface.glass,
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: SPACING.borderRadius.lg,
                        padding: '24px',
                        transition: ANIMATIONS.transition,
                        boxShadow: COLORS.shadows.sm,
                    },
                },
                {
                    props: { variant: 'interactive' },
                    style: {
                        backgroundColor: COLORS.surface.elevated,
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: SPACING.borderRadius.lg,
                        padding: '24px',
                        transition: ANIMATIONS.transition,
                        boxShadow: COLORS.shadows.sm,
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-2px) scale(1.01)',
                            boxShadow: COLORS.shadows.sm,
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface.elevated,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.lg,
                    boxShadow: COLORS.shadows.sm,
                    transition: ANIMATIONS.transition,
                    '&:hover': {
                        boxShadow: COLORS.shadows.sm,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.full,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    transition: ANIMATIONS.fast,
                },
                outlined: {
                    borderColor: COLORS.border.subtle,
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backdropFilter: 'blur(24px) saturate(180%)',
                    backgroundColor: COLORS.surface.glass,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.lg,
                    boxShadow: COLORS.shadows.sm,
                    padding: '8px 8px',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.md,
                    margin: '0.25rem 0.25rem',
                    transition: ANIMATIONS.fast,
                    '&:hover': {
                        transform: 'scale(1.02) translateY(-1px)',
                        transition:
                            'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.25)',
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
