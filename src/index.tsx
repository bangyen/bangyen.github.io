import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';
import './styles/animations.css';
import { appRoutes, NotFoundPage } from './config/routes';
import { createAppTheme } from './config/theme';
import { ThemeProvider, useThemeContext } from './hooks/useTheme';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const App = (): React.ReactElement => {
    const { resolvedMode } = useThemeContext();
    const theme = React.useMemo(
        () => createAppTheme(resolvedMode),
        [resolvedMode],
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {appRoutes.map(({ path, component: Page }) => (
                        <Route key={path} path={path} element={<Page />} />
                    ))}
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
