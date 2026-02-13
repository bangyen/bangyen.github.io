import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import ErrorBoundary from './components/layout/ErrorBoundary';
import {
    ThemeProvider as MuiThemeProvider,
    CssBaseline,
} from './components/mui';
import './styles/animations.css';
import { ROUTES } from './config/constants';
import { COLORS, createAppTheme } from './config/theme';
import { ThemeProvider, useThemeContext } from './hooks/useTheme';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

// Lazy load pages
const Home = lazy(() => import('./features/home/pages/Home'));
const Error = lazy(() => import('./pages/Error'));
const LightsOut = lazy(
    () => import('./features/games/lights-out/pages/LightsOut'),
);
const ZSharp = lazy(() => import('./features/research/pages/ZSharp'));
const Oligopoly = lazy(() => import('./features/research/pages/Oligopoly'));
const LightsOutResearch = lazy(
    () => import('./features/research/pages/LightsOut'),
);
const Slant = lazy(() => import('./features/games/slant/pages/Slant'));

const App = (): React.ReactElement => {
    const { resolvedMode } = useThemeContext();
    const theme = React.useMemo(
        () => createAppTheme(resolvedMode),
        [resolvedMode],
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
                    <Route path={ROUTES.pages.Home} element={<Home />} />
                    <Route path={ROUTES.pages.Error} element={<Error />} />
                    <Route
                        path={ROUTES.pages.LightsOut}
                        element={<LightsOut />}
                    />
                    <Route path={ROUTES.pages.ZSharp} element={<ZSharp />} />
                    <Route
                        path={ROUTES.pages.Oligopoly}
                        element={<Oligopoly />}
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

const root = createRoot(document.querySelector('#root') ?? document.body);
root.render(
    <React.StrictMode>
        <HashRouter basename="/">
            <ErrorBoundary>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </ErrorBoundary>
        </HashRouter>
    </React.StrictMode>,
);
