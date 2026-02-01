import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    resolvedMode: ResolvedThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
