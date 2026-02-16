import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ThemeToggle } from '../ThemeToggle';

import { useThemeContext } from '@/hooks/useTheme';

// Mock useThemeContext
vi.mock('@/hooks/useTheme', () => ({
    useThemeContext: vi.fn(),
}));

describe('ThemeToggle', () => {
    it('should show dark mode icon and correct title in light mode', () => {
        vi.mocked(useThemeContext).mockReturnValue({
            mode: 'light',
            resolvedMode: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('should show system theme icon and correct title in dark mode', () => {
        vi.mocked(useThemeContext).mockReturnValue({
            mode: 'dark',
            resolvedMode: 'dark',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to system theme');
    });

    it('should show light mode icon and correct title in system mode', () => {
        vi.mocked(useThemeContext).mockReturnValue({
            mode: 'system',
            resolvedMode: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should call toggleTheme on click', () => {
        const toggleTheme = vi.fn();
        vi.mocked(useThemeContext).mockReturnValue({
            mode: 'light',
            resolvedMode: 'light',
            toggleTheme,
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(toggleTheme).toHaveBeenCalled();
    });
});
