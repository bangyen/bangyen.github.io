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
const Home = lazy(() => import('./features/home/pages/Home'));
const Error = lazy(() => import('./pages/Error'));
const LightsOut = lazy(
    () => import('./features/games/lights-out/pages/LightsOut')
);
const ZSharp = lazy(() => import('./features/research/pages/ZSharp'));
const Oligopoly = lazy(() => import('./features/research/pages/Oligopoly'));
const Interpreters = lazy(
    () => import('./features/interpreters/pages/Interpreters')
);
const WikipediaQuiz = lazy(
    () => import('./features/quiz/pages/WikipediaQuizPage')
);
const LightsOutResearch = lazy(
    () => import('./features/research/pages/LightsOut')
);
const Slant = lazy(() => import('./features/games/slant/pages/Slant'));

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
                    <Route path="/lights-out" element={<LightsOut />} />
                    <Route path="/zsharp" element={<ZSharp />} />
                    <Route path="/oligopoly" element={<Oligopoly />} />
                    <Route
                        path={ROUTES.pages.Geography}
                        element={<WikipediaQuiz />}
                    />
                    <Route
                        path={ROUTES.pages.LightsOutResearch}
                        element={<LightsOutResearch />}
                    />
                    <Route path={ROUTES.pages.Slant} element={<Slant />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Suspense>
        </MuiThemeProvider>
    );
};

const root = createRoot(document.getElementById('root') ?? document.body);
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
