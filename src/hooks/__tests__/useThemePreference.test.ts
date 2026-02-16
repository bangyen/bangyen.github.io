import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { useThemePreference } from '../useThemePreference';

describe('useThemePreference', () => {
    let matchMediaListeners: ((e: { matches: boolean }) => void)[];

    beforeEach(() => {
        localStorage.clear();
        matchMediaListeners = [];

        Object.defineProperty(globalThis, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                addEventListener: (
                    _event: string,
                    cb: (e: { matches: boolean }) => void,
                ) => {
                    matchMediaListeners.push(cb);
                },
                removeEventListener: vi.fn(),
            })),
        });
    });

    test('defaults to system mode', () => {
        const { result } = renderHook(() => useThemePreference());
        expect(result.current.mode).toBe('system');
    });

    test('resolves system mode based on matchMedia', () => {
        const { result } = renderHook(() => useThemePreference());
        expect(result.current.resolvedMode).toBe('dark');
    });

    test('toggles through light -> dark -> system -> light', () => {
        const { result } = renderHook(() => useThemePreference());

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

    test('persists mode to localStorage', () => {
        const { result } = renderHook(() => useThemePreference());

        act(() => {
            result.current.toggleTheme();
        });
        expect(localStorage.getItem('theme-mode')).toBe('light');
    });

    test('restores mode from localStorage', () => {
        localStorage.setItem('theme-mode', 'dark');
        const { result } = renderHook(() => useThemePreference());
        expect(result.current.mode).toBe('dark');
        expect(result.current.resolvedMode).toBe('dark');
    });

    test('updates data-theme attribute on document', () => {
        localStorage.setItem('theme-mode', 'light');
        renderHook(() => useThemePreference());
        expect(document.documentElement.dataset['theme']).toBe('light');
    });
});
