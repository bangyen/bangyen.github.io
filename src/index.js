import { createRoot } from 'react-dom/client';
import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme, CssBaseline } from './components/mui';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    COMPONENT_VARIANTS,
} from './config/theme';

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
            main: COLORS.text.secondary,
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
                        boxShadow: COLORS.shadow.mediumall,
                        '&:hover': {
                            backgroundColor: COLORS.primary.dark,
                            boxShadow: COLORS.shadow.medium,
                            transform: 'translateY(-1px)',
                        },
                        '&:focus': ANIMATIONS.presets.focus,
                    },
                },
                {
                    props: { variant: 'secondary' },
                    style: {
                        backgroundColor: 'transparent',
                        color: COLORS.text.secondary,
                        border: `1px solid ${COLORS.border.subtle}`,
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
                        '&:focus': ANIMATIONS.presets.focus,
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
                        transition: ANIMATIONS.transition,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.hover,
                            color: COLORS.text.primary,
                        },
                        '&:focus': ANIMATIONS.presets.focus,
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
                        boxShadow: COLORS.shadow.medium,
                    },
                },
                {
                    props: { variant: 'glassmorphism' },
                    style: {
                        ...COMPONENT_VARIANTS.card,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        padding: '24px',
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
                        boxShadow: COLORS.shadow.medium,
                        cursor: 'pointer',
                        '&:hover': {
                            ...ANIMATIONS.presets.scaleHover,
                            boxShadow: COLORS.shadow.medium,
                        },
                        '&:focus': ANIMATIONS.presets.focus,
                    },
                },
            ],
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface.elevated,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.lg,
                    boxShadow: COLORS.shadow.medium,
                    transition: ANIMATIONS.transition,
                    '&:hover': {
                        boxShadow: COLORS.shadow.medium,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.full,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    transition: ANIMATIONS.transition,
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
                    ...COMPONENT_VARIANTS.card,
                    padding: '8px 8px',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: SPACING.borderRadius.md,
                    margin: '0.25rem 0.25rem',
                    transition: ANIMATIONS.transition,
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
