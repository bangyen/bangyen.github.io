import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from '../useTheme';

describe('useTheme (ThemeProvider and useThemeContext)', () => {
    let matchMediaSpy: jest.SpyInstance;
    let addListener: jest.Mock;
    let removeListener: jest.Mock;

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();

        addListener = jest.fn();
        removeListener = jest.fn();

        matchMediaSpy = jest
            .spyOn(window, 'matchMedia')
            .mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener,
                removeListener,
                addEventListener: addListener,
                removeEventListener: removeListener,
                dispatchEvent: jest.fn(),
            }));
    });

    afterEach(() => {
        matchMediaSpy.mockRestore();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
    );

    test('initializes with system mode and light resolvedMode if system is light', () => {
        const { result } = renderHook(() => useThemeContext(), { wrapper });

        expect(result.current.mode).toBe('system');
        expect(result.current.resolvedMode).toBe('light');
    });

    test('initializes with dark resolvedMode if system is dark', () => {
        matchMediaSpy.mockImplementation(query => ({
            matches: true,
            media: query,
            addListener,
            removeListener,
            addEventListener: addListener,
            removeEventListener: removeListener,
        }));

        const { result } = renderHook(() => useThemeContext(), { wrapper });
        expect(result.current.resolvedMode).toBe('dark');
    });

    test('initializes from localStorage', () => {
        localStorage.setItem('theme-mode', 'dark');
        const { result } = renderHook(() => useThemeContext(), { wrapper });

        expect(result.current.mode).toBe('dark');
        expect(result.current.resolvedMode).toBe('dark');
    });

    test('toggles themes in order: system -> light -> dark -> system', () => {
        const { result } = renderHook(() => useThemeContext(), { wrapper });

        expect(result.current.mode).toBe('system');

        act(() => {
            result.current.toggleTheme();
        });
        expect(result.current.mode).toBe('light');

        act(() => {
            result.current.toggleTheme();
        });
        expect(result.current.mode).toBe('dark');

        act(() => {
            result.current.toggleTheme();
        });
        expect(result.current.mode).toBe('system');
    });

    test('persists mode to localStorage and updates data-theme attribute', () => {
        const { result } = renderHook(() => useThemeContext(), { wrapper });

        act(() => {
            result.current.toggleTheme();
        }); // light
        expect(localStorage.getItem('theme-mode')).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'light'
        );

        act(() => {
            result.current.toggleTheme();
        }); // dark
        expect(localStorage.getItem('theme-mode')).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'dark'
        );
    });

    test('responds to system theme changes in system mode', () => {
        const { result } = renderHook(() => useThemeContext(), { wrapper });

        const handler = addListener.mock.calls[0][1];

        act(() => {
            handler({ matches: true });
        });
        expect(result.current.resolvedMode).toBe('dark');

        act(() => {
            handler({ matches: false });
        });
        expect(result.current.resolvedMode).toBe('light');
    });

    test('throws error if used outside of provider', () => {
        // Prevent console.error from cluttering the output
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        expect(() => renderHook(() => useThemeContext())).toThrow(
            'useThemeContext must be used within a ThemeProvider'
        );

        consoleSpy.mockRestore();
    });
});
