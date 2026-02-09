import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides theme context to the application.
 *
 * Features:
 * - Persists theme preference to localStorage
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
    // 1. Initialize state from localStorage or default to 'system'
    const [mode, setMode] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode');
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved as ThemeMode;
        }
        return 'system';
    });

    const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>('dark');

    // 2. Effect to determine resolvedMode based on mode and system preference
    useEffect(() => {
        const handleSystemChange = (
            e: MediaQueryListEvent | MediaQueryList
        ) => {
            if (mode === 'system') {
                setResolvedMode(e.matches ? 'dark' : 'light');
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

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

    // 3. Effect to persist mode and update data-theme attribute
    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolvedMode);
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
