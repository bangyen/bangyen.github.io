import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { useLocalStorage } from './useLocalStorage';

/**
 * Theme mode setting - can be explicitly set or follow system preference.
 * - 'light': Force light theme
 * - 'dark': Force dark theme
 * - 'system': Follow OS/browser preference
 */
type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme mode after system preference is applied.
 * Always resolves to either 'light' or 'dark'.
 */
type ResolvedThemeMode = 'light' | 'dark';

/**
 * Context value provided by ThemeProvider.
 */
interface ThemeContextType {
    /** Current theme mode setting (may be 'system') */
    mode: ThemeMode;
    /** Actual resolved theme ('light' or 'dark') */
    resolvedMode: ResolvedThemeMode;
    /** Cycles through light → dark → system → light */
    toggleTheme: () => void;
}

const THEME_SERIALIZE = (v: ThemeMode): string => v;

const THEME_DESERIALIZE = (raw: string): ThemeMode | undefined => {
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    return undefined;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides theme context to the application.
 *
 * Features:
 * - Persists theme preference to localStorage via `useLocalStorage`
 * - Supports system preference detection via `prefers-color-scheme`
 * - Updates `data-theme` attribute on document root for CSS styling
 * - Automatically responds to system theme changes when mode is 'system'
 *
 * @param children - React children to wrap with theme context
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useLocalStorage<ThemeMode>('theme-mode', 'system', {
        serialize: THEME_SERIALIZE,
        deserialize: THEME_DESERIALIZE,
    });

    const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>(() => {
        if (mode !== 'system') return mode;
        return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    });

    // Effect to determine resolvedMode based on mode and system preference
    useEffect(() => {
        const handleSystemChange = (
            e: MediaQueryListEvent | MediaQueryList,
        ) => {
            if (mode === 'system') {
                setResolvedMode(e.matches ? 'dark' : 'light');
            }
        };

        const mediaQuery = globalThis.matchMedia(
            '(prefers-color-scheme: dark)',
        );

        if (mode === 'system') {
            handleSystemChange(mediaQuery); // Set initial value
            mediaQuery.addEventListener('change', handleSystemChange);
        } else {
            setResolvedMode(mode);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
    }, [mode]);

    // Update data-theme attribute when resolved theme changes
    useEffect(() => {
        document.documentElement.dataset['theme'] = resolvedMode;
    }, [resolvedMode]);

    const toggleTheme = () => {
        setMode(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    return (
        <ThemeContext.Provider value={{ mode, resolvedMode, toggleTheme }}>
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
