import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { appRoutes, NotFoundPage, type RouteEntry } from './config/routes';
import { createAppTheme } from './config/theme';
import { ThemeProvider, useThemeContext } from './hooks/useTheme';
import { GlobalStyles } from './styles/GlobalStyles';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

/**
 * Recursively renders a route-entry tree into React Router `<Route>`
 * elements.  Leaf entries (path + component) become page routes; entries
 * with an `element` and `children` become layout routes whose children
 * are rendered inside `<Outlet>`.
 */
function renderRoutes(routes: RouteEntry[]): React.ReactNode {
    return routes.map((entry, index) => {
        if (entry.children) {
            return (
                <Route
                    key={entry.path ?? `layout-${String(index)}`}
                    element={entry.element}
                >
                    {renderRoutes(entry.children)}
                </Route>
            );
        }

        if (!entry.component) return null;
        const Page = entry.component;
        return <Route key={entry.path} path={entry.path} element={<Page />} />;
    });
}

const App = (): React.ReactElement => {
    const { resolvedMode } = useThemeContext();
    const theme = React.useMemo(
        () => createAppTheme(resolvedMode),
        [resolvedMode],
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {renderRoutes(appRoutes)}
                    <Route path="*" element={<NotFoundPage />} />
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
