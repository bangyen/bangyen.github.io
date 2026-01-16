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
const CCTLD = lazy(() => import('./Pages').then(m => ({ default: m.CCTLD })));
const DrivingSide = lazy(() =>
    import('./Pages').then(m => ({ default: m.DrivingSide }))
);
const TelephoneQuiz = lazy(() =>
    import('./Pages').then(m => ({ default: m.TelephoneQuiz }))
);
const VehicleRegistrationQuiz = lazy(() =>
    import('./Pages').then(m => ({ default: m.VehicleRegistrationQuiz }))
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
        },
        background: {
            default: COLORS.surface.background,
            paper: COLORS.surface.elevated,
        },
        text: {
            primary: COLORS.text.primary,
            secondary: COLORS.text.secondary,
        },
    },
    typography: {
        fontFamily: TYPOGRAPHY.fontFamily.primary,
        h1: {
            fontSize: TYPOGRAPHY.fontSize.h1,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        h2: {
            fontSize: TYPOGRAPHY.fontSize.h2,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        h3: {
            fontSize: TYPOGRAPHY.fontSize.subheading,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        body1: {
            fontSize: TYPOGRAPHY.fontSize.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
        },
        body2: {
            fontSize: TYPOGRAPHY.fontSize.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
        },
        caption: {
            fontSize: TYPOGRAPHY.fontSize.caption,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
        },
    },
    shape: {
        borderRadius: parseInt(SPACING.borderRadius.md),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    borderRadius: SPACING.borderRadius.md,
                    padding: `${SPACING.padding.xs} ${SPACING.padding.md}`,
                    transition: ANIMATIONS.transition,
                },
                contained: {
                    backgroundColor: COLORS.primary.main,
                    color: COLORS.text.primary,
                    '&:hover': {
                        backgroundColor: COLORS.primary.light,
                        transform: 'translateY(-2px)',
                    },
                },
                outlined: {
                    borderColor: COLORS.border.subtle,
                    color: COLORS.text.primary,
                    '&:hover': {
                        borderColor: COLORS.primary.main,
                        backgroundColor: COLORS.interactive.hover,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: COLORS.text.primary,
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.md,
                    color: COLORS.text.primary,
                    fontSize: TYPOGRAPHY.fontSize.caption,
                    padding: SPACING.padding.xs,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.sm,
                    color: COLORS.text.primary,
                    fontSize: TYPOGRAPHY.fontSize.caption,
                    height: 'auto',
                    padding: `0 ${SPACING.padding.sm}`,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: COLORS.surface.glass,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        borderRadius: SPACING.borderRadius.md,
                        '& fieldset': {
                            borderColor: COLORS.border.subtle,
                        },
                        '&:hover fieldset': {
                            borderColor: COLORS.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: COLORS.primary.main,
                        },
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: COLORS.text.secondary,
                    borderColor: COLORS.border.subtle,
                    '&.Mui-selected': {
                        backgroundColor: COLORS.interactive.selected,
                        color: COLORS.text.primary,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.selected,
                        },
                    },
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                },
            },
        },
    },
});

function App(): React.ReactElement {
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
                    <Route path="/" element={<Home />} />
                    <Route path="/error" element={<Error />} />
                    <Route path="/interpreters" element={<Interpreters />} />
                    <Route path="/Stun_Step" element={<Stun_Step />} />
                    <Route path="/Suffolk" element={<Suffolk />} />
                    <Route path="/WII2D" element={<WII2D />} />
                    <Route path="/Back" element={<Back />} />
                    <Route path="/snake" element={<Snake />} />
                    <Route path="/lights_out" element={<Lights_Out />} />
                    <Route path="/zsharp" element={<ZSharp />} />
                    <Route path="/oligopoly" element={<Oligopoly />} />
                    <Route path="/cctld" element={<CCTLD />} />
                    <Route path="/driving_side" element={<DrivingSide />} />
                    <Route path="/telephone_quiz" element={<TelephoneQuiz />} />
                    <Route
                        path={ROUTES.pages.Vehicle_Registration_Quiz}
                        element={<VehicleRegistrationQuiz />}
                    />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
