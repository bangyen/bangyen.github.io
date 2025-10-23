import { createRoot } from 'react-dom/client';
import React, { Suspense, lazy } from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme, CssBaseline } from './components/mui';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    COMPONENT_VARIANTS,
} from './config/theme';

// Lazy load interpreters for better performance
const Stun_Step = lazy(() =>
    import('./Interpreters').then(m => ({ default: m.Stun_Step }))
);
const Suffolk = lazy(() =>
    import('./Interpreters').then(m => ({ default: m.Suffolk }))
);
const WII2D = lazy(() =>
    import('./Interpreters').then(m => ({ default: m.WII2D }))
);
const Back = lazy(() =>
    import('./Interpreters').then(m => ({ default: m.Back }))
);

// Lazy load pages
const Home = lazy(() => import('./Pages').then(m => ({ default: m.Home })));
const Error = lazy(() => import('./Pages').then(m => ({ default: m.Error })));
const Snake = lazy(() => import('./Pages').then(m => ({ default: m.Snake })));
const Lights_Out = lazy(() =>
    import('./Pages').then(m => ({ default: m.Lights_Out }))
);
const ZSharp = lazy(() => import('./Pages').then(m => ({ default: m.ZSharp })));
const Oligopoly = lazy(() =>
    import('./Pages').then(m => ({ default: m.Oligopoly }))
);
const Interpreters = lazy(() =>
    import('./Pages').then(m => ({ default: m.Interpreters }))
);

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
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        h2: {
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.h1,
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        h3: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.h2,
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.body,
            letterSpacing: '0',
            lineHeight: 1.4,
        },
        body1: {
            fontSize: TYPOGRAPHY.fontSize.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: '0',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: TYPOGRAPHY.fontSize.caption,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            letterSpacing: '0.025em',
            lineHeight: 1.4,
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
                        '&:hover': {
                            backgroundColor: COLORS.primary.dark,
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
                        ...COMPONENT_VARIANTS.interactiveCard,
                        padding: '24px',
                    },
                },
            ],
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface.elevated,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.lg,
                    transition: ANIMATIONS.transition,
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
            <Suspense
                fallback={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            color: COLORS.text.primary,
                        }}
                    >
                        Loading...
                    </div>
                }
            >
                <Routes>
                    {interpreters.map(({ Component, url }) =>
                        getRoute(Component, url)
                    )}
                    {pages.map(({ Component, url }) =>
                        getRoute(Component, url)
                    )}
                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Website />
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
