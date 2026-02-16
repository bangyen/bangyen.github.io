import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

import type { ThemePreference } from './useThemePreference';
import { useThemePreference } from './useThemePreference';

const ThemeContext = createContext<ThemePreference | undefined>(undefined);

/**
 * Provides theme context to the application by delegating to
 * `useThemePreference` and distributing the result via Context.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const preference = useThemePreference();

    return (
        <ThemeContext.Provider value={preference}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context.
 *
 * @returns Theme context with mode, resolvedMode, and toggleTheme
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { resolvedMode, toggleTheme } = useThemeContext();
 *   return <button onClick={toggleTheme}>{resolvedMode}</button>;
 * }
 * ```
 */
export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
