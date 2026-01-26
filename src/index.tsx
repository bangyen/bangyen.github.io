import { createRoot } from 'react-dom/client';
import React, { Suspense, lazy } from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import {
    ThemeProvider as MuiThemeProvider,
    CssBaseline,
} from './components/mui';
import ErrorBoundary from './components/layout/ErrorBoundary';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import { COLORS, createAppTheme } from './config/theme';
import { ThemeProvider, useThemeContext } from './hooks/useTheme';

// Lazy load pages
// ... (omitting lazy loads for brevity in ReplacementContent, but they must be kept)
const Home = lazy(() => import('./pages').then(m => ({ default: m.Home })));
const Error = lazy(() => import('./pages').then(m => ({ default: m.Error })));
const Snake = lazy(() => import('./pages').then(m => ({ default: m.Snake })));
const LightsOut = lazy(() =>
    import('./pages').then(m => ({ default: m.Lights_Out }))
);
const ZSharp = lazy(() => import('./pages').then(m => ({ default: m.ZSharp })));
const Oligopoly = lazy(() =>
    import('./pages').then(m => ({ default: m.Oligopoly }))
);
const Interpreters = lazy(() =>
    import('./pages').then(m => ({ default: m.Interpreters }))
);
const WikipediaQuiz = lazy(() =>
    import('./pages').then(m => ({ default: m.WikipediaQuiz }))
);

const App = (): React.ReactElement => {
    const { resolvedMode } = useThemeContext();
    const theme = React.useMemo(
        () => createAppTheme(resolvedMode),
        [resolvedMode]
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
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
                    <Route path="/snake" element={<Snake />} />
                    <Route path="/lights-out" element={<LightsOut />} />
                    <Route path="/zsharp" element={<ZSharp />} />
                    <Route path="/oligopoly" element={<Oligopoly />} />
                    <Route
                        path={ROUTES.pages.Geography}
                        element={<WikipediaQuiz />}
                    />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </MuiThemeProvider>
    );
};

const root = createRoot(document.getElementById('root') || document.body);
root.render(
    <React.StrictMode>
        <HashRouter basename="/">
            <ErrorBoundary>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </ErrorBoundary>
        </HashRouter>
    </React.StrictMode>
);
