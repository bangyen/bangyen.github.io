import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import { router } from './config/routes';
import { createAppTheme } from './config/theme';
import { ThemeProvider, useThemeContext } from './hooks/useTheme';
import { GlobalStyles } from './styles/GlobalStyles';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

/**
 * Root application component that provides MUI theming and renders
 * the data router.  Lazy route loading and error boundaries are
 * handled by `createHashRouter` via the `lazy` and `errorElement`
 * properties in the route table.
 */
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
            <RouterProvider router={router} />
        </MuiThemeProvider>
    );
};

const root = createRoot(document.querySelector('#root') ?? document.body);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
