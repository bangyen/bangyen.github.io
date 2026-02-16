import { useState, useEffect, useCallback } from 'react';

import { useLocalStorage } from './useLocalStorage';

/**
 * Theme mode setting - can be explicitly set or follow system preference.
 * - 'light': Force light theme
 * - 'dark': Force dark theme
 * - 'system': Follow OS/browser preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme mode after system preference is applied.
 * Always resolves to either 'light' or 'dark'.
 */
export type ResolvedThemeMode = 'light' | 'dark';

/**
 * Return type for `useThemePreference`.
 */
export interface ThemePreference {
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

/**
 * Manages the user's theme preference independently of React Context.
 *
 * Combines `useLocalStorage` for persistence with a `matchMedia`
 * listener for system-preference resolution.  Updates the
 * `data-theme` attribute on the document root so CSS variables
 * respond to theme changes.
 *
 * This hook is independently testable without a Context provider,
 * making it easier to unit-test theme logic in isolation.
 */
export function useThemePreference(): ThemePreference {
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
            handleSystemChange(mediaQuery);
            mediaQuery.addEventListener('change', handleSystemChange);
        } else {
            setResolvedMode(mode);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
    }, [mode]);

    useEffect(() => {
        document.documentElement.dataset['theme'] = resolvedMode;
    }, [resolvedMode]);

    const toggleTheme = useCallback(() => {
        setMode(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    }, [setMode]);

    return { mode, resolvedMode, toggleTheme };
}
