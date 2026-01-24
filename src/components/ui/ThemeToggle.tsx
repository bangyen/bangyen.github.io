import React from 'react';
import { useThemeContext } from '../../hooks/useTheme';
import { LightModeRounded, DarkModeRounded } from '../icons';
import { TooltipButton } from './Controls';

export function ThemeToggle() {
    const { mode, toggleTheme } = useThemeContext();

    return (
        <TooltipButton
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleTheme}
            color="inherit"
            Icon={mode === 'light' ? DarkModeRounded : LightModeRounded}
        />
    );
}
